import { Outlet } from "react-router"

export const Layout = () => {
    return (
		<div className='w-full max-w-main mx-auto px-gutter'>
			<Outlet />
		</div>
	)
}