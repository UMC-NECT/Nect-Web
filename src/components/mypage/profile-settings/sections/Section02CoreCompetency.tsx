import { useRef, useEffect } from 'react'

interface ISection02CoreCompetency {
	value: string
	onChange: (value: string) => void
}

const Section02CoreCompetency = ({ value, onChange }: ISection02CoreCompetency) => {
	const competencyRef = useRef<HTMLTextAreaElement>(null)

	// 불렛만 있는지 확인
	const hasActualContent = (text: string) => {
		const withoutBullets = text.replace(/•/g, '').replace(/\s/g, '')
		return withoutBullets.length > 0
	}

	// textarea 자동 높이 조절
	useEffect(() => {
		if (competencyRef.current) {
			competencyRef.current.style.height = 'auto'
			competencyRef.current.style.height = `${competencyRef.current.scrollHeight}px`
		}
	}, [value])

	const handleCompetencyFocus = () => {
		if (!value) {
			onChange('• ')
		}
	}

	const handleCompetencyKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
			e.preventDefault()
			onChange(value + '\n• ')
		}
	}

	return (
		<section className='my-2.5'>
			<h2 className='title-2 font-bold text-neutral-900 mb-2  ml-5'>
				핵심역량 <span className='text-danger-700'>*</span>
			</h2>
			<textarea
				ref={competencyRef}
				className={`w-full min-h-29.75 px-5 py-4 text-[16px] leading-[180%] tracking-[-0.5px] resize-none focus:outline-none placeholder:text-[16px] placeholder:text-neutral-300 hover:bg-neutral-50 duration-200 ease-in-out rounded-12 ${
					hasActualContent(value) ? 'text-neutral-900' : 'text-neutral-300'
				}`}
				placeholder={`직무와 연관된 자신의 핵심 역량을 간단하게 적어주세요\n5줄 이내를 권장 드립니다.\nex. 사용자 경험을 기반으로 한 UX 전략 도출 및 서비스 프로토타입 설계 가능`}
				value={value}
				onFocus={handleCompetencyFocus}
				onChange={e => onChange(e.target.value)}
				onKeyDown={handleCompetencyKeyDown}
			/>
		</section>
	)
}

export default Section02CoreCompetency
