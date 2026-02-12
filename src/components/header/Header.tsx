import ExploreHeader from './ExploreHeader'
import WorkspaceHeader from './WorkspaceHeader'
import { useWorkspace } from '@/stores/useWorkspace'

const Header = () => {
	const { isWorkspace, setIsWorkspace } = useWorkspace()

	if (isWorkspace) {
		return <WorkspaceHeader onNavigate={() => setIsWorkspace(false)} />
	}

	return (
		<ExploreHeader
			onNavigate={() => {
				setIsWorkspace(true)
			}}
		/>
	)
}

export default Header
