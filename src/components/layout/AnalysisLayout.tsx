import { Outlet } from "react-router"
import Header from "../header/Header"

const AnalysisLayout = () => {
	return (
		<>
            <Header />
            <div className='w-full  pt-[66px]'>
			    <Outlet />
            </div>
		</>
	)
}

export default AnalysisLayout