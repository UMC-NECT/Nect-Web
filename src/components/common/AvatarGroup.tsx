import DefaultAvatar from '@/assets/Default_Profile.svg'

interface AvatarGroupProps {
	avatars?: string[] // 사용자 아바타 이미지 URL 배열
	maxCount?: number // 최대 표시 개수 (기본값 3)
	size?: number // 아바타 크기 (px 단위, 기본값 22.533)
}

const AvatarGroup = ({ avatars = [], maxCount = 3, size = 22.533 }: AvatarGroupProps) => {
	// 아바타가 없으면 아무것도 표시하지 않음
	if (avatars.length === 0) {
		return null
	}

	const displayAvatars = avatars.slice(0, maxCount)

	return (
		<div className="flex items-center justify-end -space-x-[8px]">
			{displayAvatars.map((avatar, index) => (
				<div
					key={index}
					className="rounded-full border-2 border-white bg-neutral-200 shrink-0 overflow-hidden"
					style={{ width: `${size}px`, height: `${size}px` }}
				>
					<img src={avatar ? avatar : DefaultAvatar} alt={`Participant ${index + 1}`} className="w-full h-full object-cover" />
				</div>
			))}
		</div>
	)
}

export default AvatarGroup

