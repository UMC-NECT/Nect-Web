import ChipButton from '@/components/common/ChipButton'
import { useFormContext } from 'react-hook-form'
import type { OnboardingFormType } from '@/utils/validate'
import DividerLine from '@/components/common/DividerLine'
import { useRef, useEffect } from 'react'
import { useOnboardingEnums } from '@/hooks/auth/useOnboardingEnums'

const Step2 = () => {
	const { setValue, watch } = useFormContext<OnboardingFormType>()
	const isDeactivatingRef = useRef(false)
	const { roles, roleFields } = useOnboardingEnums()

	// 값 감시
	const selectedRole = watch('role') || ''

	// 첫 렌더 시 역할이 비어 있으면 첫 번째 역할을 선택해 탭 활성화 + 해당 직종 리스트 표시
	useEffect(() => {
		if (roles.length > 0 && !selectedRole) {
			setValue('role', roles[0].value, { shouldValidate: true })
		}
	}, [roles, selectedRole, setValue])
	const selectedFields = watch('fields') || []
	const customFieldInput = watch('customField') || ''

	// 분야 목록 키: form에는 role value 저장, roleFields는 value로 키됨
	const displayRoleValue = selectedRole || (roles[0]?.value ?? '')
	const currentRoleFields = roleFields[displayRoleValue] ?? []

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
								key={role.value}
								text={role.label}
								isChecked={selectedRole === role.value}
								onClick={() => handleRoleClick(role.value)}
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
						{currentRoleFields.map(field => (
							<ChipButton
								className='body-1 w-full'
								key={field.value}
								text={field.label}
								isChecked={selectedFields.includes(field.value)}
								onClick={() => handleFieldClick(field.value)}
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
