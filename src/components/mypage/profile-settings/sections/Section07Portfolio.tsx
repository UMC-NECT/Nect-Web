import { useState } from 'react'
import { useFieldArray, type Control, type UseFormSetValue, type UseFormWatch, useFormContext } from 'react-hook-form'
import Button from '../../../common/Button'
import ClipIcon from '@/assets/icons/mypage/clip.svg?react'
import PlusIcon from '@/assets/icons/common/plus.svg?react'
import type { ProfileFormDataType } from '@/utils/schemas/profileSchema'

interface ISection07Portfolio {
	control: Control<ProfileFormDataType>
	setValue: UseFormSetValue<ProfileFormDataType>
	watch: UseFormWatch<ProfileFormDataType>
}

const Section07Portfolio = ({ control, setValue, watch }: ISection07Portfolio) => {
	const { register } = useFormContext<ProfileFormDataType>()
	const {
		fields: portfolios,
		append: appendPortfolio,
		remove: removePortfolio,
	} = useFieldArray({
		control,
		name: 'portfolios',
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
			const currentTitle = watch(`portfolios.${index}.title`)
			const currentLink = watch(`portfolios.${index}.link`)
			if (currentTitle && currentLink) {
				setValue(`portfolios.${index}.isCompleted`, true, { shouldDirty: true })
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
				setValue(`portfolios.${index}.title`, nameWithoutExt, { shouldDirty: true })
				setValue(`portfolios.${index}.link`, blobUrl, { shouldDirty: true })
				setValue(`portfolios.${index}.file`, { name: file.name, url: reader.result as string }, { shouldDirty: true })
				setValue(`portfolios.${index}.isCompleted`, true, { shouldDirty: true })
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
				setValue(`portfolios.${index}.title`, nameWithoutExt, { shouldDirty: true })
				setValue(`portfolios.${index}.link`, blobUrl, { shouldDirty: true })
				setValue(`portfolios.${index}.file`, { name: file.name, url: reader.result as string }, { shouldDirty: true })
				setValue(`portfolios.${index}.isCompleted`, true, { shouldDirty: true })
			}
			reader.readAsDataURL(file)
		}
	}

	return (
		<section className='ml-5'>
			<div className='flex items-center justify-between mb-1.5'>
				<h2 className='title-2 font-bold text-neutral-900'>포트폴리오 링크 및 파일</h2>

				<Button color='text' size='sm' onClick={addPortfolio} className='group flex gap-1 justify-center items-center'>
					<PlusIcon className='w-4 h-4 text-neutral-400 group-hover:text-neutral-500' />
					항목 추가
				</Button>
			</div>

			{portfolios.map((portfolio, index) => {
				const currentIsCompleted = watch(`portfolios.${index}.isCompleted`)

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
										{...register(`portfolios.${index}.title`)}
										onKeyDown={e => handleKeyDown(e, index)}
									/>
									<input
										type='text'
										className={`w-full body-1 bg-transparent focus:outline-none placeholder:text-neutral-300 ${
											currentIsCompleted ? 'text-neutral-500 underline cursor-pointer' : 'text-neutral-900'
										}`}
										placeholder='링크 붙여넣기 및 파일 드래그'
										value={watch(`portfolios.${index}.link`) || ''}
										onChange={e =>
											setValue(`portfolios.${index}.link`, e.target.value, { shouldDirty: true })
										}
										onKeyDown={e => handleKeyDown(e, index)}
										onClick={() => {
											if (currentIsCompleted) {
												const link = watch(`portfolios.${index}.link`)
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
								accept='image/*,.pdf'
								onChange={e => handleFileInput(e, index)}
								className='hidden'
								id={`file-input-${portfolio.id}`}
							/>
						</div>
					</div>
				)
			})}
		</section>
	)
}

export default Section07Portfolio
