import Logo from '@/assets/icons/common/logo-big.svg?react'
import { useCollaboStore, useGrowGuideStore, useRoleRecommendStore, useSkillStore } from '@/stores/profileAnalysisStore'
import ProfileRadarChart from '@/components/profile-analysis/ProfileRadarChart'
import ContentSection from '@/components/profile-analysis/ContentSection'
import SkillSection from '@/components/profile-analysis/SkillSection'
import RoleRecommend from '@/components/profile-analysis/RoleRecommend'
import GrowGuideSection from '@/components/profile-analysis/GrowGuideSection'
import RecommendationProject from '@/components/main/RecommendationProject'
import RecommendationMember from '@/components/main/RecommendationMember'
import Button from '@/components/common/Button'
import { useNavigate } from 'react-router'

const ProfileAnalysisPage = () => {
	const { type, role, tags, radarData } = useCollaboStore()
    const { skills } = useSkillStore()
    const { roleRecommend } = useRoleRecommendStore()
    const { growGuide } = useGrowGuideStore()
    const navigate = useNavigate()

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
                            이방토님은 [{type}] 타입이시네요!
                        </h2>

                        {/* 태그 섹션 */}
                        <div className='flex items-center gap-4 mt-2'>
                            {/* 직무 태그 */}
                            <span className='title-2 px-4 py-1.5 bg-roletag-purple text-neutral-700 font-bold rounded-md'>
                                {role}
                            </span>

                            {/* 해시태그들 */}
                            <div className='flex items-center gap-3 body-2'>
                                {tags.map((tag) => (
                                    <span className='title-2 font-medium text-neutral-900' key={tag}># {tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 협업 스타일 레이더 차트 */}
                    <ContentSection title='협업 스타일' className='mb-20'>
                        <ProfileRadarChart data={radarData} className='w-[600px] h-[500px] mx-auto' />
                    </ContentSection>

                    {/* 보유 스킬 섹션*/}
                    <ContentSection title='보유 스킬' className='mb-[110px]'>
                        <div className='flex flex-col gap-6 px-2 mt-6'>
                            {skills.map((skill) => (
                                <SkillSection key={skill.skillName} skillName={skill.skillName} skillList={skill.skillList} />
                            ))}
                        </div>
                    </ContentSection>

                    {/* 역할별 맞춤 추천 섹션 */}
                    <ContentSection title='역할별 맞춤 추천' className='mb-[110px]'>
                        <div className='flex flex-col gap-6 px-2 mt-6'>
                            {roleRecommend.map((roleRecommend, index) => (
                                <RoleRecommend key={index} role={roleRecommend.role} title={roleRecommend.title} description={roleRecommend.description} />
                            ))}
                        </div>
                    </ContentSection>

                    {/* 성장 가이드 */}
                    <ContentSection title='성장 가이드'>
                        <div className='flex flex-col gap-6 px-2 mt-6'>
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
                <Button color='primary' size='xl' fullWidth>아이디어 분석 후 프로젝트 생성</Button>
            </div>
		</div>
	)
}

export default ProfileAnalysisPage