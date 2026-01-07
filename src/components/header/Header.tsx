import { useState } from 'react';
import ExploreHeader from './ExploreHeader';
import WorkspaceHeader from './WorkspaceHeader';

const Header = () => {
    const [headerType, setHeaderType] = useState<'explore' | 'workspace'>('explore');

    if (headerType === 'workspace') {
        return <WorkspaceHeader onNavigate={() => setHeaderType('explore')} />;
    }
    
    return <ExploreHeader onNavigate={() => setHeaderType('workspace')} />;
};

export default Header;