import { useEffect } from 'react'
import XIcon from '@/assets/icons/common/X.svg?react'

interface ConfirmModalProps {
	isOpen: boolean
	onClose: () => void
	title: string
	description?: string
	cancelText: string
	confirmText: string
	onCancel: () => void
	onConfirm: () => void
}

const ConfirmModal = ({
	isOpen,
	onClose,
	title,
	description,
	cancelText,
	confirmText,
	onCancel,
	onConfirm,
}: ConfirmModalProps) => {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen) {
				onClose()
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [isOpen, onClose])

	// 모달이 열리면 스크롤 방지
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = 'unset'
		}

		return () => {
			document.body.style.overflow = 'unset'
		}
	}, [isOpen])

	if (!isOpen) return null

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center'>
			{/* 배경 오버레이 */}
			<div className='absolute inset-0 bg-black/50' onClick={onClose} />

			{/* 모달 컨텐츠 */}
			<div className='relative bg-white rounded-12 px-10 py-8 min-w-120 shadow-lg'>
				{/* 닫기 버튼 */}
				<button
					onClick={onClose}
					className='absolute top-6 right-6 text-neutral-400 hover:text-neutral-600 transition-colors'
				>
					<XIcon className='w-6 h-6' />
				</button>

				{/* 타이틀 */}
				<h2 className='text-xl font-bold text-neutral-900 text-center mt-4 mb-2'>{title}</h2>

				{/* 설명 */}
				{description && <p className='body-1 text-neutral-600 text-center mb-8'>{description}</p>}

				{/* 버튼 영역 */}
				<div className='flex gap-4 justify-center'>
					<button
						onClick={onCancel}
						className='px-8 py-3 body-1 font-medium text-neutral-700 border border-neutral-300 rounded-12 hover:bg-neutral-50 transition-colors'
					>
						{cancelText}
					</button>
					<button
						onClick={onConfirm}
						className='px-8 py-3 body-1 font-medium text-white bg-primary-500-normal rounded-12 hover:bg-primary-600-normal transition-colors'
					>
						{confirmText}
					</button>
				</div>
			</div>
		</div>
	)
}

export default ConfirmModal
