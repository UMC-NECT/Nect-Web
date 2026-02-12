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

/** 로딩 모달. 부모에서 {isLoading && <LoadingModal />} 형태로 사용 */
const LoadingModal = () => {
	return (
		<div className='fixed inset-0 z-100 flex items-center justify-center bg-neutral-900/50'>
			<style>{floatStyles}</style>
			<div className='bg-neutral-000 border border-neutral-200 rounded-12 shadow-drop-neutral-1 w-[600px] mx-4 flex flex-col items-center justify-center py-14 px-11.75'>
				<img className='animate-float w-[200px] h-[170px] mt-[56px]' src={Character} alt='' />
				<p className='text-[28px] leading-[120%] font-semibold text-primary-500-normal mt-4'>Loading..</p>
			</div>
		</div>
	)
}

export default LoadingModal
