"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import SignOutButton from "@/components/SignOutButton";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/FormElements";
import {
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  User,
  Settings,
  AlertCircle,
  ExternalLink,
  Search,
  BookOpen,
  Luggage,
  QrCode,
} from "lucide-react";

export default function SupportPage() {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    category: "general",
    subject: "",
    message: "",
  });

  const faqCategories = [
    { id: "all", name: "All Topics", icon: BookOpen },
    { id: "baggage", name: "Baggage Tracking", icon: Luggage },
    { id: "account", name: "Account & Login", icon: User },
    { id: "qr", name: "QR Codes", icon: QrCode },
    { id: "technical", name: "Technical Issues", icon: Settings },
    { id: "airport", name: "Airport Navigation", icon: MapPin },
  ];

  const faqs = [
    {
      category: "baggage",
      question: "How do I track my baggage?",
      answer:
        'You can track your baggage in three ways: 1) Log into your account and view "My Baggage", 2) Use the QR code scanner on the Track page, or 3) Enter your baggage QR code manually on the tracking page.',
    },
    {
      category: "baggage",
      question: "What do the different baggage statuses mean?",
      answer:
        "Checked In: Your bag has been processed at check-in. Security Cleared: Your bag has passed security screening. Loaded: Your bag is loaded onto the aircraft. In-Flight: Your bag is traveling with you. Arrived: Your bag has arrived at the destination and is ready for collection.",
    },
    {
      category: "qr",
      question: "Where can I find my QR code?",
      answer:
        'Your QR code is printed on your baggage receipt given at check-in. It starts with "BAG-" followed by 8 characters. You can also find it in your account dashboard after logging in.',
    },
    {
      category: "account",
      question: "How do I create an account?",
      answer:
        'Click "Get Started" or "Sign In" and then select "Create Account". You\'ll need your email, name, and a secure password. Your account will be automatically linked to your baggage when you check in.',
    },
    {
      category: "account",
      question: "I forgot my password, how do I reset it?",
      answer:
        'On the login page, click "Forgot Password". Enter your email address and follow the instructions sent to your email to reset your password.',
    },
    {
      category: "technical",
      question: "The QR scanner is not working, what should I do?",
      answer:
        "Ensure your camera permissions are enabled. Try cleaning your camera lens and ensuring good lighting. If the issue persists, you can manually enter your QR code on the tracking page.",
    },
    {
      category: "airport",
      question: "How do I navigate Entebbe International Airport?",
      answer:
        "Use our interactive airport map available in the main menu. It shows terminals, baggage claim areas, check-in counters, security checkpoints, and other important facilities.",
    },
    {
      category: "technical",
      question: "Why is my baggage status not updating?",
      answer:
        "Baggage status updates in real-time as your bag moves through different checkpoints. If you notice delays, this may be normal during busy periods. Contact support if status hasn't updated for more than 2 hours.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      (selectedCategory === "all" || faq.category === selectedCategory) &&
      (searchQuery === "" ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    alert("Thank you for your message! We'll get back to you within 24 hours.");
    setContactForm({
      name: "",
      email: "",
      category: "general",
      subject: "",
      message: "",
    });
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #faf8f6 0%, #f7f5f3 100%)",
      }}
    >
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-stone-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg shadow-md">
                <Luggage className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-stone-800">
                  AERO UTAMU
                </h1>
                <p className="text-xs text-amber-600 font-medium">
                  Support Center
                </p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/track"
                className="text-stone-600 hover:text-blue-600 font-medium transition-all duration-200 hover:scale-105"
              >
                Track Baggage
              </Link>
              <Link
                href="/map"
                className="text-stone-600 hover:text-amber-600 font-medium transition-all duration-200 hover:scale-105"
              >
                Airport Map
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <SignOutButton />
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-blue-600"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <HelpCircle className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Support Center</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get help with baggage tracking, account management, and navigating
            Entebbe International Airport
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Phone className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Call Support
                </h3>
                <p className="text-sm text-gray-500">24/7 assistance</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Speak directly with our support team
            </p>
            <div className="space-y-2">
              <p className="font-medium text-gray-900">+256 414 353 000</p>
              <p className="text-sm text-gray-500">Available 24/7</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Email Support
                </h3>
                <p className="text-sm text-gray-500">Response within 4 hours</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Send us detailed questions</p>
            <div className="space-y-2">
              <p className="font-medium text-gray-900">
                support@entebbe-airport.com
              </p>
              <p className="text-sm text-gray-500">Response time: 2-4 hours</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Visit Us
                </h3>
                <p className="text-sm text-gray-500">Information desk</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Get in-person assistance</p>
            <div className="space-y-2">
              <p className="font-medium text-gray-900">
                Terminal 1, Ground Floor
              </p>
              <p className="text-sm text-gray-500">Open: 5:00 AM - 11:00 PM</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search FAQ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {faqCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={
                      selectedCategory === category.id ? "primary" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center space-x-1"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{category.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <details
                key={index}
                className="border border-gray-200 rounded-lg"
              >
                <summary className="p-4 cursor-pointer hover:bg-gray-50 font-medium text-gray-900">
                  {faq.question}
                </summary>
                <div className="p-4 pt-0 text-gray-600 border-t border-gray-100">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                No FAQs found matching your search.
              </p>
            </div>
          )}
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-center space-x-2 mb-6">
            <MessageCircle className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Contact Support
            </h2>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <Input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, name: e.target.value })
                  }
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <Input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, email: e.target.value })
                  }
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                required
                value={contactForm.category}
                onChange={(e) =>
                  setContactForm({ ...contactForm, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="general">General Inquiry</option>
                <option value="baggage">Baggage Tracking Issue</option>
                <option value="account">Account Problems</option>
                <option value="technical">Technical Support</option>
                <option value="feedback">Feedback & Suggestions</option>
                <option value="complaint">Complaint</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <Input
                type="text"
                required
                value={contactForm.subject}
                onChange={(e) =>
                  setContactForm({ ...contactForm, subject: e.target.value })
                }
                placeholder="Brief description of your issue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <Textarea
                required
                rows={5}
                value={contactForm.message}
                onChange={(e) =>
                  setContactForm({ ...contactForm, message: e.target.value })
                }
                placeholder="Please provide detailed information about your issue or question..."
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Send Message
            </Button>
          </form>
        </div>

        {/* Additional Resources */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/map"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <MapPin className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Airport Map</h3>
            <p className="text-sm text-gray-600">
              Interactive map of Entebbe International Airport
            </p>
          </Link>

          <Link
            href="/track"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <QrCode className="h-8 w-8 text-green-600 mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Track Baggage</h3>
            <p className="text-sm text-gray-600">
              Real-time baggage tracking system
            </p>
          </Link>

          <a
            href="https://www.caa.co.ug/entebbe-international-airport/"
            target="_blank"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <ExternalLink className="h-8 w-8 text-purple-600 mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">
              Airport Website
            </h3>
            <p className="text-sm text-gray-600">
              Official Entebbe Airport information
            </p>
          </a>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Clock className="h-8 w-8 text-orange-600 mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Support Hours</h3>
            <p className="text-sm text-gray-600">
              24/7 phone support, 4-hour email response
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
