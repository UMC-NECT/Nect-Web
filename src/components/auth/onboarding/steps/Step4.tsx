import ChipButton from '@/components/common/ChipButton'
import type { OnboardingFormType } from '@/utils/validate'
import { useFormContext } from 'react-hook-form'

const interest = [
	'IT · 웹/모바일 서비스',
	'출판 · 콘텐츠 제작',
	'예술 · 전시 · 미디어아트',
	'헬스케어 · 피트니스',
	'교육 · 에듀테크',
	'금융 · 핀테크',
	'게임 · 엔터테인먼트',
	'기타',
]

const Step4 = () => {
	// 유효성 검사용
	const { setValue, watch } = useFormContext<OnboardingFormType>()

	// 폼 데이터 감시
	const selectedInterest = watch('interest') || []

	const handleSelectInterest = (interest: string) => {
		const isAlreadySelected = selectedInterest.includes(interest)

		if (isAlreadySelected) {
			// 이미 선택한 항목 해제는 허용
			const newFields = selectedInterest.filter(f => f !== interest)
			setValue('interest', newFields, { shouldValidate: true })
		} else {
			// 새로 추가
			setValue('interest', [...selectedInterest, interest], { shouldValidate: true })
		}
	}

	return (
		<>
			<div className='mb-16'>
				{/* 타이틀 */}
				<div className='flex flex-col justify-center items-center gap-3.25 mb-19.25'>
					<div className='heading-3 text-neutral-900'>
						<span className='text-primary-500-normal'>관심 분야</span>를 골라주세요
					</div>
					<div className='title-2 text-neutral-500'>추후 프로필에서 변경 가능해요</div>
				</div>

				{/* 컨텐츠 */}
				<div className='w-126.5 grid grid-cols-2 gap-x-2.5 gap-y-3'>
					{interest.map(i => (
						<>
							<ChipButton
								key={i}
								text={i}
								isChecked={selectedInterest.includes(i)}
								onClick={() => handleSelectInterest(i)}
								className='body-1 px-5 py-2.5 w-full'
							/>
						</>
					))}
				</div>
			</div>
		</>
	)
}

export default Step4
