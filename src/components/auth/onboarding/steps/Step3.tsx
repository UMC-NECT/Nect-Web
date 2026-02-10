import Accordion from '@/components/common/Accordion'
import CheckboxItem from '@/components/common/CheckboxItem'
import DividerLine from '@/components/common/DividerLine'
import Input from '@/components/common/Input'
import TagButton from '@/components/common/TagButton'
import type { OnboardingFormType } from '@/utils/validate'
import { useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import CheckIcon from '@/assets/icons/auth/check-icon.svg?react'
import { useOnboardingEnums } from '@/hooks/auth/useOnboardingEnums'
import type { EnumItem } from '@/types/api/enums'

const Step3 = () => {
	const [inputValue, setInputValue] = useState('')

	const {
		setValue,
		watch,
		formState: { errors },
	} = useFormContext<OnboardingFormType>()
	const { skillCategories, skillsByCategory } = useOnboardingEnums()

	// 폼에는 스킬 value 저장
	const selectedSkills = watch('skill') || []

	const handleSelectSkill = (skillValue: string) => {
		if (selectedSkills.includes(skillValue)) {
			setValue(
				'skill',
				selectedSkills.filter(f => f !== skillValue),
				{ shouldValidate: true }
			)
		} else {
			setValue('skill', [...selectedSkills, skillValue], { shouldValidate: true })
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
			e.preventDefault()
			const trimmed = inputValue.trim()
			if (!trimmed || selectedSkills.includes(trimmed)) return
			setValue('skill', [...selectedSkills, trimmed], { shouldValidate: true })
			setInputValue('')
		}
	}

	const allPredefinedValues = useMemo(
		() => new Set(skillCategories.flatMap(c => (skillsByCategory[c.value] ?? []).map(s => s.value))),
		[skillCategories, skillsByCategory]
	)

	const groupedSkills = (() => {
		const acc: Record<string, EnumItem[]> = {}
		for (const cat of skillCategories) {
			const skills = skillsByCategory[cat.value] ?? []
			const selectedInCat = skills.filter(s => selectedSkills.includes(s.value))
			if (selectedInCat.length > 0) acc[cat.label] = selectedInCat
		}
		const customValues = selectedSkills.filter(v => !allPredefinedValues.has(v))
		if (customValues.length > 0) {
			acc['직접 입력'] = customValues.map(value => ({ value, label: value }))
		}
		return acc
	})()

	return (
		<div className='flex flex-col justify-center items-center'>
			{/* 제목 */}
			<div className='flex flex-col justify-center items-center gap-3 mb-17.5'>
				<div className='heading-3 text-neutral-900'>
					활용 가능한 <span className='text-primary-500-normal'>대표 스킬</span>을 등록해주세요
				</div>
				<div className='title-2 text-neutral-500'>추후 프로필에서 변경 가능해요</div>
			</div>

			{/* 컨텐츠 */}
			<div className='sm:w-150 md:w-250 lg:w-350 flex justify-center items-start ml-24'>
				{/* 왼쪽 */}
				<div className='max-w-85.75 sm:w-50 md:w-60 lg:w-80 flex flex-col gap-1.5'>
					{skillCategories.map(cat => (
						<Accordion
							key={cat.value}
							title={cat.label}
							children={
								<>
									{(skillsByCategory[cat.value] ?? []).map(skill => (
										<CheckboxItem
											key={skill.value}
											label={skill.label}
											checked={selectedSkills.includes(skill.value)}
											onChange={() => handleSelectSkill(skill.value)}
										/>
									))}
								</>
							}
						/>
					))}

					{/* 직접입력 */}
					<Input
						placeholder={selectedSkills.length >= 20 ? '최대 개수 도달' : '직접입력 후 Enter'}
						disabled={selectedSkills.length >= 20}
						className='body-1 placeholder:body-1 placeholder:text-neutral-300 px-5 py-3.25'
						value={inputValue}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
						onKeyDown={handleKeyDown}
					/>
				</div>

				{/* 구분선 */}
				<DividerLine />

				{/* 오른쪽 */}
				<div className='w-109.5 sm:w-60 md:w-90 lg:w-100 h-84.25 flex flex-col justify-between'>
					<div className='overflow-y-auto flex flex-col gap-5 pb-4.25'>
						{Object.keys(groupedSkills).length === 0 ? (
							<div className='body-1 text-neutral-400'></div>
						) : (
							Object.entries(groupedSkills).map(([category, skills]) => (
								<div key={category} className='flex flex-col gap-3'>
									<div className='body-1 font-semibold text-neutral-800'>{category}</div>
									<div className='flex flex-wrap gap-2'>
										{skills.map(skill => (
											<TagButton
												key={skill.value}
												text={
													skill.label.startsWith('Adobe ')
														? skill.label.replace('Adobe ', '')
														: skill.label
												}
												onClick={() => handleSelectSkill(skill.value)}
											/>
										))}
									</div>
								</div>
							))
						)}
					</div>

					{/* 선택한 항목 개수 && 에러 메시지 */}
					<div className='flex justify-between mt-[13px]'>
						<span className='flex justify-center items-center gap-1'>
							{selectedSkills.length >= 20 && (
								<CheckIcon className={`w-3 h-3 ${errors.skill ? 'text-status-error' : 'text-status-success'}`} />
							)}

							{selectedSkills.length === 20 && (
								<>
									<span className='body-3 text-status-success'>대표 스킬 적용</span>
								</>
							)}

							{errors.skill && <span className='body-3 text-status-error'>{errors.skill.message}</span>}
						</span>
						<span className={`body-3 text-end ${errors.skill ? 'text-status-error' : 'text-status-success'}`}>
							{selectedSkills.length}/20
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Step3
