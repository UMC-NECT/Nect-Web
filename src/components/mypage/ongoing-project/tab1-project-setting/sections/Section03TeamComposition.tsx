import Button from '@/components/common/Button'
import PencilIcon from '@/assets/icons/mypage/edit-pencil.svg?react'
import RoleTag from '@/components/mypage/RoleTag'

interface TeamComposition {
	role: string
	count: number
	positions: { name: string; count: number }[]
}

interface ISection03TeamComposition {
	teamComposition: TeamComposition[]
	onEditClick: () => void
}

const Section03TeamComposition = ({ teamComposition, onEditClick }: ISection03TeamComposition) => {
	return (
		<div className='flex flex-col gap-4 pl-5'>
			<div className='flex items-center justify-between'>
				<h3 className='title-2 font-bold text-neutral-900'>
					프로젝트 파트 / 팀원 구성 <span className='text-semantic-700'>*</span>
				</h3>
				<Button color='text' size='sm' className='flex gap-1.25' onClick={onEditClick}>
					<PencilIcon className='w-4 h-4 hover:text-neutral-500' />팀 구성 편집
				</Button>
			</div>

			<div className='flex flex-col gap-3.5'>
				{teamComposition.map((team, index) => (
					<div key={index} className='flex items-center gap-1.25'>
						{/* 역할 */}
						<span className='w-22.5 body-1 text-neutral-900'>{team.role}</span>

						{/* n명 */}
						<span className='w-12.5 body-1 text-neutral-900'>{team.count}명</span>

						{/* 태그들 */}
						<div className='flex items-center gap-2.5'>
							{team.positions.map((position, idx) => (
								<RoleTag key={idx} role={position.name} total={position.count} />
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default Section03TeamComposition
