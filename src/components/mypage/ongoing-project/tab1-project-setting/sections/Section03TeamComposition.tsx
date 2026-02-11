import Button from '@/components/common/Button'
import PencilIcon from '@/assets/icons/mypage/edit-pencil.svg?react'
import RoleTag from '@/components/mypage/RoleTag'
import type { RoleType } from '@/types/mypage/ongoindProject'

interface TeamRole {
	role: string
	targetCount: number
	members: Array<{ id: number; name: string }>
}

interface ISection03TeamComposition {
	teamRoles: TeamRole[]
	onEditClick: () => void
}

const Section03TeamComposition = ({ teamRoles, onEditClick }: ISection03TeamComposition) => {
	// 카테고리별로 그룹화
	const categoryMap: Record<string, string> = {
		PM: '기획',
		PLANNING: '기획',
		Design: '디자인',
		DESIGNER: '디자인',
		UI_UX: '디자인',
		Frontend: '프론트',
		FRONTEND: '프론트',
		Backend: '백엔드',
		BACKEND: '백엔드',
		AI_MACHINE_LEARNING: 'AI/ML',
		Service: '기획',
		SERVICE: '기획',
	}

	const categoryGroups: Record<string, TeamRole[]> = {}

	teamRoles.forEach(team => {
		const category = categoryMap[team.role] || '기타'
		if (!categoryGroups[category]) {
			categoryGroups[category] = []
		}
		categoryGroups[category].push(team)
	})

	const categoryOrder = ['기획', '디자인', '프론트', '백엔드', 'AI/ML', '기타']
	const sortedCategories = categoryOrder.filter(category => categoryGroups[category])
	return (
		<div className='flex flex-col gap-4 pl-5'>
			<div className='flex items-center justify-between'>
				<h3 className='title-2 font-bold text-neutral-900'>
					프로젝트 파트 / 팀원 구성 <span className='text-danger-700'>*</span>
				</h3>
				<Button color='text' size='sm' className='flex gap-1.25 group' onClick={onEditClick}>
					<PencilIcon className='w-4 h-4 group-hover:text-neutral-500' />팀 구성 편집
				</Button>
			</div>

			<div className='flex flex-col gap-3.5'>
				{sortedCategories.map(category => {
					const teams = categoryGroups[category]
					const totalCount = teams.reduce((sum, team) => sum + (team.targetCount ?? team.members.length), 0)

					return (
						<div key={category} className='flex items-center gap-1.25'>
							{/* 역할 */}
							<span className='w-22.5 body-1 text-neutral-900'>{category}</span>

							{/* n명 */}
							<span className='w-12.5 body-1 text-neutral-900'>{totalCount}명</span>

							{/* 태그들 */}
							<div className='flex items-center gap-2.5'>
								{teams.map(team => (
									<RoleTag key={team.role} role={team.role as RoleType} showTotal={false} />
								))}
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default Section03TeamComposition
