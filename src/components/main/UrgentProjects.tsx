import More from '@/assets/icons/common/chevron-right.svg?react';
import BarIcon from '@/assets/icons/common/Bar.svg?react';
import { Link } from 'react-router';
import { useRecruitingProjects } from '@/hooks/queries/home';
import RoleTagChip from '@/components/mission-modal/RoleTagChip';
import type { ProjectCard, ProjectCardRoles, ProjectCardRoleItem } from '@/types/api/home/projects';

const UrgentProjects = () => {
    const { data: projects, isLoading, isError } = useRecruitingProjects(4);

    // roles.roles[].role_fields[] 기준으로 roleField+count 태그 배열 (최대 4개)
    const getRoleTags = (project: ProjectCard): { roleField: string; count: number }[] => {
        const rolesData = project.roles && 'roles' in project.roles ? (project.roles as ProjectCardRoles) : null;
        if (!rolesData?.roles?.length) return [];
        const map = new Map<string, number>();
        (rolesData.roles as ProjectCardRoleItem[]).forEach((role: ProjectCardRoleItem) => {
            (role.role_fields ?? []).forEach((rf) => {
                if (!rf.role_field) return;
                map.set(rf.role_field, (map.get(rf.role_field) ?? 0) + rf.count);
            });
        });
        return Array.from(map.entries())
            .map(([roleField, count]) => ({ roleField, count }))
            .slice(0, 4);
    };

    // authorPart 한글 변환
    const getDisplayPart = (part: string) => {
        const partMap: Record<string, string> = {
            'DEVELOPER': '개발',
            'DESIGNER': '디자인',
            'PLANNER': '기획',
            'OTHER': '기타',
        };
        return partMap[part] || part;
    };

    return (
		<div className='w-138 h-142.5'>
			<div className='flex justify-between items-center mb-5 w-138 h-7.5'>
				<h2 className='text-[22px] text-neutral-900 font-bold'>모집 중인 프로젝트</h2>
				{!isLoading && !isError && projects && projects.length > 0 && (
					<Link
						to='/projectList'
						className='w-16.5 h-6 flex items-center gap-1 cursor-pointer text-neutral-500 font-semibold text-md hover:text-neutral-700'
					>
						더보기
						<More className='w-4 h-4 stroke-neutral-500 hover:stroke-neutral-700 mr-1' />
					</Link>
				)}
			</div>

			{/* 로딩 상태 */}
			{isLoading && <div className='flex items-center justify-center h-100 text-neutral-500'>로딩 중...</div>}

			{/* 에러 상태 */}
			{isError && (
				<div className='flex items-center justify-center h-100 text-neutral-500'>프로젝트를 불러오는데 실패했습니다.</div>
			)}

			{/* 빈 데이터 상태 */}
			{!isLoading && !isError && (!projects || projects.length === 0) && (
				<div className='flex items-center justify-center h-100 text-neutral-500'>모집 중인 프로젝트가 없습니다.</div>
			)}

			{/* 프로젝트 리스트 */}
			{!isLoading && !isError && projects && projects.length > 0 && (
				<div className='flex flex-col gap-2'>
					{projects.map(project => (
						<Link
							key={project.projectId}
							to={`/recruiting-projects/${project.projectId}`}
							className='w-138 h-31 px-5.5 py-4 bg-white rounded-xl border border-neutral-100 cursor-pointer hover:border-purple-400 transition-colors block min-w-0 overflow-hidden'
						>
							{/* 상단: 제목 + 날짜 (D-day 위치 고정, 제목은 D-day 넘어가지 않음) */}
							<div className='flex justify-between items-start mb-3 h-13.25 gap-4 min-w-0'>
								<div className='flex flex-col gap-1.5 min-w-0 flex-1'>
									<div className='flex items-center gap-2 min-w-0 flex-nowrap'>
										<h3 className='body-1 text-neutral-900 font-semibold truncate min-w-0 max-w-full'>
											{project.projectName}
										</h3>
										<BarIcon className='w-0.5 h-3 shrink-0' />
										<span className='button-1 text-neutral-500 font-semibold whitespace-nowrap shrink-0'>
											{project.authorName} · {getDisplayPart(project.authorPart)}
										</span>
									</div>
									<p className='body-2 font-medium text-neutral-600 line-clamp-2 min-w-0'>{project.introduction}</p>
								</div>
								<span className='title-2 font-bold text-primary-500-normal whitespace-nowrap shrink-0'>
									D-{project.leftDays}
								</span>
							</div>

							{/* 하단: 태그 + 인원 */}
							<div className='flex justify-between items-center'>
								<div className='flex gap-2 flex-wrap'>
									{getRoleTags(project).map((tag, index) => (
										<RoleTagChip
											key={`${tag.roleField}-${index}`}
											roleId={index + 1}
											roleName={tag.roleField}
											roleField={tag.roleField}
											state='default'
											count={tag.count}
										/>
									))}
								</div>
								<span className='body-1 font-medium text-neutral-500 whitespace-nowrap w-14.75 h-6'>
									팀원{' '}
									<span className='text-neutral-700'>
										{project.curMemberCount}/{project.maxMemberCount}
									</span>
								</span>
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	)
};

export default UrgentProjects;