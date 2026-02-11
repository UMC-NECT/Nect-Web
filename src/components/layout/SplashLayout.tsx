import { Outlet, useNavigate } from "react-router"
import LogoIcon from '@/assets/icons/header/Logo.svg?react';

const SplashLayout = () => {
	const navigate = useNavigate()
	return (
		<>
            <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-[0px_4px_20px_0px_rgba(25,25,25,0.02)]">
            <div className="h-[66px] px-[92px]">
                <div className="mx-auto flex h-full items-center gap-9 relative">
                    {/* 로고 */}
                    <div className="flex items-center cursor-pointer">
                        <LogoIcon className="h-10 w-auto" onClick={() => navigate('/')} />
                    </div>
                </div>
            </div>
            </header>
			<Outlet />
		</>
	)
}

export default SplashLayout