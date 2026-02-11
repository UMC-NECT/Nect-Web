import BarIcon from '@/assets/icons/common/Bar.svg?react';
import { getTagStyle } from '@/utils/tagStyles';
import type { MemberCard } from '@/types/api/home';
import type { FC } from 'react'
import DefaultProfile from '@/assets/Default_Profile.svg'

export interface RecommendationMemberCardProps {
	member: MemberCard
	variant?: 'default' | 'list'
	showRoles?: boolean // 역할 태그 표시 여부
}

const RecommendationMemberCard: FC<RecommendationMemberCardProps> = ({ member, variant = 'default', showRoles = true }) => {
	// status 변환: "JOB_SEEKING" → "매칭 가능", "EMPLOYED" → "재직 중"
	const statusMap: Record<string, string> = {
		JOB_SEEKING: '매칭 가능',
		EMPLOYED: '재직 중',
	}

	// part 변환: "DESIGNER" → "디자인", "DEVELOPER" → "개발" 등
	const partMap: Record<string, string> = {
		DESIGNER: 'Design',
		DEVELOPER: 'Develop',
		PLANNER: 'PM',
		OTHER: '기타',
	}

	const displayStatus = member.status ? statusMap[member.status] || member.status : '매칭 가능'
	const displayPart = member.part ? partMap[member.part] || member.part : '기타'
	const displayIntroduction = member.introduction || '자기소개가 없습니다.'

	// variant에 따른 스타일 설정
	const sizeStyles = {
		default: {
			card: 'w-90',
			height: 'h-[340px]',
			background: 'h-50',
			character: 'w-16 h-16',
		},
		list: {
			card: 'w-[272px]',
			height: 'h-[285px]',
			background: 'h-[151px]',
			character: 'w-16 h-16',
		},
	}

	const styles = sizeStyles[variant]

	return (
		<div
			className={`${styles.card} ${styles.height} pb-4 flex flex-col bg-white rounded-xl cursor-pointer border border-neutral-100 hover:border-primary-400-normal hover:shadow-lg hover:-translate-y-2 transition-all duration-300`}
		>
			{/* 상단: 배경 + 캐릭터 영역 */}
			<div className={`relative ${styles.background}`}>
				{member.imageUrl ? (
					<img src={member.imageUrl} alt={''} className='w-full h-full object-cover bg-neutral-300' />
				) : (
					<div className='w-full h-full bg-neutral-300 rounded-12' />
				)}
				<img
					src={member.imageUrl || DefaultProfile}
					alt='character'
					className={`absolute bottom-0 left-4 ${styles.character} translate-y-1/2 border border-neutral-100 rounded-full bg-white object-cover`}
				/>
			</div>

			{/* 매칭 가능 태그 */}
			<div className='flex justify-end px-4 pt-2'>
				<div className='flex items-center justify-center gap-1 border border-primary-200-light rounded-2xl w-21.5 h-6.5'>
					<span className='w-2.5 h-2.5 bg-primary-500-normal rounded-full'></span>
					<span className='text-[14px] text-neutral-700 font-semibold'>{displayStatus}</span>
				</div>
			</div>

			{/* 하단: 텍스트 정보 영역 */}
			<div className='flex flex-col px-5'>
				<div className='flex items-center gap-1.5 mb-1.5'>
					<span className='title-3 font-semibold text-neutral-900'>{member.name}</span>
					<BarIcon className='w-0.5 h-3' />
					<span className='title-3 font-medium text-neutral-500'>{displayPart}</span>
				</div>

				<p className='body-2 text-neutral-600 font-medium line-clamp-2 mb-3'>{displayIntroduction}</p>

				{/* 역할 태그 - showRoles가 true이고 roles가 있을 때만 렌더링 */}
				{showRoles && member.roles && member.roles.length > 0 && (
					<div className='flex gap-2 flex-wrap h-6'>
						{member.roles.map((role, index) => (
							<span key={index} className={`px-2 py-0.5 text-sm text-neutral-700 rounded-md ${getTagStyle(role)}`}>
								{role}
							</span>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export default RecommendationMemberCard;