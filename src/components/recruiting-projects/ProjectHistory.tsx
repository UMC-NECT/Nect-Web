import ProjectHistoryCard from '@/components/common/ProjectHistoryCard';

interface ProjectHistoryProps {
    getPositionStyle: (position: string) => string;
    variant?: 'default' | 'large';
}

const ProjectHistory = ({ getPositionStyle, variant = 'default' }: ProjectHistoryProps) => {
    const projects = [
        {
            positions: ['PM', 'Backend'],
            title: '트리플 UX.UI 개선 및 리브랜딩',
            description: '사용 체류 시간을 늘리고 기업 비전에 맞게 전략 및 BI 제안 / 여행의 전반에 활용 될 수 있는 UX Flow 개선 / GUI 제작',
            period: '2025.10~2025.12',
            imageBg: 'bg-neutral-400'
        },
        {
            positions: ['Design'],
            title: '트리플 UX.UI 개선 및 리브랜딩',
            description: '사용 체류 시간을 늘리고 기업 비전에 맞게 전략 및 BI 제안 / 여행의 전반에 활용 될 수 있는 UX Flow 개선 / GUI 제작',
            period: '2025.10~2025.12',
            imageBg: 'bg-black'
        }
    ];

    return (
        <div className='mt-[64px] ml-[10px]'>
            <h3 className='font-bold text-[20px] mb-6'>팀원들의 프로젝트 히스토리</h3>
            
            <div className='grid grid-cols-2 gap-6'>
                {projects.map((project, index) => (
                    <ProjectHistoryCard
                        key={index}
                        positions={project.positions}
                        title={project.title}
                        description={project.description}
                        period={project.period}
                        imageBg={project.imageBg}
                        getPositionStyle={getPositionStyle}
                        variant={variant}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProjectHistory;