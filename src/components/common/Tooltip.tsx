import { cn } from '@/utils/cn'

type TooltipSide = 'top' | 'bottom' | 'left' | 'right'
type TooltipSize = 'small' | 'big'

interface TooltipProps {
    children: React.ReactNode
    side?: TooltipSide
    size?: TooltipSize
    dark?: boolean
    className?: string
}

const Tooltip = ({
    children,
    side = 'top',
    size = 'big',
    dark = true,
    className,
}: TooltipProps) => {
    const isSmall = size === 'small'
    const isHorizontal = side === 'left' || side === 'right'

    // 화살표 크기
    const arrowSize = isSmall ? 5 : 8

    // 배경색 및 텍스트 색상
    const bgColor = dark ? 'bg-neutral-500' : 'bg-white'
    const textColor = dark ? 'text-white' : 'text-neutral-600'
    const arrowColor = dark ? 'border-neutral-500' : 'border-white'

    // 화살표 위치별 스타일
    const getArrowStyles = () => {
        const size = isSmall ? 5 : 8
        const baseStyles = 'absolute w-0 h-0'

        switch (side) {
            case 'top':
                return cn(
                    baseStyles,
                    'bottom-0 left-1/2 -translate-x-1/2 translate-y-full',
                    `border-l-[${size}px] border-r-[${size}px] border-t-[${size}px]`,
                    'border-l-transparent border-r-transparent',
                    arrowColor.replace('border-', 'border-t-')
                )
            case 'bottom':
                return cn(
                    baseStyles,
                    'top-0 left-1/2 -translate-x-1/2 -translate-y-full',
                    `border-l-[${size}px] border-r-[${size}px] border-b-[${size}px]`,
                    'border-l-transparent border-r-transparent',
                    arrowColor.replace('border-', 'border-b-')
                )
            case 'left':
                return cn(
                    baseStyles,
                    'right-0 top-1/2 translate-x-full -translate-y-1/2',
                    `border-t-[${size}px] border-b-[${size}px] border-l-[${size}px]`,
                    'border-t-transparent border-b-transparent',
                    arrowColor.replace('border-', 'border-l-')
                )
            case 'right':
                return cn(
                    baseStyles,
                    'left-0 top-1/2 -translate-x-full -translate-y-1/2',
                    `border-t-[${size}px] border-b-[${size}px] border-r-[${size}px]`,
                    'border-t-transparent border-b-transparent',
                    arrowColor.replace('border-', 'border-r-')
                )
        }
    }

    return (
        <div
            className={cn(
                'relative inline-flex',
                !dark && 'shadow-drop-neutral-1',
                className
            )}
        >
            {/* 콘텐츠 영역 */}
            <div
                className={cn(
                    'rounded-[6px]',
                    bgColor,
                    textColor,
                    'caption-2 text-center whitespace-pre-wrap',
                    isSmall ? 'px-2 py-1' : 'px-3 py-2'
                )}
            >
                {children}
            </div>

            {/* 화살표 */}
            <div
                className={getArrowStyles()}
                style={{
                    borderLeftWidth: side === 'right' ? 0 : arrowSize,
                    borderRightWidth: side === 'left' ? 0 : arrowSize,
                    borderTopWidth: side === 'bottom' ? 0 : (side === 'top' ? arrowSize : arrowSize),
                    borderBottomWidth: side === 'top' ? 0 : (side === 'bottom' ? arrowSize : arrowSize),
                    borderLeftColor: side === 'left' ? (dark ? '#767676' : 'white') : 'transparent',
                    borderRightColor: side === 'right' ? (dark ? '#767676' : 'white') : 'transparent',
                    borderTopColor: side === 'top' ? (dark ? '#767676' : 'white') : 'transparent',
                    borderBottomColor: side === 'bottom' ? (dark ? '#767676' : 'white') : 'transparent',
                }}
            />
        </div>
    )
}

export default Tooltip
