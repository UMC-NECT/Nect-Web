import { Outlet } from 'react-router'
import Header from '../header/Header'
import { Sidebar } from './sidebar/Sidebar'
import { useWorkspace } from '@/stores/useWorkspace'

export const Layout = () => {
	const { isWorkspace } = useWorkspace()

	return (
		<>
			<Header />
			{isWorkspace && <Sidebar />}
			<div className={`w-full max-w-main mx-auto px-[72px] ${isWorkspace ? 'pt-[66px]' : 'pt-[132px]'}`}>
				<Outlet />
			</div>
		</>
	)
}
