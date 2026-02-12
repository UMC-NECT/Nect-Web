import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import AnalysisHeader from '../header/AnalysisHeader'
import Footer from './Footer'

const AnalysisLayout = () => {
	const location = useLocation()

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [location.pathname])

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