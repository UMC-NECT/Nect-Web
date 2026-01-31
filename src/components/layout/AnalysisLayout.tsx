import { Outlet } from 'react-router'
import AnalysisHeader from '../header/AnalysisHeader'

const AnalysisLayout = () => {
	return (
		<>
			<AnalysisHeader onNavigate={() => {}} />
			<div className='w-full'>
				<Outlet />
			</div>
		</>
	)
}

export default AnalysisLayout