import ProjectBasicInfo from './ProjectBasicInfo';
import ProjectGoalsSection from './ProjectGoalsSection';
import LeaderProfile from './LeaderProfile';
import ProjectHistory from './ProjectHistory';
import type { ProjectDetailDto } from '@/types/api/project';

interface ProjectInfoTabProps {
    projectData: ProjectDetailDto;
    getPositionStyle: (position: string) => string;
    variant?: 'default' | 'large';
}

const ProjectInfoTab = ({ projectData, getPositionStyle, variant = 'default' }: ProjectInfoTabProps) => {
    return (
        <div>
            <ProjectBasicInfo projectData={projectData} getPositionStyle={getPositionStyle} />
            <ProjectGoalsSection projectData={projectData} />
            <LeaderProfile projectData={projectData} />
            <ProjectHistory projectData={projectData} getPositionStyle={getPositionStyle} variant={variant} />
        </div>
    );
};

export default ProjectInfoTab;