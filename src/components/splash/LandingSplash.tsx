import { useEffect, useState, useCallback, useRef } from 'react'
import { cn } from '@/utils/cn'
import Logo from '@/assets/icons/header/Logo.svg?react'
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

const SPLASH_DURATION_MS = 2500
const FADE_OUT_MS = 600

interface LandingSplashProps {
	onDone: () => void
}

const LandingSplash = ({ onDone }: LandingSplashProps) => {
	const [isExiting, setIsExiting] = useState(false)
	const doneCalledRef = useRef(false)

	const startExit = useCallback(() => {
		if (doneCalledRef.current) return
		setIsExiting(true)
	}, [])

	useEffect(() => {
		const timer = setTimeout(startExit, SPLASH_DURATION_MS)
		return () => clearTimeout(timer)
	}, [startExit])

	useEffect(() => {
		if (!isExiting) return
		const timer = setTimeout(() => {
			if (doneCalledRef.current) return
			doneCalledRef.current = true
			onDone()
		}, FADE_OUT_MS)
		return () => clearTimeout(timer)
	}, [isExiting, onDone])

	return (
		<div
			className={cn(
				'fixed inset-0 z-9999 min-h-screen min-w-screen bg-neutral-000 flex flex-col items-center justify-center px-4 py-12 cursor-pointer transition-opacity duration-600 ease-out',
				isExiting && 'opacity-0'
			)}
		>
			<style>{floatStyles}</style>

			<section className='flex flex-col items-center justify-center h-full gap-[73px] pb-[112px]'>
				<Logo className='w-[228px] h-auto' />
				<img className='animate-float w-[242px] h-[207px]' src={Character} alt="Character" decoding="async" />
			</section>
		</div>
	)
}

export default LandingSplash