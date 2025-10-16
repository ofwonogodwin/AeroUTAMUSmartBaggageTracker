'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { Camera, X, Square, Upload, Image as ImageIcon } from 'lucide-react'
import QrScanner from 'qr-scanner'

interface QRScannerProps {
    onScan: (qrCode: string) => void
    onClose: () => void
    isOpen: boolean
}

export default function QRScanner({ onScan, onClose, isOpen }: QRScannerProps) {
    const [isScanning, setIsScanning] = useState(false)
    const [error, setError] = useState('')
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isOpen) {
            startCamera()
        } else {
            stopCamera()
        }
        
        return () => {
            stopCamera()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen])

    const startCamera = async () => {
        try {
            setIsScanning(true)
            setError('')
            
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment', // Use back camera
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            })
            
            setStream(mediaStream)
            
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream
                await videoRef.current.play()
            }

        } catch (err) {
            console.error('Camera access error:', err)
            setError('Unable to access camera. Please ensure camera permissions are granted and try manual entry.')
            setIsScanning(false)
        }
    }

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => {
                track.stop()
            })
            setStream(null)
        }
        setIsScanning(false)
    }

    const extractBaggageCode = (qrResult: string): string => {
        try {
            // Try to parse as JSON first (for generated QR codes)
            const parsedData = JSON.parse(qrResult)
            if (parsedData.qr_code) {
                return parsedData.qr_code
            }
            if (parsedData.baggage_id) {
                return `BAG-${parsedData.baggage_id.split('-')[0].toUpperCase()}`
            }
        } catch {
            // If not JSON, check if it's already a baggage code format
            if (qrResult.match(/^BAG-[A-Z0-9]+$/i)) {
                return qrResult.toUpperCase()
            }
            
            // If it looks like a baggage ID, format it properly
            if (qrResult.match(/^[a-f0-9-]+$/i)) {
                const firstPart = qrResult.split('-')[0].toUpperCase()
                return `BAG-${firstPart}`
            }
        }
        
        // Return as-is if we can't parse it
        return qrResult
    }

    const handleCaptureImage = async () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current
            const video = videoRef.current
            const context = canvas.getContext('2d')
            
            if (context) {
                setIsProcessing(true)
                setError('')
                
                try {
                    canvas.width = video.videoWidth
                    canvas.height = video.videoHeight
                    context.drawImage(video, 0, 0)
                    
                    // Scan for QR code in the captured image
                    const result = await QrScanner.scanImage(canvas)
                    
                    if (result) {
                        // Parse the QR code result and extract baggage code
                        const baggageCode = extractBaggageCode(result)
                        // Stop camera after successful scan
                        stopCamera()
                        onScan(baggageCode)
                        onClose()
                    } else {
                        setError('No QR code found in the captured image. Please try again or use manual entry.')
                    }
                } catch (err) {
                    console.error('QR scanning error:', err)
                    setError('Failed to scan QR code from image. Please try again or use manual entry.')
                } finally {
                    setIsProcessing(false)
                }
            }
        }
    }

    const handleManualInput = () => {
        const code = prompt('Enter QR code manually (or try a demo code):')
        if (code && code.trim()) {
            // Stop camera when manual input is used
            stopCamera()
            onScan(code.trim())
            onClose()
        }
    }

    const handleFileUpload = () => {
        fileInputRef.current?.click()
    }

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file || !file.type.startsWith('image/')) {
            setError('Please select a valid image file')
            return
        }

        setIsProcessing(true)
        setError('')

        try {
            // Scan QR code from uploaded image
            const result = await QrScanner.scanImage(file)
            
            if (result) {
                // Parse the QR code result and extract baggage code
                const baggageCode = extractBaggageCode(result)
                // Stop camera after successful scan
                stopCamera()
                onScan(baggageCode)
                onClose()
            } else {
                setError('No QR code found in the uploaded image. Please try a different image or use manual entry.')
            }
        } catch (err) {
            console.error('QR scanning error:', err)
            setError('Failed to scan QR code from uploaded image. Please try a different image or use manual entry.')
        } finally {
            setIsProcessing(false)
        }

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const simulateScan = (demoCode: string) => {
        onScan(demoCode)
        onClose()
    }

    // Demo QR codes for testing
    const demoQRCodes = [
        'BAG-A8C74A09',
        'BAG-6A2E7EAD', 
        'BAG-4DAFF685',
        'BAG-F781DD59',
        'BAG-2106F8F3'
    ]

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">QR Code Scanner</h3>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onClose}
                        className="p-1"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {isScanning ? (
                    <div className="space-y-4">
                        <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                            <video
                                ref={videoRef}
                                className="w-full h-64 object-cover"
                                autoPlay
                                playsInline
                                muted
                            />
                            
                            {/* Scanner overlay */}
                            <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute inset-4 border-2 border-white rounded-lg opacity-50"></div>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <div className="w-48 h-48 border-2 border-blue-500 rounded-lg relative">
                                        {/* Corner brackets */}
                                        <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500"></div>
                                        <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500"></div>
                                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500"></div>
                                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500"></div>
                                        
                                        {/* Scanning line animation */}
                                        <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600 text-center">
                            Position the QR code within the frame, then capture
                        </p>

                        <div className="flex space-x-2">
                            <Button
                                onClick={handleCaptureImage}
                                disabled={isProcessing}
                                className="flex-1"
                            >
                                <Square className="h-4 w-4 mr-2" />
                                {isProcessing ? 'Processing...' : 'Capture'}
                            </Button>
                            <Button
                                onClick={handleFileUpload}
                                variant="outline"
                                disabled={isProcessing}
                                className="flex-1"
                            >
                                <ImageIcon className="h-4 w-4 mr-2" />
                                Upload Image
                            </Button>
                        </div>
                        
                        <Button
                            onClick={handleManualInput}
                            variant="outline"
                            disabled={isProcessing}
                            className="w-full"
                        >
                            Manual Entry
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="text-center py-8">
                            <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 mb-4">Scan QR codes using camera or upload an image</p>
                            <div className="flex space-x-2 mb-4">
                                <Button onClick={startCamera} disabled={isProcessing} className="flex-1">
                                    <Camera className="h-4 w-4 mr-2" />
                                    Start Camera
                                </Button>
                                <Button onClick={handleFileUpload} disabled={isProcessing} variant="outline" className="flex-1">
                                    <ImageIcon className="h-4 w-4 mr-2" />
                                    Upload Image
                                </Button>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h4 className="font-medium text-gray-900 mb-2">Try Demo QR Codes:</h4>
                            <div className="grid grid-cols-1 gap-2">
                                {demoQRCodes.map((code) => (
                                    <Button
                                        key={code}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => simulateScan(code)}
                                        className="text-left justify-start font-mono text-sm"
                                    >
                                        {code}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <Button
                            onClick={handleManualInput}
                            variant="outline"
                            disabled={isProcessing}
                            className="w-full"
                        >
                            Manual Entry
                        </Button>
                    </div>
                )}

                {/* Hidden canvas for image capture */}
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Hidden file input for image upload */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    aria-label="Upload QR code image"
                />
            </div>
        </div>
    )
}