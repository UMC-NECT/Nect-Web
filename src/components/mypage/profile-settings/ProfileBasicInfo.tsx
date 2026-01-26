import { useRef } from 'react'
import Button from '../../common/Button'
import ProfileImageEditIcon from '@/assets/icons/mypage/profile-image-edit.svg?react'

interface ProfileBasicInfoProps {
	profileImage: string | null
	onProfileImageChange: (image: string) => void
	onSave: () => void
}

export const ProfileBasicInfo = ({ profileImage, onProfileImageChange, onSave }: ProfileBasicInfoProps) => {
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleAvatarClick = () => {
		fileInputRef.current?.click()
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			const reader = new FileReader()
			reader.onloadend = () => {
				onProfileImageChange(reader.result as string)
			}
			reader.readAsDataURL(file)
		}
	}

	return (
		<>
			{/* 기본정보 섹션 */}
			<div className='flex items-start justify-between mb-10 ml-2.5'>
				{/* 좌측 - 기본 정보 */}
				<div className='flex items-center gap-4'>
					<input type='file' ref={fileInputRef} onChange={handleFileChange} className='hidden' accept='image/*' />
					<div className='relative cursor-pointer' onClick={handleAvatarClick}>
						{profileImage ? (
							<img src={profileImage} alt='Profile Preview' className='w-20 h-20 rounded-full object-cover' />
						) : (
							<ProfileImageEditIcon />
						)}
					</div>

					{/* 소개글 */}
					<div>
						<div className='flex items-center gap-2.5 mb-1'>
							<span className='title-2 font-bold'>이방토</span>
							<span className='text-neutral-300 font-semibold'>|</span>
							<span className='title-2 text-neutral-400'>Design</span>
						</div>
						<p className='body-2 text-neutral-500 mb-2'>ellaelia2@hanyang.ac.kr</p>
						<span className='text-[14px] text-primary-500-normal leading-[140%] font-semibold bg-primary-100-light border border-primary-200-light px-3 py-1 rounded-100'>
							재학 중
						</span>
					</div>
				</div>

				{/* 우측 - 버튼 2개 */}
				<div className='flex gap-4'>
					<Button color='mypage1' className='w-32.5' onClick={onSave}>
						저장
					</Button>
					<Button color='mypage2' className='w-32.5 px-2.5'>
						공개 매칭 등록
					</Button>
				</div>
			</div>

			{/* 관심 분야 섹션 */}
			<div className='grid grid-cols-[100px_1fr] gap-y-3 body-1 mb-12 ml-5'>
				<span className='text-neutral-600'>관심 직무</span>
				<span className='text-neutral-900'>UX/UI Product Designer / UX researcher</span>
				<span className='text-neutral-600'>관심 직종</span>
				<span className='text-neutral-900'>UX/UI 브랜딩/채용</span>
				<span className='text-neutral-600'>경력</span>
				<span className='text-neutral-900'>6개월</span>
			</div>
		</>
	)
}
