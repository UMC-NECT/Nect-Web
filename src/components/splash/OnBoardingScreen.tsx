import Logo from '@/assets/icons/header/Logo.svg?react'
import Character from '@/assets/Character.png'

const OnBoardingScreen = () => {

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
    return (
        <div className='min-w-screen min-h-screen bg-neutral-000 flex justify-center items-center gap-[49px]'>
            <style>{floatStyles}</style>
            <Logo />
            <img src={Character} alt='Character' className='animate-float w-[200px] h-[170px]' />
        </div>
    )
}

export default OnBoardingScreen