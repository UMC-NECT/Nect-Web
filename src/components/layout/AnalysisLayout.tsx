import { Outlet } from 'react-router'
import AnalysisHeader from '../header/AnalysisHeader'
import Footer from './Footer'

const AnalysisLayout = () => {
	return (
		<>
			<AnalysisHeader />
			<div className='w-full'>
				<Outlet />
			</div>
			<Footer type='Default' margin='196' />
		</>
	)
}

export default AnalysisLayout