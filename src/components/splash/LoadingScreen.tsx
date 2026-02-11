import Character from '@/assets/Character.png'
import LogoIcon from '@/assets/icons/header/Logo.svg?react';
import { useNavigate } from 'react-router';

const floatStyles = `
@keyframes float {
    0%, 100% {
        transform: translateY(-30px);
    }
    50% {
        transform: translateY(-47px);
    }
}
.animate-float {
    animation: float 1.7s ease-in-out infinite;
}
`

const LoadingScreen = () => {
	const navigate = useNavigate()
	return (
		<div className="min-h-screen min-w-screen bg-neutral-000 flex flex-col items-center justify-center px-4 py-12">
			<style>{floatStyles}</style>
            <header className="fixed top-0 left-0 right-0 bg-neutral-000 z-50 shadow-[0px_-4px_16px_rgba(23,23,20,0.04)]">
            <div className="h-[66px] px-[92px]">
                <div className="mx-auto flex h-full items-center gap-9 relative">
                    {/* 로고 */}
                    <div className="flex items-center cursor-pointer">
                        <LogoIcon className="h-10 w-auto" onClick={() => navigate('/')} />
                    </div>
                </div>
            </div>
            </header>

			<section className='flex flex-col items-center justify-center h-full'>
				<img className='animate-float w-[200px] h-[170px]' src={Character} alt="Character" />
				<p className='text-[28px] leading-[120%] font-semibold text-primary-500-normal'>Loading..</p>
			</section>
		</div>
	)
}

export default LoadingScreen