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
	const remainingCount = avatars.length - maxCount

	return (
		<div className="flex items-center justify-end -space-x-[3.467px]">
			{displayAvatars.map((avatar, index) => (
				<div
					key={index}
					className="rounded-full border-2 border-white bg-neutral-200 shrink-0 overflow-hidden"
					style={{ width: `${size}px`, height: `${size}px` }}
				>
					<img src={avatar} alt={`Participant ${index + 1}`} className="w-full h-full object-cover" />
				</div>
			))}
			{/* 남은 개수 표시 (maxCount 초과 시) */}
			{remainingCount > 0 && (
				<div
					className="rounded-full border-2 border-white bg-primary-400-normal shrink-0 flex items-center justify-center"
					style={{ width: `${size}px`, height: `${size}px` }}
				>
					<span className="caption-3 text-white font-medium">+{remainingCount}</span>
				</div>
			)}
		</div>
	)
}

export default AvatarGroup

