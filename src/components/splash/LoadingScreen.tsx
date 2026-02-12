import Character from '@/assets/Character.png'

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
	return (
		<div className="fixed top-0 left-0 right-0 bottom-0 min-h-screen min-w-screen bg-neutral-000 flex flex-col items-center justify-center px-4 py-12">
			<style>{floatStyles}</style>

			<section className='flex flex-col items-center justify-center h-full'>
				<img className='animate-float w-[200px] h-[170px]' src={Character} alt="Character" />
				<p className='text-[28px] leading-[120%] font-semibold text-primary-500-normal'>Loading..</p>
			</section>
		</div>
	)
}

export default LoadingScreen