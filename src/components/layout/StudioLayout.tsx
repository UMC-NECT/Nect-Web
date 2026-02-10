import { Outlet } from "react-router"
import ExploreHeader from "../header/ExploreHeader"

const StudioLayout = () => {
	return (
		<>
            <ExploreHeader />
			<Outlet />
		</>
	)
}

export default StudioLayout