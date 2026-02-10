import { Outlet } from "react-router"
import ExploreHeader from "@/components/header/ExploreHeader"

const StudioLayout = () => {
	return (
		<>
            <ExploreHeader />
			<Outlet />
		</>
	)
}

export default StudioLayout