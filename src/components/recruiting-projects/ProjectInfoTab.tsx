import ProjectBasicInfo from './ProjectBasicInfo';
import ProjectGoalsSection from './ProjectGoalsSection';
import LeaderProfile from './LeaderProfile';
import ProjectHistory from './ProjectHistory';

interface ProjectInfoTabProps {
    getPositionStyle: (position: string) => string
}

const ProjectInfoTab = ({ getPositionStyle }: ProjectInfoTabProps) => {
    return (
        <div>
            <ProjectBasicInfo getPositionStyle={getPositionStyle} />
            <ProjectGoalsSection />
            <LeaderProfile getPositionStyle={getPositionStyle} />
            <ProjectHistory getPositionStyle={getPositionStyle} />
        </div>
    );
};

export default ProjectInfoTab;