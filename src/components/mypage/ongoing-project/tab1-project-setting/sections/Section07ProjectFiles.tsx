import { useState, useEffect, useRef } from 'react'
import { useFieldArray, type Control, type UseFormSetValue, type UseFormWatch } from 'react-hook-form'
import Button from '@/components/common/Button'
import ClipIcon from '@/assets/icons/mypage/clip.svg?react'
import type { ProjectSettingsType } from '@/utils/schemas/projectSchema'
import {
	useProjectPlanFileQuery,
	usePostProjectPlanFileMutation,
	usePatchProjectPlanFileMutation,
	useDeleteProjectPlanFileMutation,
} from '@/hooks/mypage/useMypageApi'
import type { PlanFileTypeEnum } from '@/types/api/mypage'

interface ISection07ProjectFiles {
	control: Control<ProjectSettingsType>
	setValue: UseFormSetValue<ProjectSettingsType>
	watch: UseFormWatch<ProjectSettingsType>
	projectId: string
}

const Section07ProjectFiles = ({ control, setValue, watch, projectId }: ISection07ProjectFiles) => {
	const {
		fields: portfolios,
		append: appendPortfolio,
		remove: removePortfolio,
		replace,
	} = useFieldArray({
		control,
		name: 'portfolioFiles',
		keyName: 'fieldId',
	})
	const [dragOver, setDragOver] = useState<number | null>(null)
	const tempIdCounter = useRef(-1)

	// API 훅
	const { data: planFilesData, isLoading } = useProjectPlanFileQuery(projectId)
	const { mutateAsync: createPlanFile } = usePostProjectPlanFileMutation()
	const { mutateAsync: updatePlanFile } = usePatchProjectPlanFileMutation()
	const { mutateAsync: deletePlanFile } = useDeleteProjectPlanFileMutation()

	// API 데이터 동기화
	useEffect(() => {
		if (!projectId || !planFilesData?.body) return

		queueMicrotask(() => {
			const files = planFilesData.body?.files?.flat() || []
			if (files.length === 0) {
				replace([])
				return
			}

			const mapped = files.map(file => ({
				id: file.plan_file_id,
				title: file.name || '',
				link: file.plan_file_type === 'LINK' ? file.link || '' : file.file_url || '',
				file: undefined,
				planFileType: file.plan_file_type,
				fileName: file.file_name || undefined,
				isCompleted: true,
			}))

			replace(mapped)
			setValue('portfolioFiles', mapped, { shouldDirty: false })
		})
	}, [planFilesData, projectId, replace, setValue])

	const addPortfolio = () => {
		const newEntry = {
			id: tempIdCounter.current--,
			title: '',
			link: '',
			file: undefined,
			planFileType: 'LINK' as PlanFileTypeEnum,
			isCompleted: false,
		}
		appendPortfolio(newEntry)
	}

	const removePortfolioByIndex = async (index: number) => {
		const planFileId = watch(`portfolioFiles.${index}.id`)
		if (planFileId && planFileId > 0 && projectId) {
			try {
				await deletePlanFile({ projectId, planFileId: String(planFileId) })
			} catch (error) {
				console.error('Failed to delete plan file:', error)
			}
		}
		removePortfolio(index)
	}

	const handleFileUpload = async (file: File, index: number) => {
		if (!projectId) return

		const planFileId = watch(`portfolioFiles.${index}.id`)
		const currentTitle = watch(`portfolioFiles.${index}.title`)
		const safeTitle = currentTitle?.trim() || file.name.replace(/\.[^/.]+$/, '')
		const payload = { name: safeTitle, planFileType: 'FILE' as const, file }

		// UI 업데이트
		const blobUrl = URL.createObjectURL(file)
		setValue(`portfolioFiles.${index}.title`, safeTitle, { shouldDirty: true })
		setValue(`portfolioFiles.${index}.link`, blobUrl, { shouldDirty: true })
		setValue(`portfolioFiles.${index}.file`, file, { shouldDirty: true })
		setValue(`portfolioFiles.${index}.planFileType`, 'FILE', { shouldDirty: true })
		setValue(`portfolioFiles.${index}.isCompleted`, true, { shouldDirty: true })

		// API 호출
		try {
			if (planFileId && planFileId > 0) {
				await updatePlanFile({ projectId, planFileId: String(planFileId), payload })
			} else {
				await createPlanFile({ projectId, payload })
			}
		} catch (error) {
			console.error('Failed to upload file:', error)
		}
	}

	// 엔터용 핸들러
	const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			const currentTitle = watch(`portfolioFiles.${index}.title`)
			const currentLink = watch(`portfolioFiles.${index}.link`)

			if (currentTitle && currentLink && projectId) {
				// UI 업데이트
				setValue(`portfolioFiles.${index}.isCompleted`, true, { shouldDirty: true })

				// API 호출
				const planFileId = watch(`portfolioFiles.${index}.id`)
				const payload = {
					name: currentTitle.trim(),
					planFileType: 'LINK' as const,
					link: currentLink.trim(),
				}

				try {
					if (planFileId && planFileId > 0) {
						await updatePlanFile({ projectId, planFileId: String(planFileId), payload })
					} else {
						await createPlanFile({ projectId, payload })
					}
				} catch (error) {
					console.error('Failed to save link:', error)
				}
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
			handleFileUpload(file, index).catch(console.error)
		}
	}

	// 파일 추가
	const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
		const file = e.target.files?.[0]
		if (file) {
			handleFileUpload(file, index).catch(console.error)
		}
	}

	return (
		<section className=''>
			<div className='ml-5 flex items-center justify-between mb-1.5'>
				<h2 className='title-2 font-bold text-neutral-900'>프로젝트 세부 기획 파일</h2>

				<Button color='text' size='sm' onClick={addPortfolio} className='group flex gap-1' disabled={!projectId}>
					<span className='group-hover:text-neutral-500'>+</span>파일 추가
				</Button>
			</div>

			{isLoading && portfolios.length === 0 && (
				<p className='body-2 text-neutral-400 px-5 py-4'>세부 기획 파일을 불러오는 중...</p>
			)}

			{portfolios.map((portfolio, index) =>
				(() => {
					const currentIsCompleted = watch(`portfolioFiles.${index}.isCompleted`)
					const currentTitle = watch(`portfolioFiles.${index}.title`)
					const currentLink = watch(`portfolioFiles.${index}.link`)
					const hasContent = !!(currentTitle || currentLink)

					return (
						<div key={portfolio.fieldId ?? portfolio.id} className='mb-4'>
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
								<ClipIcon className={`w-5 h-5 mt-1 shrink-0 ${hasContent ? 'text-neutral-700' : 'text-neutral-400'}`} />
								<div className='flex-1 flex gap-2 items-start'>
									<div className='flex-1'>
										<input
											type='text'
											className={`w-full body-1 bg-transparent focus:outline-none placeholder:text-neutral-300 mb-0 font-semibold ${
												currentIsCompleted ? 'text-primary-500-normal ' : 'text-neutral-800'
											}`}
											placeholder='제목'
											value={currentTitle || ''}
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
													? 'text-neutral-400 underline cursor-pointer'
													: 'text-neutral-900'
											}`}
											placeholder='링크 붙여넣기 및 파일 드래그'
											value={currentLink || ''}
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
									id={`file-input-${portfolio.fieldId ?? portfolio.id}`}
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
