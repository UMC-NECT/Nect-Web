import Logo from '@/assets/icons/common/logo-big.svg?react'
import ProfileRadarChart from '@/components/profile-analysis/ProfileRadarChart'
import ContentSection from '@/components/profile-analysis/ContentSection'
import SkillSection from '@/components/profile-analysis/SkillSection'
import RoleRecommend from '@/components/profile-analysis/RoleRecommend'
import GrowGuideSection from '@/components/profile-analysis/GrowGuideSection'
import RecommendationProject from '@/components/main/RecommendationProject'
import RecommendationMember from '@/components/main/RecommendationMember'
import Button from '@/components/common/Button'
import { useNavigate } from 'react-router'
import { useGetProfileAnalysisQuery, useGetProfileQuery } from '@/hooks/auth/useUsersApi'
import { useOnboardingEnums } from '@/hooks/auth/useOnboardingEnums'
import type { RadarDataItem } from '@/stores/profileAnalysisStore'

const COLLABO_LABELS: Record<string, string> = {
	planning: '계획형',
	logic: '논리형',
	supporter: '서포터형',
	execution: '실행형',
	empathy: '공감형',
	leadership: '리더형',
}

const ProfileAnalysisPage = () => {
	const navigate = useNavigate()
	const { skillCategories, skillsByCategory, roles } = useOnboardingEnums()
	const { data: analysisRes, isLoading } = useGetProfileAnalysisQuery()
    const {data: profileData} = useGetProfileQuery()
	const body = analysisRes?.body

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

	const roleValue = profileData?.body?.role ?? ''
	const roleLabel = roles.find(r => r.value === roleValue)?.label ?? roleValue

	return (
		<div className='flex flex-col justify-center pt-32'>
            {/* 타이틀 섹션 */}
            <div className='flex flex-col items-center gap-[26px]'>
			    <Logo />
                <p className='heading-1 font-bold text-primary-800-dark'>프로필 분석 리포트</p>
            </div>

            {/* 콘텐츠 섹션 */}
            <div className='bg-bg-gray w-full rounded-100 mt-16 pt-20 pb-24 px-12 shadow-inner-neutral-1'>
                <div className='flex flex-col items-center px-60 mb-[112px]'>
                    <div className='flex flex-col items-center gap-4 mb-24'>
                        {/* 상단 타이틀 */}
                        <p className='title-3 font-semibold text-primary-600-normal'>
                            NECT Analysis Report
                        </p>

                        {/* 메인 타이틀 */}
                        <h2 className='heading-2 font-bold text-neutral-900 text-center'>
                            {isLoading ? '분석 중...' : `${profileData?.body?.name}님은 [${type}] 타입이시네요!`}
                        </h2>

                        {/* 태그 섹션 */}
                        <div className='flex items-center gap-4 mt-2'>
                            {/* 직무 태그 */}
                            <span className='title-2 px-4 py-1.5 bg-roletag-purple text-neutral-700 font-bold rounded-md'>
                                {roleLabel}
                            </span>

                            {/* 해시태그들 */}
                            <div className='flex items-center gap-3 body-2'>
                                {tags.map((tag) => (
                                    <span className='title-2 font-medium text-neutral-900' key={tag}>{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 협업 스타일 레이더 차트 */}
                    <ContentSection title='협업 스타일' className='mb-20'>
                        <ProfileRadarChart data={radarData} className='w-[600px] h-[500px] mx-auto bg-neutral-000 rounded-[20px]' />
                    </ContentSection>

                    {/* 보유 스킬 섹션*/}
                    <ContentSection title='보유 스킬' className='mb-[110px]'>
                        <div className='flex flex-col gap-6 px-2'>
                            {skills.map((skill) => (
                                <SkillSection key={skill.skillName} skillName={skill.skillName} skillList={skill.skillList} />
                            ))}
                        </div>
                    </ContentSection>

                    {/* 역할별 맞춤 추천 섹션 */}
                    <ContentSection title='역할별 맞춤 추천' className='mb-[110px]'>
                        <div className='flex flex-col gap-6 px-2'>
                            {roleRecommend.map((roleRecommend, index) => (
                                <RoleRecommend key={index} role={roleRecommend.role} title={roleRecommend.title} description={roleRecommend.description} />
                            ))}
                        </div>
                    </ContentSection>

                    {/* 성장 가이드 */}
                    <ContentSection title='성장 가이드'>
                        <div className='flex flex-col gap-6 px-2'>
                            {growGuide.map((growGuide, index) => (
                                <GrowGuideSection key={index} tipText={growGuide.tipText} title={growGuide.title} description={growGuide.description} />
                            ))}
                        </div>
                    </ContentSection>
                </div>

                  <div className='w-full flex flex-col gap-5 mb-[108px]'>
                    <p className='text-center heading-2 font-bold text-neutral-900'>넥트 추천 프로젝트</p>
                    <RecommendationProject />
                 </div>

                <div className='w-full flex flex-col gap-5'>
                    <p className='text-center heading-2 font-bold text-neutral-900'>넥트 추천 팀원</p>
                    <RecommendationMember />
                </div>
			</div>

            <div className='flex gap-5 min-w-[660px] justify-center mx-auto mt-[112px] mb-24'>
                <Button color='secondary' size='xl' fullWidth onClick={() => navigate('/')}>메인홈으로 이동</Button>
                <Button color='primary' onClick={() => navigate('/idea-analyze')} size='xl' fullWidth>아이디어 분석 후 프로젝트 생성</Button>
            </div>
		</div>
	)
}

export default ProfileAnalysisPage