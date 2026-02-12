import { useRef, useState } from 'react'
import RecruitmentStatusChip from '@/components/common/RecruitmentStatusChip'
import RecruitmentStatusModal from './RecruitmentStatusModal'
import CloudIcon from '@/assets/icons/mypage/cloud.svg?react'
import { usePostMypageProjectImageMutation } from '@/hooks/mypage/useMypageApi'
import type { RecruitType } from '@/types/mypage/ongoindProject'

interface ProjectData {
	name: string
	intro: string
	startDate: string
	endDate: string
	recruitmentStatus: '모집 전' | '모집 중' | '모집 완료'
	thumbnailUrl?: string
}

interface IProjectBasicInfo {
	projectData: ProjectData
	projectId: string
	recruitStatus: RecruitType
	onStatusChange?: (status: '모집 전' | '모집 중' | '모집 완료') => void
}

const ProjectBasicInfo = ({ projectData, projectId, recruitStatus, onStatusChange }: IProjectBasicInfo) => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>(projectData.thumbnailUrl)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const { mutate: postMypageProjectImageMutation } = usePostMypageProjectImageMutation()

	const displayThumbnailUrl = thumbnailUrl ?? projectData.thumbnailUrl

	const handleThumbnail = () => {
		fileInputRef.current?.click()
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file || !projectId) return
		if (!file.type.startsWith('image/')) return

		postMypageProjectImageMutation({
			projectId,
			image: file,
		})
		setThumbnailUrl(URL.createObjectURL(file))
	}

	return (
		<>
			<input
				ref={fileInputRef}
				type='file'
				accept='image/*'
				className='hidden'
				onChange={handleFileChange}
			/>
			<div className='flex items-start gap-7'>
				{/* 썸네일 */}
				<div className='relative group cursor-pointer' onClick={handleThumbnail}>
					<div className='w-80 h-44.5 rounded-12 bg-neutral-400 overflow-hidden'>
						{displayThumbnailUrl ? (
							<img
								src={displayThumbnailUrl}
								alt='프로젝트 썸네일'
								className='w-full h-full object-cover'
							/>
						) : null}
					</div>
					<div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300 rounded-12'>
						<span className='body-1 text-white flex justify-center items-center gap-1.75'>
							<CloudIcon className='w-5.5 h-4' /> 클릭 후 사진 업로드
						</span>
					</div>
				</div>

				<div className='flex-1 flex flex-col gap-3.5 pt-2.5'>
					{/* 프로젝트명 */}
					<div className='flex items-start gap-5'>
						<span className='w-25 body-1 text-neutral-600'>프로젝트 이름</span>
						<span className='flex-1 body-1 font-semibold text-primary-600-normal'>{projectData.name}</span>
					</div>

					{/* 소개 */}
					<div className='flex items-start gap-5'>
						<span className='w-25 body-1 text-neutral-600'>프로젝트 소개</span>
						<span className='flex-1 body-1 text-neutral-900'>{projectData.intro}</span>
					</div>

					{/* 예상 기간 */}
					<div className='flex items-center gap-5'>
						<span className='w-25 body-1 text-neutral-600'>예상 기간</span>
						<div className='flex items-center gap-1'>
							<span className='body-1 text-neutral-900'>{projectData.startDate}</span>
							<span className='body-1 text-neutral-500'>~</span>
							<span className='body-1 text-neutral-900'>{projectData.endDate}</span>
						</div>
					</div>

					{/* 모집 여부 */}
					<div className='flex items-center gap-5'>
						<span className='w-25 body-1 text-neutral-600'>모집 여부</span>
						<div className='relative'>
							<RecruitmentStatusChip
								status={recruitStatus}
								isSelected={true}
								onClick={() => setIsModalOpen(true)}
							/>

							{/* 상태 변경 모달 */}
							{isModalOpen && (
								<RecruitmentStatusModal
									currentStatus={recruitStatus}
									onStatusChange={status => {
										onStatusChange?.(status)
									}}
									onClose={() => setIsModalOpen(false)}
								/>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default ProjectBasicInfo
