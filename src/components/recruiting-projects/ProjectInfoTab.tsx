import ProjectBasicInfo from './ProjectBasicInfo';
import ProjectGoalsSection from './ProjectGoalsSection';
import LeaderProfile from './LeaderProfile';
import ProjectHistory from './ProjectHistory';

interface ProjectInfoTabProps {
    getPositionStyle: (position: string) => string;
    variant?: 'default' | 'large';
}

const ProjectInfoTab = ({ getPositionStyle, variant = 'default' }: ProjectInfoTabProps) => {
    return (
        <div>
            <ProjectBasicInfo getPositionStyle={getPositionStyle} />
            <ProjectGoalsSection />
            <LeaderProfile getPositionStyle={getPositionStyle} />
            <ProjectHistory getPositionStyle={getPositionStyle} variant={variant} />
        </div>
    );
};

export default ProjectInfoTab;