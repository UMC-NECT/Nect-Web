import EmptyProfileAnalysis from './EmptyProfileAnalysis'
import SkillSection from '@/components/profile-analysis/SkillSection'
import RoleRecommend from '@/components/profile-analysis/RoleRecommend'
import GrowGuideSection from '@/components/profile-analysis/GrowGuideSection'
import { MyPageHeader } from '../MyPageHeader'
import { useGetProfileAnalysisQuery, useGetProfileQuery } from '@/hooks/auth/useUsersApi'
import { useOnboardingEnums } from '@/hooks/auth/useOnboardingEnums'
import type { RadarDataItem } from '@/stores/profileAnalysisStore'
import MypageContentSection from './MypageContentSection'
import MypageProfileRadarChart from './MypageProfileRadarChart'
import NecttyIcon from '@/assets/icons/mypage/nectty.png'
import { useErrorModal } from '@/stores/useErrorModal'

const COLLABO_LABELS: Record<string, string> = {
	planning: '계획형',
	logic: '논리형',
	supporter: '서포터형',
	execution: '실행형',
	empathy: '공감형',
	leadership: '리더형',
}

const ProfileAnalysis = () => {
	const { data: analysisRes, isLoading, isError } = useGetProfileAnalysisQuery()
	const { data: profileData } = useGetProfileQuery()
	const { skillCategories, skillsByCategory, roles } = useOnboardingEnums()
	const { setErrorModal } = useErrorModal()

	const body = analysisRes?.body
	const profile = profileData?.body

	if (isError) {
		setErrorModal('', '데이터를 불러오는데 실패했습니다.')
	}

	const type = body?.profileType ?? ''
	const tags = body?.tags ?? []
	const radarData: RadarDataItem[] = body?.collaborationStyle
		? (['planning', 'logic', 'supporter', 'execution', 'empathy', 'leadership'] as const).map(key => ({
				subject: COLLABO_LABELS[key],
				value: body.collaborationStyle[key],
		  }))
		: []
	const skills =
		body?.skills?.map(s => {
			const categoryLabel = skillCategories.find(c => c.value === s.category)?.label ?? s.category
			const categorySkills = skillsByCategory[s.category] ?? []
			const skillList = (s.skill_names ?? [])
				.map(x => x.trim())
				.filter(Boolean)
				.map(value => categorySkills.find(sk => sk.value === value)?.label ?? value)
			return { skillName: categoryLabel, skillList }
		}) ?? []
	const roleRecommend =
		body?.roleRecommendation != null
			? [
					{ role: '리더', title: '다음과 같은 성격의 팀원과 함께하세요!', description: body.roleRecommendation.leader ?? '' },
					{ role: '팀원', title: '현재 모집중인 프로젝트를 추천할게요!', description: body.roleRecommendation.team_member ?? '' },
			  ]
			: []
	const growGuide =
		body?.growthGuide?.map(g => ({
			tipText: g.tip,
			title: g.title,
			description: g.content,
		})) ?? []

	const roleValue = profile?.role ?? ''
	const roleLabel = roles.find(r => r.value === roleValue)?.label ?? roleValue

	const hasReport = !!body

	if (isLoading) {
		return (
			<div className='ml-7 w-full flex flex-col justify-center'>
				<MyPageHeader />
				<div className='body-1 text-neutral-500 flex flex-col justify-center items-center'>
					<img src={NecttyIcon} className='w-58.25 h-58.25 px-[22.25px] py-[37.5px] mt-4 mb-12' />
					<p>
						<span className='text-primary-500-normal font-semibold'>{profile?.name}</span>님의 프로필 분석내역을
						불러오는중...
					</p>
				</div>
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
										{profile?.name ?? ''}님은 [{type}] 타입이시네요!
									</h2>

									{/* 태그 섹션 */}
									<div className='flex items-center gap-3'>
										{/* 직무 태그 */}
										<span className='title-3 px-2.5 py-1 bg-roletag-purple text-neutral-700 font-semibold rounded-md'>
											{roleLabel}
										</span>

										{/* 해시태그들 */}
										<div className='flex items-center gap-2.5 body-2'>
											{tags.map(tag => (
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
										{growGuide.map((g, index) => (
											<GrowGuideSection
												key={index}
												tipText={g.tipText}
												title={g.title}
												description={g.description}
											/>
										))}
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
