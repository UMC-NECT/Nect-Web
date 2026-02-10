import EmptyProfileAnalysis from './EmptyProfileAnalysis'
import SkillSection from '@/components/profile-analysis/SkillSection'
import RoleRecommend from '@/components/profile-analysis/RoleRecommend'
import GrowGuideSection from '@/components/profile-analysis/GrowGuideSection'
import { MyPageHeader } from '../MyPageHeader'
import { useProfileAnalysis, useMypageProfileQuery } from '@/hooks/mypage/useMypageApi'
import { formatRoleName } from '@/utils/roleColor'
import { translateSkillCategory } from '@/utils/skillCategory'
import type { RadarDataItem } from '@/stores/profileAnalysisStore'
import MypageContentSection from './MypageContentSection'
import MypageProfileRadarChart from './MypageProfileRadarChart'

const ProfileAnalysis = () => {
	// API - AI 프로필 분석
	const { data: profileAnalysisData, isLoading, isError } = useProfileAnalysis()
	const { data: profileData } = useMypageProfileQuery()

	const analysisResult = profileAnalysisData?.body
	const profile = profileData?.body

	// API 데이터를 컴포넌트 형식에 맞게 변환
	const radarData: RadarDataItem[] = analysisResult?.collaborationStyle
		? [
				{ subject: '계획형', value: analysisResult.collaborationStyle.planning },
				{ subject: '논리형', value: analysisResult.collaborationStyle.logic },
				{ subject: '리더형', value: analysisResult.collaborationStyle.leadership },
				{ subject: '공감형', value: analysisResult.collaborationStyle.empathy },
				{ subject: '실행형', value: analysisResult.collaborationStyle.execution },
			]
		: []

	const skills =
		analysisResult?.skills?.map(skill => ({
			skillName: translateSkillCategory(skill.category),
			skillList: skill.skill_names,
		})) || []

	const roleRecommend = analysisResult?.roleRecommendation
		? [
				{
					role: '리더',
					title: '다음과 같은 성격의 팀원과 함께하세요!',
					description: analysisResult.roleRecommendation.leader,
				},
				{
					role: '팀원',
					title: '현재 모집중인 프로젝트를 추천할게요!',
					description: analysisResult.roleRecommendation.team_member,
				},
			]
		: []

	const hasReport = !!analysisResult

	if (isLoading) {
		return (
			<div className='ml-7 w-full flex items-center justify-center min-h-screen'>
				<p className='body-1 text-neutral-500'>
					<span className='text-primary-500-normal font-semibold'>{profile?.name}</span>님의 프로필 분석내역을
					불러오는중...
				</p>
			</div>
		)
	}

	if (isError) {
		return (
			<div className='ml-7 w-full flex items-center justify-center min-h-screen'>
				<p className='body-1 text-error-500'>데이터를 불러오는데 실패했습니다.</p>
			</div>
		)
	}

	return (
		<div className='ml-7 w-full'>
			{!hasReport ? (
				// 리포트 없는 경우
				<EmptyProfileAnalysis />
			) : (
				// 리포트 있는 경우
				<>
					<div className='flex flex-col items-center'>
						{/* 브레드크럼 + 타이틀 */}
						<MyPageHeader />

						{/* 콘텐츠 섹션 */}
						<div className='bg-bg-gray w-full rounded-12 px-11.5 py-14 shadow-inner-neutral-1 border border-neutral-200'>
							<div className='flex flex-col items-center '>
								<div className='flex flex-col items-center gap-4 mb-18'>
									{/* 상단 타이틀 */}
									<p className='title-3 font-semibold text-primary-600-normal mb-0.5'>NECT Analysis Report</p>

									{/* 메인 타이틀 */}
									<h2 className='heading-2 font-bold text-neutral-900 text-center'>
										{profile?.nickname}님은 [{analysisResult.profileType}] 타입이시네요!
									</h2>

									{/* 태그 섹션 */}
									<div className='flex items-center gap-3'>
										{/* 직무 태그 */}
										<span className='title-3 px-2.5 py-1 bg-roletag-purple text-neutral-700 font-semibold rounded-md'>
											{formatRoleName(profile?.role)}
										</span>

										{/* 해시태그들 */}
										<div className='flex items-center gap-2.5 body-2'>
											{analysisResult.tags.map(tag => (
												<span className='title-3 font-medium text-neutral-900' key={tag}>
													{tag}
												</span>
											))}
										</div>
									</div>
								</div>

								{/* 협업 스타일 레이더 차트 */}
								<MypageContentSection title='협업 스타일' className='mb-22 gap-4'>
									<MypageProfileRadarChart
										data={radarData}
										className='w-112.5 h-93.75 mx-auto bg-neutral-000 rounded-15'
									/>
								</MypageContentSection>

								{/* 보유 스킬 섹션 */}
								<MypageContentSection title='보유 스킬' className='mb-27.5'>
									<div className='flex flex-col gap-6 px-2'>
										{skills.map(skill => (
											<SkillSection
												key={skill.skillName}
												skillName={skill.skillName}
												skillList={skill.skillList}
											/>
										))}
									</div>
								</MypageContentSection>

								{/* 역할별 맞춤 추천 섹션 */}
								<MypageContentSection title='역할별 맞춤 추천' className='mb-27.5'>
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
								</MypageContentSection>

								{/* 성장 가이드 */}
								<MypageContentSection title='성장 가이드'>
									<div className='flex flex-col gap-6'>
										{analysisResult.growthGuide
											.sort((a, b) => a.order - b.order)
											.map(guide => {
												// order에 따라 tipText 고정
												const tipText =
													guide.order === 1
														? '앞으로 이런 활동을 하면 좋아요 !'
														: '확장 가능한 스킬 추천'

												// tip 필드 파싱
												const title = '포트폴리오 제작을 위한 ‘실무 프로세스 경험'
												const description = guide.tip

												return (
													<GrowGuideSection
														key={guide.order}
														tipText={tipText}
														title={title}
														description={description}
													/>
												)
											})}
									</div>
								</MypageContentSection>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	)
}

export default ProfileAnalysis
