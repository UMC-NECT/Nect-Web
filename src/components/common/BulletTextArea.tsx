import { useRef, useEffect, useMemo, useState } from 'react'

interface IBulletTextArea {
	value: string
	onChange: (value: string) => void
	hasSectionTitle?: boolean // 섹션 타이틀 유무
	sectionTitle?: string
	hasStar?: boolean // 필수 항목(*) 유무
	placeholder?: string
	className?: string
	minHeight?: string
	noDecoration?: boolean // 패딩, 호버, 라운드 등 장식 스타일 제거
}

// 순수 텍스트에 불렛 추가 (ui 출력용)
const addBullets = (text: string): string => {
	if (!text) return ''
	return text
		.split('\n')
		.map(line => `• ${line}`)
		.join('\n')
}

// 불렛 제거하여 순수 텍스트로 반환 (데이터 저장용)
const removeBullets = (text: string): string => {
	return text
		.split('\n')
		.map(line => line.replace(/^•\s?/, ''))
		.join('\n')
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
	noDecoration = false,
}: IBulletTextArea) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const pendingCursorRef = useRef<number | null>(null)
	const [isFocused, setIsFocused] = useState(false)

	// 외부 value에 불렛이 포함되어 있을 수 있으므로 항상 제거
	const cleanValue = useMemo(() => removeBullets(value), [value])

	// 외부 value(순수 텍스트)를 불렛이 포함된 display 값으로 변환 (포커스 시 빈 값이면 불렛만 표시)
	const displayValue = useMemo(() => {
		if (!cleanValue && isFocused) return '• '
		return addBullets(cleanValue)
	}, [cleanValue, isFocused])

	// placeholder에도 불렛 표시
	const bulletPlaceholder = useMemo(() => (placeholder ? addBullets(placeholder) : undefined), [placeholder])

	// 불렛만 있는지 확인
	const hasActualContent = (text: string) => {
		const withoutBullets = text.replace(/•/g, '').replace(/\s/g, '')
		return withoutBullets.length > 0
	}

	// textarea 자동 높이 조절 + 커서 위치 복원
	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto'
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`

			if (pendingCursorRef.current !== null) {
				textareaRef.current.selectionStart = pendingCursorRef.current
				textareaRef.current.selectionEnd = pendingCursorRef.current
				pendingCursorRef.current = null
			}
		}
	}, [displayValue])

	const handleFocus = () => setIsFocused(true)
	const handleBlur = () => setIsFocused(false)

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const inputValue = e.target.value
		// 불렛 제거 후 순수 텍스트 전달
		onChange(removeBullets(inputValue))
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
			e.preventDefault()
			const textarea = textareaRef.current
			if (!textarea) return

			const cursorPos = textarea.selectionStart
			const displayLines = displayValue.split('\n')

			// 커서가 위치한 줄 찾기
			let charCount = 0
			let lineIndex = 0
			for (let i = 0; i < displayLines.length; i++) {
				if (cursorPos <= charCount + displayLines[i].length) {
					lineIndex = i
					break
				}
				charCount += displayLines[i].length + 1
			}

			// 커서가 있는 줄 다음에 새 줄 삽입
			const valueLines = cleanValue.split('\n')
			valueLines.splice(lineIndex + 1, 0, '')
			const newValue = valueLines.join('\n')
			onChange(newValue)

			// 새 줄의 "• " 뒤로 커서 이동 예약
			const newDisplayLines = addBullets(newValue).split('\n')
			let newCursorPos = 0
			for (let i = 0; i <= lineIndex; i++) {
				newCursorPos += newDisplayLines[i].length + 1
			}
			newCursorPos += 2 // "• " 뒤
			pendingCursorRef.current = newCursorPos
		}
		if (e.key === 'Backspace') {
			const textarea = textareaRef.current
			if (!textarea) return

			// 값이 없으면 포커스 해제
			if (!cleanValue) {
				e.preventDefault()
				textarea.blur()
				return
			}

			const cursorPos = textarea.selectionStart
			const selectionEnd = textarea.selectionEnd

			if (cursorPos !== selectionEnd) return

			const displayLines = displayValue.split('\n')

			// 커서가 위치한 줄 찾기
			let charCount = 0
			let lineIndex = 0
			for (let i = 0; i < displayLines.length; i++) {
				if (cursorPos <= charCount + displayLines[i].length) {
					lineIndex = i
					break
				}
				charCount += displayLines[i].length + 1
			}

			const valueLines = cleanValue.split('\n')
			const currentLineContent = valueLines[lineIndex]
			const posInLine = cursorPos - charCount

			// 빈 줄(불렛만 있는 라인)에서 Backspace → 해당 라인 삭제
			if (currentLineContent === '') {
				e.preventDefault()

				if (valueLines.length === 1) {
					onChange('')
					return
				}

				valueLines.splice(lineIndex, 1)
				const newValue = valueLines.join('\n')
				onChange(newValue)

				// 커서를 이전 줄 끝으로 이동 (첫 줄 삭제 시 새 첫 줄의 "• " 뒤로)
				const newDisplayLines = addBullets(newValue).split('\n')
				let newCursorPos = 0
				if (lineIndex > 0) {
					for (let i = 0; i < lineIndex; i++) {
						newCursorPos += newDisplayLines[i].length
						if (i < lineIndex - 1) newCursorPos += 1
					}
				} else {
					newCursorPos = 2
				}
				pendingCursorRef.current = newCursorPos
				return
			}

			// 커서가 불렛 영역("• ") 안에 있으면 삭제 방지
			if (posInLine <= 2) {
				e.preventDefault()
				return
			}
		}
	}

	const textareaElement = (
		<textarea
			ref={textareaRef}
			className={`w-full resize-none focus:outline-none overflow-y-hidden text-[16px] leading-[180%] tracking-[-0.5px] placeholder:text-[16px] placeholder:text-neutral-300 ${
				!noDecoration ? `${minHeight} px-5 py-4 hover:bg-neutral-50 duration-200 ease-in-out rounded-12` : ''
			} ${hasActualContent(displayValue) ? 'text-neutral-900' : 'text-neutral-300'} ${className}`}
			placeholder={bulletPlaceholder}
			value={displayValue}
			onFocus={handleFocus}
			onBlur={handleBlur}
			onChange={handleChange}
			onKeyDown={handleKeyDown}
		/>
	)

	if (!hasSectionTitle) return textareaElement

	return (
		<section className='my-2.5 w-full'>
			<h2 className='title-2 font-bold text-neutral-900 mb-2 ml-5'>
				{sectionTitle}
				{hasStar ? <span className='text-danger-700'> *</span> : ''}
			</h2>
			{textareaElement}
		</section>
	)
}

export default BulletTextArea
