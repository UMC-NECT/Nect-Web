import ProjectHistoryCard from '@/components/common/ProjectHistoryCard';
import type { ProjectDetailDto } from '@/types/api/project';

interface ProjectHistoryProps {
    projectData: ProjectDetailDto;
    getPositionStyle: (position: string) => string;
    variant?: 'default' | 'large';
    noTopMargin?: boolean;
}

const ProjectHistory = ({ projectData, getPositionStyle, variant = 'default', noTopMargin }: ProjectHistoryProps) => {
    const teamMemberProjects = projectData.defaultInfo?.team_member_projects || [];

    // 날짜 포맷팅
    const formatPeriod = (startDate: string, endDate: string | null) => {
        const start = new Date(startDate);
        const end = endDate ? new Date(endDate) : new Date();
        
        const formatDate = (date: Date) => {
            return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`;
        };
        
        return `${formatDate(start)}~${formatDate(end)}`;
    };

    const containerClass = noTopMargin ? 'ml-[10px]' : 'mt-[64px] ml-[10px]';

    if (teamMemberProjects.length === 0) {
        return (
            <div className={containerClass}>
                <h3 className='font-bold text-[20px] mb-6'>팀원들의 프로젝트 히스토리</h3>
                <p className='text-[16px] text-neutral-500'>프로젝트 히스토리가 없습니다.</p>
            </div>
        );
    }

    return (
        <div className={containerClass}>
            <h3 className='font-bold text-[20px] mb-6'>팀원들의 프로젝트 히스토리</h3>
            
            <div className='grid grid-cols-2 gap-6'>
                {teamMemberProjects.map((project: { project_id: number; title: string; description: string | null; created_at: string; ended_at: string | null; image_name: string | null }) => (
                    <ProjectHistoryCard
                        key={project.project_id}
                        positions={[]} // API에서 포지션 정보가 없으므로 빈 배열
                        title={project.title}
                        description={project.description || '설명이 없습니다.'}
                        period={formatPeriod(project.created_at, project.ended_at)}
                        imageBg={project.image_name ? '' : 'bg-neutral-400'}
                        imageUrl={project.image_name || undefined}
                        getPositionStyle={getPositionStyle}
                        variant={variant}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProjectHistory;