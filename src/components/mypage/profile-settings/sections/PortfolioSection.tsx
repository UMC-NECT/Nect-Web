import { useState } from 'react'
import Button from '../../../common/Button'
import ClipIcon from '@/assets/icons/mypage/clip.svg?react'

interface PortfolioItem {
	id: number
	title: string
	link: string
	file?: { name: string; url: string }
	isCompleted?: boolean // 입력 완료 상태
}

export const PortfolioSection = () => {
	const [portfolios, setPortfolios] = useState<PortfolioItem[]>([{ id: 1, title: '', link: '', isCompleted: false }])
	const [dragOver, setDragOver] = useState<number | null>(null)
	const [nextId, setNextId] = useState(2)

	const addPortfolio = () => {
		setPortfolios([...portfolios, { id: nextId, title: '', link: '', isCompleted: false }])
		setNextId(nextId + 1)
	}

	const updatePortfolio = (id: number, field: keyof PortfolioItem, value: string) => {
		setPortfolios(portfolios.map(p => (p.id === id ? { ...p, [field]: value } : p)))
	}

	// 엔터용 핸들러
	const handleKeyDown = (e: React.KeyboardEvent, id: number) => {
		if (e.key === 'Enter') {
			const portfolio = portfolios.find(p => p.id === id)
			if (portfolio && portfolio.title && portfolio.link) {
				setPortfolios(portfolios.map(p => (p.id === id ? { ...p, isCompleted: true } : p)))
			}
		}
	}

	// 드래그 핸들러 관련
	const handleDragOver = (e: React.DragEvent, id: number) => {
		e.preventDefault()
		setDragOver(id)
	}
	const handleDragLeave = () => {
		setDragOver(null)
	}
	const handleDrop = (e: React.DragEvent, id: number) => {
		e.preventDefault()
		setDragOver(null)

		const file = e.dataTransfer.files[0]
		if (file) {
			const reader = new FileReader()
			reader.onloadend = () => {
				// 파일명에서 확장자 제거
				const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '')
				setPortfolios(
					portfolios.map(p =>
						p.id === id ? { ...p, title: nameWithoutExt, file: { name: file.name, url: reader.result as string } } : p
					)
				)
			}
			reader.readAsDataURL(file)
		}
	}

	// 파일 추가
	const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
		const file = e.target.files?.[0]
		if (file) {
			const reader = new FileReader()
			reader.onloadend = () => {
				// 파일명에서 확장자 제거
				const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '')
				setPortfolios(
					portfolios.map(p =>
						p.id === id ? { ...p, title: nameWithoutExt, file: { name: file.name, url: reader.result as string } } : p
					)
				)
			}
			reader.readAsDataURL(file)
		}
	}

	// 파일 삭제
	const removePortfolio = (id: number) => {
		setPortfolios(portfolios.filter(p => p.id !== id))
	}

	return (
		<section className='ml-5'>
			<div className='flex items-center justify-between mb-1.5'>
				<h2 className='title-2 font-bold text-neutral-900'>포트폴리오 링크 및 파일</h2>

				<Button color='text' size='sm' onClick={addPortfolio}>
					+ 항목 추가
				</Button>
			</div>

			{portfolios.map(portfolio => (
				<div key={portfolio.id} className='mb-4'>
					<div
						className={`flex gap-2.5 items-start px-5 py-4 rounded-12 transition-colors ${
							dragOver === portfolio.id
								? 'bg-primary-100-light border-2 border-primary-500-normal'
								: 'hover:bg-neutral-50'
						}`}
						onDragOver={e => handleDragOver(e, portfolio.id)}
						onDragLeave={handleDragLeave}
						onDrop={e => handleDrop(e, portfolio.id)}
					>
						<ClipIcon className='w-5 h-5 mt-1 flex-shrink-0 text-neutral-400' />
						<div className='flex-1'>
							{portfolio.file || portfolio.isCompleted ? (
								<>
									{/* 파일명 / 링크제목 */}
									<div className='flex justify-between items-start'>
										<div className='flex-1'>
											<p className='body-1 text-primary-500-normal font-semibold mb-1'>
												{portfolio.title || portfolio.file?.name}
											</p>

											{/* 경로명 (최대 50자) */}
											<a
												href={portfolio.link || portfolio.file?.url}
												target='_blank'
												rel='noopener noreferrer'
												className='body-1 text-neutral-500 underline hover:text-neutral-700 cursor-pointer'
											>
												{(portfolio.link || portfolio.file?.url || '').length > 50
													? (portfolio.link || portfolio.file?.url || '').slice(0, 50) + '...'
													: portfolio.link || portfolio.file?.url}
											</a>
										</div>

										<span
											className='body-1 text-neutral-300 cursor-pointer hover:text-neutral-500'
											onClick={() => removePortfolio(portfolio.id)}
										>
											삭제
										</span>
									</div>
								</>
							) : (
								<>
									<input
										type='text'
										className='w-full body-1 text-neutral-900 bg-transparent focus:outline-none placeholder:text-neutral-300 mb-2'
										placeholder='제목'
										value={portfolio.title}
										onChange={e => updatePortfolio(portfolio.id, 'title', e.target.value)}
										onKeyDown={e => handleKeyDown(e, portfolio.id)}
									/>
									<input
										type='text'
										className='w-full body-1 text-neutral-900 bg-transparent focus:outline-none placeholder:text-neutral-300'
										placeholder='링크 붙여넣기 및 파일 드래그'
										value={portfolio.link}
										onChange={e => updatePortfolio(portfolio.id, 'link', e.target.value)}
										onKeyDown={e => handleKeyDown(e, portfolio.id)}
									/>
								</>
							)}

							<input
								type='file'
								accept='image/*,.pdf'
								onChange={e => handleFileInput(e, portfolio.id)}
								className='hidden'
								id={`file-input-${portfolio.id}`}
							/>
						</div>
					</div>
				</div>
			))}
		</section>
	)
}
