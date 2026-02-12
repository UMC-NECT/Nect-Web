import { useMemo, useRef, useState } from 'react'
import ProfileImageEditIcon from '@/assets/icons/mypage/profile-image-edit.svg?react'
import ProfilePencilIcon from '@/assets/icons/mypage/profile-pencil.svg?react'
import Button from '../../common/Button'
import UserStatusModal from '@/components/common/UserStatusModal'
import { useUserStatusStore } from '@/stores/useUserStatusStore'
import { getUserStatusLabel } from '@/constants/userStatus'
import { useOnboardingEnums } from '@/hooks/auth/useOnboardingEnums'
import { getRoleLabel } from '@/utils/enumUtils'
import type { ProfileFormDataType } from '@/utils/schemas/profileSchema'
import { Controller, type Control } from 'react-hook-form'
import { postProfileImageUpload } from '@/api/users'

interface ProfileBasicInfoProps {
	control: Control<ProfileFormDataType>
	isOpenRecruit: boolean // 공개 매칭 여부 (디폴트: 비공개)
	isSaving?: boolean // 저장 중 여부
	onSave: () => void
	onRecruit: () => void
	// API 데이터
	profileImageFileName?: string
	userName?: string
	userRole?: string
	userStatus?: string
	userEmail?: string
	onProfileImageChange?: (imageUrl: string) => void
	onProfileImageFileNameChange?: (fileName: string) => void
	onStatusChange?: (status: string) => void
}

