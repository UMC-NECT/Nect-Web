import { Outlet } from "react-router"
import Header from "../Header"

export const Layout = () => {
    return (
        <>
            <Header />
            <div className='w-full max-w-main mx-auto px-gutter'>
                <Outlet />
            </div>
        </>
    )
}