import Button from '@/components/common/Button'
import PencilIcon from '@/assets/icons/mypage/edit-pencil.svg?react'
import RoleTagChip from '@/components/mission-modal/RoleTagChip'
import { useGetTeamRolesQuery } from '@/hooks/mypage/useMypageApi'
import { useOnboardingEnums } from '@/hooks/auth/useOnboardingEnums'

interface TeamRole {
	id: number
	role: string
	displayLabel: string
	targetCount: number
}

interface ISection03TeamComposition {
	projectId: string
	onEditClick: () => void
}

const Section03TeamComposition = ({ projectId, onEditClick }: ISection03TeamComposition) => {
	const { data, isLoading } = useGetTeamRolesQuery(projectId)
	const { roles, roleFields } = useOnboardingEnums()

	const rawParts = data?.body?.parts
	const parts = (Array.isArray(rawParts) ? rawParts : rawParts ? [rawParts] : []) as Array<{
		id: number
		role_field: string | null
		custom_role_field_name: string | null
		label: string
		required_count: number
	}>

	const teamRoles: TeamRole[] = parts.map(p => ({
		id: p.id,
		role: p.role_field ?? p.custom_role_field_name ?? '',
		displayLabel: p.label,
		targetCount: p.required_count,
	}))

	// enum 기준: role_field → parent role 매핑 (getRoleFields 결과)
	const roleFieldToRole = new Map<string, string>()
	roles.forEach(r => {
		(roleFields[r.value] ?? []).forEach(f => roleFieldToRole.set(f.value, r.value))
	})

	// enum 기준: 역할별 그룹화 + roles 순서로 정렬
	const categoryGroups = new Map<string, TeamRole[]>()
	teamRoles.forEach(team => {
		const parentRole = roleFieldToRole.get(team.role) ?? 'OTHER'
		if (!categoryGroups.has(parentRole)) categoryGroups.set(parentRole, [])
		categoryGroups.get(parentRole)!.push(team)
	})

	// roles 순서대로 카테고리 순서 확정, 각 역할 내부는 roleFields 순서로 정렬
	const sortedCategoryItems = roles
		.filter(r => categoryGroups.has(r.value))
		.map(role => {
			const teams = categoryGroups.get(role.value) ?? []
			const fieldOrder = (roleFields[role.value] ?? []).map(f => f.value)
			const sorted = [...teams].sort((a, b) => {
				const ia = fieldOrder.indexOf(a.role)
				const ib = fieldOrder.indexOf(b.role)
				if (ia >= 0 && ib >= 0) return ia - ib
				if (ia >= 0) return -1
				if (ib >= 0) return 1
				return 0
			})
			return { categoryLabel: role.label, teams: sorted }
		})

	// enum에 없는 역할(CUSTOM 등)은 맨 뒤에
	const otherTeams = categoryGroups.get('OTHER') ?? []
	if (otherTeams.length > 0 && !roles.some(r => r.value === 'OTHER')) {
		sortedCategoryItems.push({ categoryLabel: '기타', teams: otherTeams })
	}

	if (isLoading) {
		return (
			<div className='flex flex-col gap-4 pl-5'>
				<h3 className='title-2 font-bold text-neutral-900'>
					프로젝트 파트 / 팀원 구성 <span className='text-danger-700'>*</span>
				</h3>
				<p className='body-1 text-neutral-500'>로딩 중...</p>
			</div>
		)
	}

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
				{sortedCategoryItems.map(({ categoryLabel, teams }) => {
					const totalCount = teams.reduce((sum, team) => sum + team.targetCount, 0)

					return (
						<div key={categoryLabel} className='flex items-center gap-1.25'>
							{/* 역할 */}
							<span className='w-22.5 body-1 text-neutral-900'>{categoryLabel}</span>

							{/* n명 */}
							<span className='w-12.5 body-1 text-neutral-900'>{totalCount}명</span>

							{/* 태그들 */}
							<div className='flex items-center gap-2.5'>
								{teams.map(team => (
									<RoleTagChip
										key={team.id}
										roleId={team.id}
										roleName={team.displayLabel}
										state='default'
									/>
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
