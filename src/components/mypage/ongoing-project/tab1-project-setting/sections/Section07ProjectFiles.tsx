import { useState } from 'react'
import { useFieldArray, type Control, type UseFormSetValue, type UseFormWatch } from 'react-hook-form'
import Button from '@/components/common/Button'
import ClipIcon from '@/assets/icons/mypage/clip.svg?react'
import type { ProjectSettingsType } from '@/utils/schemas/projectSchema'

interface ISection07ProjectFiles {
	control: Control<ProjectSettingsType>
	setValue: UseFormSetValue<ProjectSettingsType>
	watch: UseFormWatch<ProjectSettingsType>
}

const Section07ProjectFiles = ({ control, setValue, watch }: ISection07ProjectFiles) => {
	const {
		fields: portfolios,
		append: appendPortfolio,
		remove: removePortfolio,
	} = useFieldArray({
		control,
		name: 'portfolioFiles',
	})
	const [dragOver, setDragOver] = useState<number | null>(null)

	const addPortfolio = () => {
		appendPortfolio({ id: Date.now(), title: '', link: '', isCompleted: false })
	}

	const removePortfolioByIndex = (index: number) => {
		removePortfolio(index)
	}

	// 엔터용 핸들러
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			const currentTitle = watch(`portfolioFiles.${index}.title`)
			const currentLink = watch(`portfolioFiles.${index}.link`)
			if (currentTitle && currentLink) {
				setValue(`portfolioFiles.${index}.isCompleted`, true, { shouldDirty: true })
			}
		}
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
			const blobUrl = URL.createObjectURL(file)
			const reader = new FileReader()
			reader.onloadend = () => {
				const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '')
				setValue(`portfolioFiles.${index}.title`, nameWithoutExt, { shouldDirty: true })
				setValue(`portfolioFiles.${index}.link`, blobUrl, { shouldDirty: true })
				setValue(`portfolioFiles.${index}.file`, reader.result as string, { shouldDirty: true })
				setValue(`portfolioFiles.${index}.isCompleted`, true, { shouldDirty: true })
			}
			reader.readAsDataURL(file)
		}
	}

	// 파일 추가
	const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
		const file = e.target.files?.[0]
		if (file) {
			const blobUrl = URL.createObjectURL(file)
			const reader = new FileReader()
			reader.onloadend = () => {
				const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '')
				setValue(`portfolioFiles.${index}.title`, nameWithoutExt, { shouldDirty: true })
				setValue(`portfolioFiles.${index}.link`, blobUrl, { shouldDirty: true })
				setValue(`portfolioFiles.${index}.file`, reader.result as string, { shouldDirty: true })
				setValue(`portfolioFiles.${index}.isCompleted`, true, { shouldDirty: true })
			}
			reader.readAsDataURL(file)
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

			{portfolios.map((portfolio, index) =>
				(() => {
					const currentIsCompleted = watch(`portfolioFiles.${index}.isCompleted`)
					return (
						<div key={portfolio.id} className='mb-4'>
							<div
								className={`flex gap-2.5 items-start px-5 py-4 rounded-12 transition-colors ${
									dragOver === index
										? 'bg-primary-100-light border-2 border-primary-500-normal'
										: 'hover:bg-neutral-50'
								}`}
								onDragOver={e => handleDragOver(e, index)}
								onDragLeave={handleDragLeave}
								onDrop={e => handleDrop(e, index)}
							>
								<ClipIcon className='w-5 h-5 mt-1 shrink-0 text-neutral-400' />
								<div className='flex-1 flex gap-2 items-start'>
									<div className='flex-1'>
										<input
											type='text'
											className={`w-full body-1 bg-transparent focus:outline-none placeholder:text-neutral-300 mb-2 ${
												currentIsCompleted ? 'text-primary-500-normal font-semibold' : 'text-neutral-900'
											}`}
											placeholder='제목'
											value={watch(`portfolioFiles.${index}.title`) || ''}
											onChange={e =>
												setValue(`portfolioFiles.${index}.title`, e.target.value, { shouldDirty: true })
											}
											onKeyDown={e => handleKeyDown(e, index)}
											readOnly={currentIsCompleted}
										/>
										<input
											type='text'
											className={`w-full body-1 bg-transparent focus:outline-none placeholder:text-neutral-300 ${
												currentIsCompleted
													? 'text-neutral-500 underline cursor-pointer'
													: 'text-neutral-900'
											}`}
											placeholder='링크 붙여넣기 및 파일 드래그'
											value={watch(`portfolioFiles.${index}.link`) || ''}
											onChange={e =>
												setValue(`portfolioFiles.${index}.link`, e.target.value, { shouldDirty: true })
											}
											onKeyDown={e => handleKeyDown(e, index)}
											onClick={() => {
												if (currentIsCompleted) {
													const link = watch(`portfolioFiles.${index}.link`)
													if (link) {
														window.open(link, '_blank', 'noopener,noreferrer')
													}
												}
											}}
											readOnly={currentIsCompleted}
										/>
									</div>

									{currentIsCompleted && (
										<span
											className='body-1 text-neutral-300 cursor-pointer hover:text-neutral-500'
											onClick={() => removePortfolioByIndex(index)}
										>
											삭제
										</span>
									)}
								</div>

								<input
									type='file'
									accept='image/*,.pdf,.doc,.docx,.ppt,.pptx'
									onChange={e => handleFileInput(e, index)}
									className='hidden'
									id={`file-input-${portfolio.id}`}
								/>
							</div>
						</div>
					)
				})()
			)}
		</section>
	)
}

export default Section07ProjectFiles
