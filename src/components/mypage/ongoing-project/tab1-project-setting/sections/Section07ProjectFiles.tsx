import { useState } from 'react'
import { useFieldArray, type Control } from 'react-hook-form'
import Button from '@/components/common/Button'
import ClipIcon from '@/assets/icons/mypage/clip.svg?react'
import type { ProjectSettingsType } from '@/utils/schemas/projectSchema'

interface ISection07ProjectFiles {
	control: Control<ProjectSettingsType>
}

const Section07ProjectFiles = ({ control }: ISection07ProjectFiles) => {
	const {
		fields: portfolios,
		append: appendPortfolio,
		update: updatePortfolio,
		remove: removePortfolio,
	} = useFieldArray({
		control,
		name: 'portfolioFiles',
	})
	const [dragOver, setDragOver] = useState<number | null>(null)

	const addPortfolio = () => {
		appendPortfolio({ id: Date.now(), title: '', link: '', isCompleted: false })
	}

	const updatePortfolioField = (index: number, updates: Partial<(typeof portfolios)[0]>) => {
		updatePortfolio(index, { ...portfolios[index], ...updates })
	}

	const removePortfolioByIndex = (index: number) => {
		removePortfolio(index)
	}

	// 드래그 핸들러 관련
	const handleDragOver = (e: React.DragEvent, index: number) => {
		e.preventDefault()
		setDragOver(index)
	}
	const handleDragLeave = () => {
		setDragOver(null)
	}
	const handleDrop = (e: React.DragEvent, index: number) => {
		e.preventDefault()
		setDragOver(null)

		const file = e.dataTransfer.files[0]
		if (file) {
			const reader = new FileReader()
			reader.onloadend = () => {
				updatePortfolioField(index, {
					file: reader.result as string,
				})
			}
			reader.readAsDataURL(file)
		}
	}

	// 파일 추가
	const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
		const file = e.target.files?.[0]
		if (file) {
			const reader = new FileReader()
			reader.onloadend = () => {
				updatePortfolioField(index, {
					file: reader.result as string,
				})
			}
			reader.readAsDataURL(file)
		}
	}

	// 제목 입력 변경 핸들러
	const handleTitleChange = (index: number, title: string) => {
		updatePortfolioField(index, { title })
	}

	// 링크 입력 변경 핸들러
	const handleLinkChange = (index: number, link: string) => {
		updatePortfolioField(index, { link })
	}

	// 엔터 키로 완료 처리
	const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			updatePortfolioField(index, { isCompleted: true })
		}
	}

	return (
		<section className='ml-5'>
			<div className='flex items-center justify-between mb-1.5'>
				<h2 className='title-2 font-bold text-neutral-900'>프로젝트 세부 기획 파일</h2>

				<Button color='text' size='sm' onClick={addPortfolio}>
					+ 파일 추가
				</Button>
			</div>

			{portfolios.map((portfolio, index) => (
				<div key={portfolio.id} className='mb-4'>
					<div
						className={`flex gap-2.5 items-start px-5 py-4 rounded-12 transition-colors ${
							dragOver === index ? 'bg-primary-100-light border-2 border-primary-500-normal' : 'hover:bg-neutral-50'
						}`}
						onDragOver={e => handleDragOver(e, index)}
						onDragLeave={handleDragLeave}
						onDrop={e => handleDrop(e, index)}
					>
						<ClipIcon className='w-5 h-5 mt-1 shrink-0 text-neutral-400' />
						<div className='flex-1'>
							{portfolio.file || portfolio.isCompleted ? (
								<>
									{/* 파일명 */}
									<div className='flex justify-between items-start'>
										<div className='flex-1'>
											<p className='body-1 text-primary-500-normal font-semibold mb-1'>{portfolio.title}</p>

											{/* 경로명 (최대 50자) */}
											<a
												href={portfolio.link}
												target='_blank'
												rel='noopener noreferrer'
												className='body-1 text-neutral-500 underline hover:text-neutral-700 cursor-pointer'
											>
												{portfolio.link && portfolio.link.length > 50
													? portfolio.link.slice(0, 50) + '...'
													: portfolio.link}
											</a>
										</div>

										<span
											className='body-1 text-neutral-300 cursor-pointer hover:text-neutral-500'
											onClick={() => removePortfolioByIndex(index)}
										>
											삭제
										</span>
									</div>
								</>
							) : (
								<>
									<input
										type='text'
										placeholder='제목을 입력하세요'
										value={portfolio.title || ''}
										onChange={e => handleTitleChange(index, e.target.value)}
										onKeyDown={e => handleKeyDown(e, index)}
										className='w-full body-1 text-neutral-900 font-medium mb-1 focus:outline-none placeholder:text-neutral-300'
									/>
									<input
										type='text'
										placeholder='파일 붙여넣기 또는 외부 링크를 입력하세요'
										value={portfolio.link || ''}
										onChange={e => handleLinkChange(index, e.target.value)}
										onKeyDown={e => handleKeyDown(e, index)}
										className='w-full body-1 text-neutral-400 focus:outline-none placeholder:text-neutral-300'
									/>
								</>
							)}

							<input
								type='file'
								accept='image/*,.pdf,.doc,.docx,.ppt,.pptx'
								onChange={e => handleFileInput(e, index)}
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

export default Section07ProjectFiles
