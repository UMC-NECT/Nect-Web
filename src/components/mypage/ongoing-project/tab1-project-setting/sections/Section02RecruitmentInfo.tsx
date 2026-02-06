import { useState } from 'react'
import { Controller, type Control, type FieldArrayWithId } from 'react-hook-form'
import Button from '@/components/common/Button'
import BulletTextArea from '@/components/common/BulletTextArea'
import type { RoleType } from '@/types/mypage/ongoindProject'
import type { ProjectSettingsType } from '@/utils/schemas/projectSchema'
import RoleSelectModal from '../RoleSelectModal'
import RoleTag from '@/components/mypage/RoleTag'
import { useTeamMembersStore } from '@/stores/useTeamMembersStore'

interface ISection02RecruitmentInfo {
	control: Control<ProjectSettingsType>
	fields: FieldArrayWithId<ProjectSettingsType, 'recruitmentInfo', 'id'>[]
	onAddItem: () => void
}

const Section02RecruitmentInfo = ({ control, fields, onAddItem }: ISection02RecruitmentInfo) => {
	const [openModalIndex, setOpenModalIndex] = useState<number | null>(null)
	const teamMembersByRole = useTeamMembersStore(state => state.teamMembersByRole)

	// 역할별 targetCount 가져오기
	const getTargetCount = (role: RoleType) => {
		const team = teamMembersByRole.find(t => t.role === role)
		return team?.targetCount ?? 0
	}

	return (
		<div className='flex flex-col pl-5'>
			{/* 타이틀 */}
			<div className='flex items-center justify-between'>
				<h3 className='title-2 font-bold text-neutral-900'>
					모집 정보 및 필수 스택 <span className='text-danger-700'>*</span>
				</h3>

				<Button color='text' size='sm' className='group flex gap-1.25' onClick={onAddItem}>
					<span className='text-neutral-400 group-hover:text-neutral-500 duration-200'>+</span>
					<span className='text-neutral-500 group-hover:text-neutral-600 duration-200'>모집 팀원 추가</span>
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
									showTotal={value ? true : false}
									total={value ? getTargetCount(value as RoleType) : 0}
									onClick={() => setOpenModalIndex(index)}
									className='cursor-pointer hover:opacity-80 transition-opacity'
								/>
								<RoleSelectModal
									isOpen={openModalIndex === index}
									onClose={() => setOpenModalIndex(null)}
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
