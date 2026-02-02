import { useState } from 'react'
import { Controller, type Control, type FieldArrayWithId } from 'react-hook-form'
import Button from '@/components/common/Button'
import BulletTextArea from '@/components/common/BulletTextArea'
import type { RoleType } from '@/types/mypage/ongoindProject'
import type { ProjectSettingsType } from '@/utils/schemas/projectSchema'
import RoleSelectModal from '../RoleSelectModal'
import RoleTag from '@/components/mypage/RoleTag'

const ROLE_VALUES: { role: RoleType }[] = [{ role: 'PM' }, { role: 'Design' }, { role: 'Frontend' }, { role: 'Backend' }]

interface ISection02RecruitmentInfo {
	control: Control<ProjectSettingsType>
	fields: FieldArrayWithId<ProjectSettingsType, 'recruitmentInfo', 'id'>[]
	onAddItem: () => void
}

const Section02RecruitmentInfo = ({ control, fields, onAddItem }: ISection02RecruitmentInfo) => {
	const [openModalIndex, setOpenModalIndex] = useState<number | null>(null)

	return (
		<div className='flex flex-col gap-4 pl-5'>
			{/* 타이틀 */}
			<div className='flex items-center justify-between'>
				<h3 className='title-2 font-bold text-neutral-900'>
					모집 정보 및 필수 스택 <span className='text-semantic-700'>*</span>
				</h3>

				<Button color='text' size='sm' className='flex gap-1.25' onClick={onAddItem}>
					+ 모집 팀원 추가
				</Button>
			</div>

			{/* 모집 팀원 목록 */}
			{fields.map((field, index) => (
				<div key={field.id} className='flex items-start gap-5.5'>
					{/* 선택 직무 */}
					<Controller
						name={`recruitmentInfo.${index}.role`}
						control={control}
						render={({ field: { value, onChange } }) => (
							<div className='relative shrink-0 mt-5 w-25'>
								<RoleTag
									role={value || '직무 선택'}
									showTotal={false}
									onClick={() => setOpenModalIndex(index)}
									className='cursor-pointer hover:opacity-80 transition-opacity'
								/>
								<RoleSelectModal
									isOpen={openModalIndex === index}
									onClose={() => setOpenModalIndex(null)}
									values={ROLE_VALUES}
									onSelect={role => {
										onChange(role)
										setOpenModalIndex(null)
									}}
								/>
							</div>
						)}
					/>

					{/* 역할 필드 */}
					<Controller
						name={`recruitmentInfo.${index}.description`}
						control={control}
						render={({ field: { value, onChange } }) => (
							<BulletTextArea
								value={value || ''}
								onChange={onChange}
								hasSectionTitle={false}
								placeholder='모집 팀원의 필수 스택과 팀에서 맡을 역할을 적어주세요.'
								minHeight='min-h-24'
							/>
						)}
					/>
				</div>
			))}
		</div>
	)
}

export default Section02RecruitmentInfo
