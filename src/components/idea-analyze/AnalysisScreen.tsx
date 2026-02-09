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

interface AnalysisScreenProps {
    name: string
    section: string
}

const AnalysisScreen = ({ name, section }: AnalysisScreenProps) => {
    return (
        <div className='absolute top-0 left-0 bg-neutral-000 z-100 h-screen w-screen'>
            <style>{floatStyles}</style>
            <section className='flex flex-col items-center justify-center h-full'>
                <img className='animate-float w-[324px] h-[277px]' src={Character} alt="Character" />
                <p className='heading-2 font-semibold text-neutral-800'><span className='text-primary-500-normal'>{name}</span>님의 {section}를 분석 중입니다..</p>
            </section>
        </div>
    )
}

export default AnalysisScreen