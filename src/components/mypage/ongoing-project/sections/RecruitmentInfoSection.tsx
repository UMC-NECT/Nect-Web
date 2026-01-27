import Button from '@/components/common/Button'
import BulletTextArea from '@/components/common/BulletTextArea'
import RoleSelectModal from '../RoleSelectModal'
import type { RoleType } from '../OngoingProject'

type ColorType = 'purple' | 'pink' | 'green' | 'blue'

interface RoleValue {
	role: RoleType
	color: ColorType
}

interface IRecruitmentInfoSection {
	isPartModalOpen: boolean
	setIsPartModalOpen: (open: boolean) => void
	selectedPart: RoleType
	setSelectedPart: (part: RoleType) => void
	roleValues: RoleValue[]
	recruitmentInfo: string
	setRecruitmentInfo: (value: string) => void
}

const RecruitmentInfoSection = ({
	isPartModalOpen,
	setIsPartModalOpen,
	selectedPart,
	setSelectedPart,
	roleValues,
	recruitmentInfo,
	setRecruitmentInfo,
}: IRecruitmentInfoSection) => {
	return (
		<div className='flex flex-col gap-4 pl-5'>
			{/* 타이틀 */}
			<div className='flex items-center justify-between'>
				<h3 className='title-2 font-bold text-neutral-900'>
					모집 정보 및 필수 스택 <span className='text-semantic-700'>*</span>
				</h3>

				<Button color='text' size='sm' className='flex gap-1.25' onClick={() => {}}>
					+ 모집 팀원 추가
				</Button>
			</div>

			{/* 추가 필드 */}
			<div className='flex gap-5.5'>
				{/* 선택 직무 */}
				<div className='relative'>
					<Button
						color='socialLogin'
						size='sm'
						onClick={() => setIsPartModalOpen(true)}
						className={`body-3 border-0 px-2 py-0.5 w-18 h-6 rounded-[6px] mt-5 ${
							selectedPart
								? 'bg-primary-100-light text-primary-500-normal'
								: 'bg-semantic-gray text-neutral-300'
						}`}
					>
						{selectedPart || '직무 선택'}
					</Button>
					<RoleSelectModal
						isOpen={isPartModalOpen}
						onClose={() => setIsPartModalOpen(false)}
						values={roleValues}
						onSelect={setSelectedPart}
					/>
				</div>

				{/* 역할 필드 */}
				<BulletTextArea
					value={recruitmentInfo}
					onChange={setRecruitmentInfo}
					hasSectionTitle={false}
					placeholder='모집 팀원의 필수 스택과 팀에서 맡을 역할을 적어주세요.'
					minHeight='min-h-24'
				/>
			</div>
		</div>
	)
}

export default RecruitmentInfoSection
