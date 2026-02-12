import clip from '@/assets/icons/common/clip.svg';
import projectIcon from '@/assets/icons/common/project-icon.svg';
import SkillCategory from '@/components/recruiting-projects/SkillCategory';
import type { MemberDetailDto } from '@/types/api/member/detail';

interface MemberProfileDetailProps {
    memberData: MemberDetailDto;
}

const MemberProfileDetail = ({ memberData }: MemberProfileDetailProps) => {
    // API 응답의 모든 카테고리(MARKETING, DESIGN, PLANNING 등)에 대해 동적으로 스킬 표시
    const skillCategories = (memberData.skills || [])
        .map(cat => ({
            categoryLabel: cat.categoryLabel || cat.category,
            tools: cat.skills
                ?.filter(skill => skill.isSelected)
                .map(skill => skill.skillLabel) || [],
        }))
        .filter(cat => cat.tools.length > 0);

    return (
        <>
            {/* 관심 직무/직종 */}
            <div className='mb-[48px] font-medium'>
                <div className='flex gap-[60px] text-[16px]'>
                    <div className='flex gap-4'>
                        <span className='text-neutral-600 w-[100px] mr-[20px]'>관심 직무</span>
                        <span className='text-neutral-900'>{memberData.interestedJob || '-'}</span>
                    </div>
                </div>
                <div className='flex gap-[60px] text-[16px] mt-3'>
                    <div className='flex gap-4'>
                        <span className='text-neutral-600 w-[100px] mr-[20px]'>관심 직종</span>
                        <span className='text-neutral-900'>{memberData.interestedField || '-'}</span>
                    </div>
                </div>
                <div className='flex gap-[60px] text-[16px] mt-3'>
                    <div className='flex gap-4'>
                        <span className='text-neutral-600 w-[100px] mr-[20px]'>경력</span>
                        <span className='text-neutral-900'>{memberData.careerDuration || '-'}</span>
                    </div>
                </div>
            </div>

            {/* 자기소개 */}
            <div className='mb-[64px]'>
                <h3 className='text-[20px] font-bold mb-4'>자기소개</h3>
                <p className='text-[16px] text-neutral-900 leading-relaxed whitespace-pre-line py-4'>
                    {memberData.bio || '자기소개가 없습니다.'}
                </p>
            </div>

            {/* 핵심역량 */}
            <div className='mb-[64px]'>
                <h3 className='text-[20px] font-bold mb-4'>핵심역량</h3>
                {memberData.coreCompetencies && (
                    Array.isArray(memberData.coreCompetencies) ? 
                        memberData.coreCompetencies.length > 0 : 
                        memberData.coreCompetencies.trim()
                ) ? (
                    <ul className='space-y-2 list-disc list-outside text-[16px] font-medium text-neutral-900 pl-5'>
                        {(Array.isArray(memberData.coreCompetencies) 
                            ? memberData.coreCompetencies 
                            : memberData.coreCompetencies.split('\n')
                        ).map((competency, index) => (
                            <li key={index}>{competency}</li>
                        ))}
                    </ul>
                ) : (
                    <p className='text-[16px] text-neutral-500 py-4'>핵심역량이 없습니다.</p>
                )}
            </div>

            {/* 프로필 분석 키워드 */}
            <div className='mb-[64px]'>
                <h3 className='text-[20px] font-bold mb-4'>프로필 분석 키워드</h3>
                {memberData.profileType || (memberData.tags && memberData.tags.length > 0) ? (
                    <>
                        {memberData.profileType && (
                            <div className='mb-2'>
                                <p className='text-[16px] font-medium text-primary-500-normal'>
                                    [{memberData.profileType}]
                                </p>
                            </div>
                        )}
                        {memberData.tags && memberData.tags.length > 0 && (
                            <div className='flex flex-wrap gap-2'>
                                {memberData.tags.map((tag, index) => (
                                    <span key={index} className='text-[16px] text-neutral-600'>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <p className='text-[16px] text-neutral-500 py-4'>프로필 분석 키워드가 없습니다.</p>
                )}
            </div>

            {/* 보유스킬 */}
            <div className='mb-8'>
                <h3 className='text-[20px] font-bold mb-4'>보유스킬</h3>
                {skillCategories.length > 0 ? (
                    <>
                        {skillCategories.map((cat) => (
                            <SkillCategory
                                key={cat.categoryLabel}
                                category={cat.categoryLabel}
                                tools={cat.tools}
                            />
                        ))}
                    </>
                ) : (
                    <p className='text-[16px] text-neutral-500 py-4'>보유스킬이 없습니다.</p>
                )}
            </div>

            {/* 관심 분야 */}
            <div className='mt-[64px]'>
                <h2 className='font-bold text-[20px] mb-4'>관심 분야</h2>
                {memberData.interestedField ? (
                    <div className='flex gap-[10px]'>
                        <p className='px-4 h-[36px] bg-primary-150-light border border-primary-400 rounded-2xl text-primary-500-normal font-semibold items-center flex justify-center'>
                            {memberData.interestedField}
                        </p>
                    </div>
                ) : (
                    <p className='text-[16px] text-neutral-500 py-4'>관심 분야가 없습니다.</p>
                )}
            </div>

            {/* 주요 경력/이력 */}
            <div className='mt-[64px]'>
                <h2 className='font-bold text-[20px] mb-[22px]'>주요 경력/이력</h2>
                {memberData.careers && memberData.careers.length > 0 ? (
                    <div className='px-[20px] space-y-8'>
                        {memberData.careers.map((career) => (
                            <div key={career.userCareerId}>
                                <div className='flex items-center'>
                                    <div className='w-[40px] h-[40px] bg-primary-400-normal rounded-lg flex items-center justify-center flex-shrink-0'>
                                        <img src={projectIcon} alt="Project" className='w-6 h-6' />
                                    </div>
                                    <div className='ml-[20px]'>
                                        <h3 className='text-[18px] font-semibold mb-2'>{career.projectName}</h3>
                                        <p className='text-[16px] text-neutral-900'>
                                            {career.startDate} - {career.isOngoing ? '진행 중' : career.endDate} | {career.industryField} | {career.role}
                                        </p>
                                    </div>
                                </div>

                                {career.achievements && career.achievements.length > 0 && (
                                    <div className='px-[20px] ml-[40px] mt-4'>
                                        {career.achievements.map((achievement) => (
                                            <div key={achievement.userAchievementId} className='mb-6'>
                                                <h4 className='text-[16px] font-bold mb-3'>{achievement.title}</h4>
                                                <p className='text-[16px] font-medium text-neutral-900 whitespace-pre-line'>
                                                    {achievement.content}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className='text-[16px] text-neutral-500 py-4'>주요 경력/이력이 없습니다.</p>
                )}
            </div>

            {/* 포트폴리오 링크 및 파일 */}
            <div className='mt-[64px]'>
                <h3 className='font-bold text-[20px] mb-4'>포트폴리오 링크 및 파일</h3>
                {memberData.portfolios && memberData.portfolios.length > 0 ? (
                    <div className='space-y-3'>
                        {memberData.portfolios.map((portfolio) => (
                            <div key={portfolio.userPortfolioId}>
                                <div>
                                    <img src={clip} alt="Clip" className='inline-block w-[18px] h-[18px] mr-[10px]' />
                                    <span className='text-[16px] text-primary-500-normal font-semibold'>
                                        {portfolio.title}
                                    </span>
                                </div>
                                {portfolio.link && (
                                    <a href={portfolio.link} target="_blank" rel="noopener noreferrer" className='text-[16px] ml-[30px] text-neutral-600 underline'>
                                        {portfolio.link}
                                    </a>
                                )}
                                {portfolio.fileUrl && (
                                    <a href={portfolio.fileUrl} target="_blank" rel="noopener noreferrer" className='text-[16px] ml-[30px] text-neutral-600 underline block'>
                                        파일 다운로드
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className='text-[16px] text-neutral-500 py-4'>포트폴리오가 없습니다.</p>
                )}
            </div>

            {/* 프로젝트 히스토리 */}
            <div className='mt-16'>
                <h3 className='font-bold text-[20px] text-neutral-900-dark mb-4'>프로젝트 히스토리</h3>
                {memberData.projectHistories && memberData.projectHistories.length > 0 ? (
                    <div className='grid grid-cols-2 gap-4'>
                        {memberData.projectHistories.map((project) => (
                            <div key={project.userProjectHistoryId} className='w-[386px] border border-neutral-200 rounded-xl overflow-hidden pb-4'>
                                <div className='w-full h-[211px] bg-neutral-200 rounded-xl overflow-hidden'>
                                    {project.projectImage && (
                                        <img 
                                            src={project.projectImage} 
                                            alt={project.projectName}
                                            className='w-full h-full object-cover'
                                        />
                                    )}
                                </div>
                                <div className='pl-[20px] pr-[20px]'>
                                    <h4 className='font-semibold text-[18px] mt-[14px] mb-[6px]'>
                                        {project.projectName}
                                    </h4>
                                    <p className='text-[14px] font-medium text-neutral-600 mb-[6px] line-clamp-2'>
                                        {project.projectDescription}
                                    </p>
                                    <p className='text-[14px] text-neutral-400'>
                                        {project.startYearMonth}~{project.endYearMonth}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className='text-[16px] text-neutral-500 py-4'>프로젝트 히스토리가 없습니다.</p>
                )}
            </div>
        </>
    );
};

export default MemberProfileDetail;