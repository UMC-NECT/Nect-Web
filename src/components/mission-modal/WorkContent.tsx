import { cn } from '@/utils/cn'

interface WorkContentProps {
    content?: string
    authorPart?: string
    authorName?: string
    timestamp?: string
    placeholder?: string
    mentions?: string[]
    className?: string
}

const WorkContent = ({
    content,
    authorPart,
    authorName,
    timestamp,
    placeholder = '미션의 업무 내용을 적어주세요',
    mentions = [],
    className,
}: WorkContentProps) => {
    const hasAuthorInfo = authorPart && authorName
    const hasContent = content && content.trim().length > 0

    // 멘션을 포함한 콘텐츠 렌더링
    const renderContent = () => {
        if (!hasContent) {
            return (
                <p className='body-3 font-medium text-neutral-300 overflow-hidden text-ellipsis whitespace-pre-wrap w-full'>
                    {placeholder}
                </p>
            )
        }

        // 멘션이 있는 경우 분리해서 렌더링
        if (mentions.length > 0) {
            let renderedContent = content
            const parts: React.ReactNode[] = []
            let lastIndex = 0

            mentions.forEach((mention, idx) => {
                const mentionText = `@${mention}`
                const mentionIndex = renderedContent.indexOf(mentionText, lastIndex)

                if (mentionIndex !== -1) {
                    // 멘션 이전 텍스트
                    if (mentionIndex > lastIndex) {
                        parts.push(
                            <span key={`text-${idx}`}>
                                {renderedContent.slice(lastIndex, mentionIndex)}
                            </span>
                        )
                    }
                    // 멘션 텍스트
                    parts.push(
                        <span key={`mention-${idx}`} className='text-neutral-400'>
                            {mentionText}
                        </span>
                    )
                    lastIndex = mentionIndex + mentionText.length
                }
            })

            // 남은 텍스트
            if (lastIndex < renderedContent.length) {
                parts.push(
                    <span key='text-last'>
                        {renderedContent.slice(lastIndex)}
                    </span>
                )
            }

            return (
                <p className='body-3 font-medium text-neutral-900 overflow-hidden text-ellipsis whitespace-pre-wrap w-full'>
                    {parts}
                </p>
            )
        }

        return (
            <p className='body-3 font-medium text-neutral-900 overflow-hidden text-ellipsis whitespace-pre-wrap w-full'>
                {content}
            </p>
        )
    }

    return (
        <div className={cn('flex flex-col items-start w-[526px]', hasAuthorInfo && 'gap-2', className)}>
            {/* 작성자 정보 헤더 */}
            {hasAuthorInfo && (
                <div className='flex items-center justify-between w-full'>
                    <div className='flex gap-1.5 items-center'>
                        <p className='body-3 font-medium text-neutral-900 overflow-hidden text-ellipsis'>
                            {authorPart}
                        </p>
                        <div className='w-0.5 h-3 bg-neutral-300 rounded-[6px]' />
                        <p className='body-3 font-medium text-neutral-900 overflow-hidden text-ellipsis'>
                            {authorName}
                        </p>
                    </div>
                    {timestamp && (
                        <p className='caption-2 text-neutral-400 text-right'>
                            {timestamp}
                        </p>
                    )}
                </div>
            )}

            {/* 업무 내용 */}
            {renderContent()}
        </div>
    )
}

export default WorkContent
