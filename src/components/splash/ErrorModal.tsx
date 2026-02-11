import { useNavigate } from 'react-router'
import Button from '@/components/common/Button'
import Character from '@/assets/Character.png'

/** 숫자와 캐릭터 이미지가 겹치도록 (ErrorPage와 동일) */
const ErrorSection = ({ code }: { code: string }) => {
	const [a, , c] = code.split('')
	return (
		<div className='flex items-center justify-center w-full gap-0 min-h-[200px]'>
			<span className='text-[160px] leading-[120%] font-normal text-primary-400-normal font-[Mitr]!'>{a}</span>
			<img src={Character} alt='' className='w-[160px] h-[137px] object-contain shrink-0 -mx-3' />
			<span className='text-[160px] leading-[120%] font-normal text-primary-400-normal font-[Mitr]!'>{c}</span>
		</div>
	)
}

export interface ErrorModalProps {
    code: string
    message: string
	isOpen: boolean
	onClose: () => void
}

const ErrorModal = ({ code, message, isOpen, onClose }: ErrorModalProps) => {
	const navigate = useNavigate()

	if (!isOpen) return null

	const handleBack = () => {
		onClose()
		navigate(-1)
	}
	const handleHome = () => {
		onClose()
		navigate('/')
	}

	return (
		<div className='fixed inset-0 z-100 flex items-center justify-center bg-neutral-900/50'>
			<div className='bg-neutral-000 border border-neutral-200 rounded-12 shadow-drop-neutral-1 w-[600px] mx-4 flex flex-col items-center py-14 px-11.75'>
				<ErrorSection code={code} />
				<p className='title-2 font-semibold text-[18px] leading-[120%] text-neutral-900 text-center mt-4'>
					{message}
				</p>
				<div className='flex gap-3 justify-center items-center mt-8 w-full'>
					<Button
						type='button'
						className='body-1 font-semibold text-neutral-900 bg-neutral-000 min-w-[160px] border-[1.5px] border-neutral-200 px-2.5 py-3 hover:bg-neutral-100 rounded-12'
						onClick={handleBack}
					>
						이전으로
					</Button>
					<Button
						type='button'
						className='body-1 font-semibold text-neutral-900 bg-neutral-000 min-w-[160px] border-[1.5px] border-neutral-200 px-2.5 py-3 hover:bg-neutral-100 rounded-12'
						onClick={handleHome}
					>
						홈으로
					</Button>
				</div>
			</div>
		</div>
	)
}

export default ErrorModal