const ProfileBasicInfo = ({
	control,
	isOpenRecruit,
	isSaving,
	onSave,
	onRecruit,
	profileImageFileName,
	userName,
	userRole,
	userStatus,
	userEmail,
	onProfileImageChange,
	onProfileImageFileNameChange,
	onStatusChange,
}: ProfileBasicInfoProps) => {
	const [isRecruitButtonHovered, setIsRecruitButtonHovered] = useState(false) // 버튼 호버하면 텍스트 변경되게 하려고
	const [localProfileImage, setLocalProfileImage] = useState<string | null>(null)
	const [isUploadingImage, setIsUploadingImage] = useState(false)
	const profileImage = localProfileImage ?? profileImageFileName

	// 유저 상태변경 모달 (재학/구직/재직)
	const { isOpen, open } = useUserStatusStore()
	const { roles, roleFields } = useOnboardingEnums()
	const roleLabel = useMemo(
		() => getRoleLabel(userRole ?? '', roles, roleFields),
		[userRole, roles, roleFields]
	)

	// 프사 변경 관련
	const fileInputRef = useRef<HTMLInputElement>(null)
	const handleAvatarClick = () => {
		fileInputRef.current?.click()
	}
	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			// 로컬 미리보기 표시
			const reader = new FileReader()
			reader.onloadend = () => {
				const imageUrl = reader.result as string
				setLocalProfileImage(imageUrl)
			}
			reader.readAsDataURL(file)

			// API로 업로드
			try {
				setIsUploadingImage(true)
				const response = await postProfileImageUpload(file)

				if (response.body) {
					// 업로드 성공 시 서버의 URL로 교체
					setLocalProfileImage(response.body.fileUrl)
					onProfileImageChange?.(response.body.fileUrl)

					// fileName을 부모 컴포넌트로 전달
					onProfileImageFileNameChange?.(response.body.fileName)
				}
			} catch (error) {
				console.error('프로필 이미지 업로드 실패:', error)
				alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.')
				// 실패 시 로컬 이미지도 제거
				setLocalProfileImage(null)
			} finally {
				setIsUploadingImage(false)
			}
		}
	}

	return (
		<>
			{/* 기본정보 섹션 */}
			<div className='flex items-start justify-between mb-10 ml-2.5'>
				{/* 좌측 - 기본 정보 */}
				<div className='flex items-center gap-4'>
					<input type='file' ref={fileInputRef} onChange={handleFileChange} className='hidden' accept='image/*' />
					<div className='relative cursor-pointer shrink-0' onClick={handleAvatarClick}>
						{profileImage ? (
							<>
								<img
									src={profileImage}
									alt='Profile Preview'
									className={`w-25 h-25 rounded-full object-cover border border-neutral-100 ${isUploadingImage ? 'opacity-50' : ''}`}
								/>
								{isUploadingImage && (
									<div className='absolute inset-0 flex items-center justify-center'>
										<div className='w-6 h-6 border-2 border-primary-500-normal border-t-transparent rounded-full animate-spin'></div>
									</div>
								)}
								<div className='absolute bottom-1.75 right-0 rounded-full bg-primary-500-normal flex items-center justify-center'>
									<ProfilePencilIcon />
								</div>
							</>
						) : (
							<ProfileImageEditIcon />
						)}
					</div>

					{/* 소개글 */}
					<div>
						<div className='flex items-center gap-2.5 mb-1'>
							<span className='title-2 font-bold'>{userName}</span>
							<span className='text-neutral-300 font-semibold'>|</span>
							<span className='title-2 text-neutral-400'>{roleLabel}</span>
						</div>
						<p className='body-2 text-neutral-500 mb-2'>{userEmail}</p>

						<div className='relative inline-block'>
							<span
								className='text-[14px] text-primary-500-normal leading-[140%] font-semibold bg-primary-100-light border border-primary-200-light px-3 py-1 rounded-100 cursor-pointer'
								onClick={open}
							>
								{getUserStatusLabel(userStatus ?? '')}
							</span>

							{isOpen && <UserStatusModal isOpen={isOpen} onStatusChange={onStatusChange} />}
						</div>
					</div>
				</div>

				{/* 우측 - 버튼 2개 */}
				<div className='flex gap-4'>
					<Button color='mypage1' className='w-32.5' onClick={onSave} disabled={isSaving}>
						 저장
					</Button>

					<Button
						color='mypage2'
						className={`w-32.5 px-2.5 hover:bg-primary-500
							${!isOpenRecruit ? 'hover:bg-primary-600-normal' : ''}
							${isOpenRecruit && (isRecruitButtonHovered ? 'text-primary-500-normal bg-primary-300-light' : 'bg-primary-100-light text-primary-500-normal')}
							`}
						onClick={onRecruit}
						onMouseEnter={() => setIsRecruitButtonHovered(true)}
						onMouseLeave={() => setIsRecruitButtonHovered(false)}
					>
						{isOpenRecruit ? (isRecruitButtonHovered ? '비공개 전환' : '공개 매칭 중') : '공개 매칭 등록'}
					</Button>
				</div>
			</div>

			{/* 관심 분야 */}
			<div className='grid grid-cols-[100px_1fr] gap-y-3 body-1 mb-12 ml-5'>
				<span className='text-neutral-600'>관심 직무</span>
				<Controller
					name='interestJob'
					control={control}
					render={({ field }) => (
						<input
							{...field}
							placeholder='관심 직무를 입력해주세요.'
							className='body-1 text-neutral-900 focus:outline-none placeholder:text-neutral-300'
						/>
					)}
				/>

				{/* 관심 직종 */}
				<span className='text-neutral-600'>관심 직종</span>
				<Controller
					name='interestOccupation'
					control={control}
					render={({ field }) => (
						<input
							{...field}
							placeholder='관심 직종을 작성해세요.'
							className='body-1 text-neutral-900 focus:outline-none placeholder:text-neutral-300'
						/>
					)}
				/>

				{/* 경력 */}
				<span className='text-neutral-600'>경력</span>
				<Controller
					name='userCareer'
					control={control}
					render={({ field }) => (
						<input
							{...field}
							placeholder='경력 기간을 작성해세요.'
							className='body-1 text-neutral-900 focus:outline-none placeholder:text-neutral-300'
						/>
					)}
				/>
			</div>
		</>
	)
}

export default ProfileBasicInfo
