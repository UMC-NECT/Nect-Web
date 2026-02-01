import { useState } from 'react'
import CTAModal from '../CTAModal'
import EmptyProfileAnalysis from './EmptyProfileAnalysis'
import { useCollaboStore, useGrowGuideStore, useRoleRecommendStore, useSkillStore } from '@/stores/profileAnalysisStore'
import ProfileRadarChart from '@/components/profile-analysis/ProfileRadarChart'
import ContentSection from '@/components/profile-analysis/ContentSection'
import SkillSection from '@/components/profile-analysis/SkillSection'
import RoleRecommend from '@/components/profile-analysis/RoleRecommend'
import GrowGuideSection from '@/components/profile-analysis/GrowGuideSection'
import Button from '@/components/common/Button'
import { MyPageHeader } from '../MyPageHeader'
import { useCTAModal } from '@/stores/useCTAModal'

const ProfileAnalysis = () => {
	const [hasReport, setHasReport] = useState<boolean>(false)

	// 프로필 분석 있는 경우
	const { type, role, tags, radarData } = useCollaboStore()
	const { skills } = useSkillStore()
	const { roleRecommend } = useRoleRecommendStore()
	const { growGuide } = useGrowGuideStore()

	const { modalType, open, close } = useCTAModal()

	// (모달 핸들러) 삭제 확인
	const handleDelete = () => {
		alert('삭제되었습니다')
		close()
	}

	return (
		<div className='ml-7 w-full'>
			{!hasReport ? (
				// 리포트 없는 경우
				<EmptyProfileAnalysis setHasReport={() => setHasReport(true)} />
			) : (
				// 리포트 있는 경우
				<>
					<div className='flex flex-col items-center'>
						{/* 브레드크럼 + 타이틀 */}
						<MyPageHeader
							action={
								<Button
									color='socialLogin'
									size='sm'
									className='text-neutral-400 px-3.25 py-2.5 w-38.5 h-11 hover:bg-neutral-100'
									onClick={() => alert('프로필 분석 페이지로 이동시킴')}
								>
									+ AI 프로필 분석
								</Button>
							}
						/>

						{/* 콘텐츠 섹션 */}
						<div className='bg-semantic-gray w-full rounded-12 mt-16 pt-20 pb-14 px-12 shadow-inner-neutral-1 border border-neutral-200'>
							<div className='flex flex-col items-center px-60 mb-28'>
								<div className='flex flex-col items-center gap-4 mb-24'>
									{/* 상단 타이틀 */}
									<p className='title-3 font-semibold text-primary-600-normal'>NECT Analysis Report</p>

									{/* 메인 타이틀 */}
									<h2 className='heading-2 font-bold text-neutral-900 text-center'>
										이방토님은 [{type}] 타입이시네요!
									</h2>

									{/* 태그 섹션 */}
									<div className='flex items-center gap-4 mt-2'>
										{/* 직무 태그 */}
										<span className='title-2 px-4 py-1.5 bg-tag-purple text-neutral-700 font-bold rounded-md'>
											{role}
										</span>

										{/* 해시태그들 */}
										<div className='flex items-center gap-3 body-2'>
											{tags.map(tag => (
												<span className='title-2 font-medium text-neutral-900' key={tag}>
													# {tag}
												</span>
											))}
										</div>
									</div>
								</div>

								{/* 협업 스타일 레이더 차트 */}
								<ContentSection title='협업 스타일' className='mb-20'>
									<ProfileRadarChart data={radarData} className='w-112.5 h-93.75 mx-auto' />
								</ContentSection>

								{/* 보유 스킬 섹션 */}
								<ContentSection title='보유 스킬' className='mb-27.5'>
									<div className='flex flex-col gap-6 px-2 mt-6'>
										{skills.map(skill => (
											<SkillSection
												key={skill.skillName}
												skillName={skill.skillName}
												skillList={skill.skillList}
											/>
										))}
									</div>
								</ContentSection>

								{/* 역할별 맞춤 추천 섹션 */}
								<ContentSection title='역할별 맞춤 추천' className='mb-27.5'>
									<div className='flex flex-col gap-6 px-2 mt-6'>
										{roleRecommend.map((roleRecommend, index) => (
											<RoleRecommend
												key={index}
												role={roleRecommend.role}
												title={roleRecommend.title}
												description={roleRecommend.description}
											/>
										))}
									</div>
								</ContentSection>

								{/* 성장 가이드 */}
								<ContentSection title='성장 가이드'>
									<div className='flex flex-col gap-6 px-2 mt-6'>
										{growGuide.map((growGuide, index) => (
											<GrowGuideSection
												key={index}
												tipText={growGuide.tipText}
												title={growGuide.title}
												description={growGuide.description}
											/>
										))}
									</div>
								</ContentSection>
							</div>

							{/* 버튼 2개 */}
							<div className='flex gap-5 min-w-165 justify-center mx-auto mt-28'>
								<Button color='secondary' size='xl' fullWidth className='w-80' onClick={() => alert('다시하기')}>
									다시하기
								</Button>
							</div>
						</div>

						{/* 삭제하기 버튼 */}
						<Button color='text' className='underline mt-1' onClick={() => open('delete')}>
							삭제하기
						</Button>
					</div>
				</>
			)}

			{/* 삭제 모달 */}
			{modalType === 'delete' && (
				<CTAModal
					message='{삭제} 하시겠습니까?'
					isMessageHighlight={false}
					leftButtonMsg='돌아가기'
					rightButtonMsg='삭제'
					onLeftClick={close}
					onRightClick={handleDelete}
				/>
			)}
		</div>
	)
}

export default ProfileAnalysis
