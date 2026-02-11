import RecruitmentStatusChip from '@/components/common/RecruitmentStatusChip'
import RoleTagChip from '@/components/mission-modal/RoleTagChip'
import type { ProjectCard } from '@/types/api/home'
import type { ProjectCardRoles, ProjectCardRoleItem } from '@/types/api/home/projects'
import type { FC } from 'react'
import { useRef, useState, useLayoutEffect, useEffect } from 'react'
import { Link } from 'react-router'
import { useFieldsQuery } from '@/hooks/useFieldsQuery'

export interface RecommendationProjectCardProps {
	project: ProjectCard
	variant?: 'default' | 'list'
}

const RecommendationProjectCard: FC<RecommendationProjectCardProps> = ({ project, variant = 'default' }) => {
	const { fieldLabelMap } = useFieldsQuery()
	const getRoleFieldLabel = (value: string) => fieldLabelMap[value] ?? fieldLabelMap[value.toUpperCase()] ?? value

	const rolesData = project.roles && 'roles' in project.roles ? (project.roles as ProjectCardRoles) : null
	type TagItem = { label: string; count: number }
	const getRoleTagsWithCount = (): { tags: TagItem[]; total: number } => {
		if (!rolesData?.roles?.length) return { tags: [], total: 0 }
		const map = new Map<string, number>()
		;(rolesData.roles as ProjectCardRoleItem[]).forEach((role: ProjectCardRoleItem) => {
			;(role.role_fields ?? []).forEach(rf => {
				const label = getRoleFieldLabel(rf.role_field)
				if (!label) return
				map.set(label, (map.get(label) ?? 0) + rf.count)
			})
		})
		const entries = Array.from(map.entries()).map(([label, count]) => ({ label, count }))
		return { tags: entries.slice(0, 3), total: entries.length }
	}
	const { tags: roleTags, total: roleTagTotal } = getRoleTagsWithCount()
	const remainingCount = Math.max(0, roleTagTotal - 3)

	const tagsContainerRef = useRef<HTMLDivElement>(null)
	const [visibleCount, setVisibleCount] = useState(roleTags.length)

	// 영역이 넘치면 보여줄 칩 수 줄이기 / roleTags.length 초과 시 캡 (DOM 측정 동기화)
	useLayoutEffect(() => {
		const el = tagsContainerRef.current
		if (!el || roleTags.length === 0) return
		const schedule = (n: number) => requestAnimationFrame(() => setVisibleCount(n))
		if (visibleCount > roleTags.length) {
			schedule(roleTags.length)
			return
		}
		if (el.scrollWidth > el.clientWidth && visibleCount > 0) {
			schedule(visibleCount - 1)
		}
	}, [visibleCount, roleTags.length])

	// 컨테이너 리사이즈 시 다시 다 보이도록 시도
	useEffect(() => {
		const el = tagsContainerRef.current
		if (!el) return
		const ro = new ResizeObserver(() => setVisibleCount(roleTags.length))
		ro.observe(el)
		return () => ro.disconnect()
	}, [roleTags.length])

	const visibleTags = roleTags.slice(0, visibleCount)
	const showEllipsis = visibleCount < roleTags.length || remainingCount > 0

	// 변형에 따른 스타일 설정
	const sizeStyles = {
		default: {
			card: 'w-[360px]',
			image: 'h-50',
			height: 'h-[340px]',
			infoArea: '',
			infoMargin: 'mt-3.5',
			chipPosition: 'bottom-[7px]',
		},
		list: {
			card: 'w-[413px]',
			image: 'h-[230px]',
			height: 'h-[370px]',
			infoArea: 'h-[110px]',
			infoMargin: 'mt-[14px]',
			chipPosition: 'bottom-[22px]',
		},
	}

	const styles = sizeStyles[variant]

	return (
		<Link
			to={`/recruiting-projects/${project.projectId}`}
			className={`${styles.card} ${styles.height} min-w-0 overflow-hidden pb-4 flex flex-col bg-white rounded-xl cursor-pointer border border-neutral-100 hover:border-primary-400-normal hover:shadow-lg hover:-translate-y-2 transition-all duration-300`}
		>
			{/* 이미지 영역 - 카드 너비를 넘지 않도록 w-full 사용 */}
			<div className={`relative w-full ${styles.image} rounded-xl overflow-hidden`}>
				{project.imageUrl ? (
					<img src={project.imageUrl} alt={''} className='w-full h-full object-cover object-top bg-neutral-300 rounded-xl' />
				) : (
					<div className='w-full h-full bg-neutral-300 rounded-xl' />
				)}

				{/* 모집 중 태그 */}
				<div className={`absolute ${styles.chipPosition} right-3`}>
					<RecruitmentStatusChip status={project.status as '모집 전' | '모집 중' | '모집 완료'} />
				</div>
			</div>

			{/* 정보 영역 */}
			<div className={`flex flex-col flex-1 mx-5 ${styles.infoMargin} ${styles.infoArea} mt-3.5 min-h-0`}>
				<div className='flex justify-between items-center mb-1.5'>
					<div className='flex items-center gap-1.5 flex-1 h-6.5'>
						<h3 className='title-3 font-semibold text-neutral-900 truncate'>{project.projectName}</h3>
					</div>
					<span className='text-lg font-semibold text-primary-500-normal whitespace-nowrap'>D-{project.leftDays}</span>
				</div>

				<p className='body-2 text-neutral-600 font-medium line-clamp-2 h-[42px]'>
					{project.introduction || '프로젝트 설명이 없습니다.'}
				</p>

				<div className='flex gap-6 flex-wrap mt-auto items-center max-w-full'>
					<div
						ref={tagsContainerRef}
						className='flex gap-2 flex-1 min-w-0 overflow-hidden flex-nowrap items-center'
					>
						{visibleTags.map((tag, index) => (
							<RoleTagChip
								key={`${tag.label}-${index}`}
								roleId={index + 1}
								roleName={tag.label}
								state='default'
								count={tag.count}
							/>
						))}
						{showEllipsis && (
							<span className='body-1 px-2 py-0.5 font-medium text-neutral-700 shrink-0'>...</span>
						)}
					</div>
					{variant === 'list' && (
						<span className='text-[16px] font-medium text-neutral-500 whitespace-nowrap shrink-0'>
							팀원{' '}
							<span className='text-neutral-700'>
								{project.curMemberCount}/{project.maxMemberCount}
							</span>
						</span>
					)}
				</div>
			</div>
		</Link>
	)
}
export default RecommendationProjectCard
