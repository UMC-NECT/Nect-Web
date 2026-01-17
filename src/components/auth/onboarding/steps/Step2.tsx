import ChipButton from '@/components/common/ChipButton'
import { useFormContext } from 'react-hook-form'
import type { OnboardingFormType } from '@/utils/validate'
import DividerLine from '@/components/common/DividerLine'
import { useRef } from 'react'

const roles = ['디자이너', '개발자', '기획자', '마케터', '기타']

const roleFields: Record<string, string[]> = {
	디자이너: ['UX/UI', '3D/모션', '일러스트/그래픽', '웹툰/이모티콘', '제품', '공간', '사진/영상', '출판', '사운드'],
	개발자: [
		'프론트엔드',
		'백엔드',
		'풀스택',
		'IOS/안드로이드',
		'게임',
		'데이터 엔지니어',
		'하드웨어',
		'AI/머신러닝',
		'보안/네트워크',
	],
	기획자: ['서비스', 'UX', '앱/웹', '비즈니스', '공연/행사'],
	마케터: ['콘텐츠 제작', '광고/바이럴', '퍼포먼스', '라이브커머스', 'CRM', '데이터 분석', '브랜드 마케팅'],
	기타: ['운영/CS', '세무/법무/노무', '영업/제휴', '창업 컨설팅', '영상/음악 감독', '번역/통역', '원고 컨설턴트'],
}

const Step2 = () => {
	const { setValue, watch } = useFormContext<OnboardingFormType>()
	const isDeactivatingRef = useRef(false)

	// 값 감시
	const selectedRole = watch('role') || ''
	const selectedFields = watch('fields') || []
	const customFieldInput = watch('customField') || ''

	const displayRole = selectedRole || '디자이너' // 초기값은 디자이너

	// 직접입력 필드가 선택되었는지 확인용
	const isCustomFieldSelected = selectedFields.some(f => f.startsWith('직접입력:'))

	// 역할 클릭 핸들러
	const handleRoleClick = (role: string) => {
		setValue('role', role, { shouldValidate: true })
		setValue('fields', [], { shouldValidate: true })
		setValue('customField', '', { shouldValidate: true })
	}

	// 분야 클릭 핸들러
	const handleFieldClick = (field: string) => {
		const newFields = selectedFields.includes(field) ? selectedFields.filter(f => f !== field) : [...selectedFields, field]

		setValue('fields', newFields, { shouldValidate: true })
	}

	// 분야(직접 입력) 입력시 -> 최대 8글자 + setValue()
	const handleCustomFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		if (value.length <= 8) {
			setValue('customField', value, { shouldValidate: true })
		}
		// 텍스트를 수정 중이면 플래그 리셋
		isDeactivatingRef.current = false
	}

	// 포커스가 다시 들어오면 플래그 리셋하는용
	const handleCustomFieldFocus = () => {
		isDeactivatingRef.current = false
	}

	const handleCustomFieldBlur = () => {
		// 클릭으로 인한 비활성화인 경우 blur 무시
		if (isDeactivatingRef.current) {
			isDeactivatingRef.current = false
			return
		}

		if (customFieldInput.trim()) {
			const customValue = `직접입력:${customFieldInput.trim()}`
			const filtered = selectedFields.filter(f => !f.startsWith('직접입력:'))
			const newFields = [...filtered, customValue]
			setValue('fields', newFields, { shouldValidate: true })
		} else {
			const newFields = selectedFields.filter(f => !f.startsWith('직접입력:'))
			setValue('fields', newFields, { shouldValidate: true })
		}
	}

	// 직접입력 필드 클릭 핸들러
	const handleCustomFieldClick = () => {
		if (isCustomFieldSelected) {
			// 이미 선택되어 있다면 텍스트는 유지한채로 비활성화
			isDeactivatingRef.current = true
			const newFields = selectedFields.filter(f => !f.startsWith('직접입력:'))
			setValue('fields', newFields, { shouldValidate: true })
		}
	}

	return (
		<div className='flex flex-col'>
			{/* 제목 */}
			<h1 className='heading-3 text-neutral-900 text-center mb-15'>
				프로젝트에서 맡고 싶은 <span className='text-primary-500-normal'>역할과 분야</span>를 선택해주세요
			</h1>

			{/* 역할 && 분야 */}
			<div className='flex mb-auto'>
				{/* 역할 */}
				<div className='flex-1'>
					<div className='flex gap-2 justify-center items-center mb-6.75'>
						<span className='body-3 text-neutral-800 bg-neutral-200 px-2.25 py-0.5 rounded-full'>1</span>
						<span className='title-3 text-neutral-900'>역할</span>
					</div>

					<div className='w-73 flex flex-col gap-3'>
						{roles.map(role => (
							<ChipButton
								key={role}
								text={role}
								isChecked={selectedRole === role}
								onClick={() => handleRoleClick(role)}
							/>
						))}
					</div>
				</div>

				{/* 세로 구분선 */}
				<div className='mt-12.75'>
					<DividerLine />
				</div>

				{/* 분야 */}
				<div className='flex-1'>
					<div className='flex gap-2 justify-center items-center mb-6.75'>
						<span className='body-3 text-neutral-800 bg-neutral-200 px-2.25 py-0.5 rounded-full'>2</span>
						<span className='title-3 text-neutral-900'>분야</span>
					</div>

					<div className='w-82.5 grid grid-cols-2 gap-3'>
						{roleFields[displayRole].map(field => (
							<ChipButton
								key={field}
								text={field}
								isChecked={selectedFields.includes(field)}
								onClick={() => handleFieldClick(field)}
								className='body-1 w-full'
							/>
						))}

						{/* 직접입력 필드 */}
						<input
							type='text'
							placeholder='직접입력'
							value={customFieldInput}
							onChange={handleCustomFieldChange}
							onFocus={handleCustomFieldFocus}
							onBlur={handleCustomFieldBlur}
							onClick={handleCustomFieldClick}
							className={`px-5 py-2.5 w-full max-w-73 text-center border-2 rounded-xl body-1 duration-300 ease-in-out focus:outline-none cursor-pointer ${
								isCustomFieldSelected
									? 'text-neutral-50 font-semibold bg-primary-400-normal border-primary-400-normal'
									: 'text-neutral-900 bg-neutral-50 border-neutral-200 placeholder:text-neutral-300'
							}`}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Step2
