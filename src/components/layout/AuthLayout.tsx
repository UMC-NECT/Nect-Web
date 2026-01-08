import { Outlet } from 'react-router'

export const AuthLayout = () => {
	return (
		<>
			<div className='w-full max-w-main mx-auto px-gutter'>
				<Outlet />
			</div>
		</>
	)
}
