import { StatusBadgeProps } from '@/types'
import { getStatusBadgeClass, getStatusDisplayName } from '@/lib/utils'

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm'
    }

    return (
        <span className={`${getStatusBadgeClass(status)} ${sizeClasses[size]}`}>
            {getStatusDisplayName(status)}
        </span>
    )
}