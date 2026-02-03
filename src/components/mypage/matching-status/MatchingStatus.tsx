import { useState } from 'react'
import { MyPageHeader } from '../MyPageHeader'
import { cn } from '@/utils/cn'
import ProjectCard from './ProjectCard'
import ProfileCard from './ProfileCard'
import MatchingTimerCard from './MatchingTimerCard'
import MatchingNotice from './MatchingNotice'
import RoleTagChip from '@/components/mission-modal/RoleTagChip'
import { RECEIVED_REQUEST_NOTICES, SENT_REQUEST_NOTICES } from '@/constants/matchingNotice'

type TabType = 'received' | 'sent'

interface MatchingStatusProps {
	receivedCount?: number
	sentCount?: number
}

export const MatchingStatus = ({ receivedCount = 6, sentCount = 5 }: MatchingStatusProps) => {
	const [activeTab, setActiveTab] = useState<TabType>('received')

	// 받은 요청 데이터 (임시)
	const receivedProjects = [
		{
			id: 1,
			projectName: 'MoneyLog',
			category: '금융 · 핀테크',
			description: '하루의 소비를 기록해, 나의 돈 흐름을 이해하는 금융 다이어리',
			currentMembers: 4,
			totalMembers: 10,
			timerText: '09:58:29',
		},
	]

	const receivedTeamMembers = [
		{
			part: 'Design',
			partColor: 'bg-roletag-pink',
			members: [
				{
					id: 1,
					nickname: '김넥트',
					part: 'Design',
					introduction: 'UX.UI 어쩌고 한줄 소개 ~~~~',
					timerText: '01:27:00',
				},
				{
					id: 2,
					nickname: '윤다',
					part: 'Design',
					introduction: '인터렉티브 디자인 전공으로 인터렉션에 강합니다 !',
					timerText: '07:14:00',
				},
			],
		},
		{
			part: 'Backend',
			partColor: 'bg-roletag-blue',
			members: [
				{
					id: 3,
					nickname: '러핑',
					part: 'Backend',
					introduction: '프로필 소개 (첫 문장까지 미리보기됨)',
					timerText: '04:08:00',
				},
				{
					id: 4,
					nickname: '리뮤딘',
					part: 'Backend',
					introduction: '프로필 소개 (첫 문장까지 미리보기됨)',
					timerText: '06:32:00',
				},
				{
					id: 5,
					nickname: '이경',
					part: 'Backend',
					introduction: '프로필 소개 (첫 문장까지 미리보기됨)',
					timerText: '07:54:00',
				},
				{
					id: 6,
					nickname: '루트',
					part: 'Backend',
					introduction: '프로필 소개 (첫 문장까지 미리보기됨)',
					timerText: '00:00:00',
					status: 'accepted' as const,
				},
			],
		},
	]

	// 보낸 요청 데이터 (임시)
	const sentProjects = [
		{
			id: 1,
			projectName: 'NECT 웹사이트',
			category: 'IT · 웹/모바일 서비스',
			description: '크리에이터를 위한 사이드 프로젝트 매칭 & 협업 플랫폼',
			currentMembers: 6,
			totalMembers: 10,
			timerText: '12:34:56',
		},
	]

	const sentTeamMembers = [
		{
			part: 'Frontend',
			partColor: 'bg-roletag-green',
			members: [
				{
					id: 1,
					nickname: '김개발',
					part: 'Frontend',
					introduction: 'React/Next.js 개발 경험이 있습니다!',
					timerText: '05:20:00',
				},
				{
					id: 2,
					nickname: '박프론트',
					part: 'Frontend',
					introduction: '프로필 소개 (첫 문장까지 미리보기됨)',
					timerText: '08:15:30',
				},
			],
		},
		{
			part: 'PM',
			partColor: 'bg-roletag-purple',
			members: [
				{
					id: 3,
					nickname: '최기획',
					part: 'PM',
					introduction: '프로젝트 관리 경험이 풍부합니다',
					timerText: '03:45:00',
				},
			],
		},
	]

	return (
		<div className='ml-7'>
			<MyPageHeader />

			{/* 전체 컨테이너 */}
			<div className='w-[916px] px-11.5 py-11.5 rounded-12 bg-white border border-neutral-200'>
				{/* 탭 영역 */}
				<div className='flex items-center gap-1 mb-[38px]'>
					{/* 받은 요청 탭 */}
					<button
						type='button'
						onClick={() => setActiveTab('received')}
						className='flex flex-col gap-3 w-30 pt-2.5'
					>
						<div
							className={cn(
								'title-3 font-semibold text-center flex items-center justify-center gap-1.5',
								activeTab === 'received' ? 'text-primary-500-normal' : 'text-neutral-400'
							)}
						>
							<span>받은 요청</span>
							<span>{receivedCount}</span>
						</div>
						<div
							className={cn(
								'h-0.75 w-full',
								activeTab === 'received' ? 'bg-primary-400-normal' : 'bg-neutral-300'
							)}
						/>
					</button>

					{/* 보낸 요청 탭 */}
					<button
						type='button'
						onClick={() => setActiveTab('sent')}
						className='flex flex-col gap-3 w-30 pt-2.5'
					>
						<div
							className={cn(
								'title-3 font-semibold text-center flex items-center justify-center gap-1.5',
								activeTab === 'sent' ? 'text-primary-500-normal' : 'text-neutral-400'
							)}
						>
							<span>보낸 요청</span>
							<span>{sentCount}</span>
						</div>
						<div
							className={cn(
								'h-0.75 w-full',
								activeTab === 'sent' ? 'bg-primary-400-normal' : 'bg-neutral-300'
							)}
						/>
					</button>
				</div>

				{/* 탭 컨텐츠 */}
				<div className='flex flex-col gap-16'>
					{activeTab === 'received' && (
						<>
							{/* 프로젝트 섹션 */}
							<div className='flex flex-col gap-3.5 items-start py-2.5 relative shrink-0 w-full'>
								<div className='flex items-center justify-between pl-2.5 pr-5 relative shrink-0 w-full'>
									<div className='flex h-[26px] items-center justify-center px-2.5 relative shrink-0'>
										<p className='title-2 font-bold text-neutral-900 whitespace-nowrap leading-[1.4]'>프로젝트</p>
									</div>
								</div>
								<div className='flex gap-1 items-center px-5 relative shrink-0 w-full'>
									{receivedProjects.map(project => (
										<div key={project.id} className='flex gap-1 items-center'>
											<ProjectCard
												projectName={project.projectName}
												category={project.category}
												description={project.description}
												currentMembers={project.currentMembers}
												totalMembers={project.totalMembers}
											/>
											<MatchingTimerCard
												requestType='received'
												status='default'
												timerText={project.timerText}
												onAccept={() => console.log('수락')}
												onReject={() => console.log('거절')}
											/>
										</div>
									))}
								</div>
							</div>

							{/* 넥트 팀원 섹션 */}
							<div className='flex flex-col gap-6 items-start relative shrink-0 w-full'>
								<div className='flex items-center justify-between pl-2.5 pr-5 relative shrink-0 w-full'>
									<div className='flex h-[26px] items-center justify-center px-2.5 relative shrink-0'>
										<p className='title-2 font-bold text-neutral-900 whitespace-nowrap leading-[1.4]'>넥트 팀원</p>
									</div>
								</div>
								<div className='flex flex-col gap-10 items-start px-5 relative shrink-0 w-full'>
									{receivedTeamMembers.map((partGroup, partIndex) => (
										<div key={partIndex} className='flex flex-col gap-3 items-start relative shrink-0 w-full'>
											<RoleTagChip
												roleName={partGroup.part}
												roleColor={partGroup.partColor}
												state='default'
											/>
											<div className='flex flex-col gap-3 items-start relative shrink-0 w-full'>
												{partGroup.members.map(member => (
													<div key={member.id} className='flex gap-1 items-center relative shrink-0 w-full'>
														<ProfileCard
															nickname={member.nickname}
															part={member.part}
															introduction={member.introduction}
															onMessageClick={() => console.log(`${member.nickname}에게 메시지 보내기`)}
														/>
														<MatchingTimerCard
															requestType='received'
															status={member.status || 'default'}
															timerText={member.timerText}
															onAccept={() => console.log('수락')}
															onReject={() => console.log('거절')}
														/>
													</div>
												))}
											</div>
										</div>
									))}
								</div>
							</div>

							{/* 유의사항 섹션 */}
							<div className='flex flex-col gap-1.5 items-start py-2.5 relative shrink-0 w-full'>
								<div className='flex items-center justify-between pl-2.5 pr-5 relative shrink-0 w-full'>
									<div className='flex h-[26px] items-center justify-center px-2.5 relative shrink-0'>
										<p className='title-2 font-bold text-neutral-900 whitespace-nowrap leading-[1.4]'>유의사항</p>
									</div>
								</div>
								<div className='flex flex-col items-start px-5 py-4 relative shrink-0 w-full'>
									<MatchingNotice items={RECEIVED_REQUEST_NOTICES} />
								</div>
							</div>
						</>
					)}
					{activeTab === 'sent' && (
						<>
							{/* 프로젝트 섹션 */}
							<div className='flex flex-col gap-3.5 items-start py-2.5 relative shrink-0 w-full'>
								<div className='flex items-center justify-between pl-2.5 pr-5 relative shrink-0 w-full'>
									<div className='flex h-[26px] items-center justify-center px-2.5 relative shrink-0'>
										<p className='title-2 font-bold text-neutral-900 whitespace-nowrap leading-[1.4]'>프로젝트</p>
									</div>
								</div>
								<div className='flex gap-1 items-center px-5 relative shrink-0 w-full'>
									{sentProjects.map(project => (
										<div key={project.id} className='flex gap-1 items-center'>
											<ProjectCard
												projectName={project.projectName}
												category={project.category}
												description={project.description}
												currentMembers={project.currentMembers}
												totalMembers={project.totalMembers}
											/>
											<MatchingTimerCard
												requestType='sent'
												status='default'
												timerText={project.timerText}
												onCancel={() => console.log('매칭 취소')}
											/>
										</div>
									))}
								</div>
							</div>

							{/* 넥트 팀원 섹션 */}
							<div className='flex flex-col gap-6 items-start relative shrink-0 w-full'>
								<div className='flex items-center justify-between pl-2.5 pr-5 relative shrink-0 w-full'>
									<div className='flex h-[26px] items-center justify-center px-2.5 relative shrink-0'>
										<p className='title-2 font-bold text-neutral-900 whitespace-nowrap leading-[1.4]'>넥트 팀원</p>
									</div>
								</div>
								<div className='flex flex-col gap-10 items-start px-5 relative shrink-0 w-full'>
									{sentTeamMembers.map((partGroup, partIndex) => (
										<div key={partIndex} className='flex flex-col gap-3 items-start relative shrink-0 w-full'>
											<RoleTagChip
												roleName={partGroup.part}
												roleColor={partGroup.partColor}
												state='default'
											/>
											<div className='flex flex-col gap-3 items-start relative shrink-0 w-full'>
												{partGroup.members.map(member => (
													<div key={member.id} className='flex gap-1 items-center relative shrink-0 w-full'>
														<ProfileCard
															nickname={member.nickname}
															part={member.part}
															introduction={member.introduction}
															onMessageClick={() => console.log(`${member.nickname}에게 메시지 보내기`)}
														/>
														<MatchingTimerCard
															requestType='sent'
															status='default'
															timerText={member.timerText}
															onCancel={() => console.log('매칭 취소')}
														/>
													</div>
												))}
											</div>
										</div>
									))}
								</div>
							</div>

							{/* 유의사항 섹션 */}
							<div className='flex flex-col gap-1.5 items-start py-2.5 relative shrink-0 w-full'>
								<div className='flex items-center justify-between pl-2.5 pr-5 relative shrink-0 w-full'>
									<div className='flex h-[26px] items-center justify-center px-2.5 relative shrink-0'>
										<p className='title-2 font-bold text-neutral-900 whitespace-nowrap leading-[1.4]'>유의사항</p>
									</div>
								</div>
								<div className='flex flex-col items-start px-5 py-4 relative shrink-0 w-full'>
									<MatchingNotice items={SENT_REQUEST_NOTICES} />
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	)
}
