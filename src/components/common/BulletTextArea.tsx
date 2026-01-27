import { useRef, useEffect } from 'react'

interface IBulletTextArea {
	value: string
	onChange: (value: string) => void
	hasSectionTitle?: boolean // 섹션 타이틀 유무
	sectionTitle?: string
	hasStar?: boolean // 필수 항목(*) 유무
	placeholder?: string
	className?: string
	minHeight?: string
}

const BulletTextArea = ({
	value,
	onChange,
	hasSectionTitle = true,
	sectionTitle = '섹션 타이틀',
	hasStar = true,
	placeholder,
	className = '',
	minHeight = 'min-h-29.75',
}: IBulletTextArea) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	// 불렛만 있는지 확인
	const hasActualContent = (text: string) => {
		const withoutBullets = text.replace(/•/g, '').replace(/\s/g, '')
		return withoutBullets.length > 0
	}

	// textarea 자동 높이 조절
	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto'
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
		}
	}, [value])

	const handleFocus = () => {
		if (!value) {
			onChange('• ')
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
			e.preventDefault()
			onChange(value + '\n• ')
		}
	}

	return (
		<section className='my-2.5 w-full'>
			{hasSectionTitle ? (
				<h2 className='title-2 font-bold text-neutral-900 mb-2 ml-5'>
					{sectionTitle}
					{hasStar ? <span className='text-danger-700'>*</span> : ''}
				</h2>
			) : (
				''
			)}
			<textarea
				ref={textareaRef}
				className={`w-full ${minHeight} px-5 py-4 text-[16px] leading-[180%] tracking-[-0.5px] resize-none focus:outline-none placeholder:text-[16px] placeholder:text-neutral-300 hover:bg-neutral-50 duration-200 ease-in-out rounded-12 ${
					hasActualContent(value) ? 'text-neutral-900' : 'text-neutral-300'
				} ${className}`}
				placeholder={placeholder}
				value={value}
				onFocus={handleFocus}
				onChange={e => onChange(e.target.value)}
				onKeyDown={handleKeyDown}
			/>
		</section>
	)
}

export default BulletTextArea
