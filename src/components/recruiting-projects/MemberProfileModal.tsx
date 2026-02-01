import bar from '@/assets/icons/common/bar.svg';
import projectIcon from '@/assets/icons/common/project-icon.svg';
import clip from '@/assets/icons/common/clip.svg';

interface MemberProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    member: {
        name: string;
        role: string;
        position: string;
        email: string;
        profileImage?: string;
        isRecruiting?: boolean;
        jobTitle: string;
        field: string;
        experience: string;
        introduction: string;
        coreCompetencies: string[];
        portfolioKeywords: string[];
        designTools: string[];
        recordTools: string[];
        etcTools: string[];
    };
    getPositionStyle: (position: string) => string;
}

const MemberProfileModal = ({ isOpen, onClose, member }: MemberProfileModalProps) => {
    if (!isOpen) return null;

    return (
        <div 
            className='fixed inset-0 bg-neutral-900/70 flex items-center justify-center z-50'
            onClick={onClose}
        >
            <div 
                className='w-[916px] max-h-[90vh] bg-white rounded-xl overflow-y-auto'
                onClick={(e) => e.stopPropagation()}
            >
                <div className='my-[56px] mx-[46px]'>
                    {/* 헤더 */}
                    <div className='flex items-start gap-6 mb-10'>
                        {/* 프로필 이미지 */}
                        <div className='w-[110px] h-[110px] bg-yellow-200 rounded-full flex-shrink-0'></div>
                        
                        {/* 기본 정보 */}
                        <div className='flex-1'>
                            <div className='flex items-center gap-3 mb-2'>
                                <h2 className='text-[28px] font-bold'>{member.name}</h2>
                                <img src={bar} alt="Bar" className='w-[2px] h-[16px] bg-neutral-300' />
                                <span className='text-[20px] text-neutral-400'>{member.position}</span>
                            </div>
                            <p className='text-[14px] text-neutral-500 mb-3'>{member.email}</p>
                            {member.isRecruiting && (
                                <span className='inline-flex items-center justify-center w-[64px] h-[28px] border border-primary-200-light bg-primary-100-light text-primary-500-normal text-[14px] rounded-[100px]'>
                                    재학 중
                                </span>
                            )}
                        </div>
                    </div>

                    {/* 관심 직무/직종 */}
                    <div className='mb-[48px]'>
                        <div className='flex gap-[60px] text-[16px]'>
                            <div className='flex gap-4'>
                                <span className='text-neutral-600 w-[100px] mr-[20px]'>관심 직무</span>
                                <span className='text-neutral-900'>{member.jobTitle}</span>
                            </div>
                        </div>
                        <div className='flex gap-[60px] text-[16px] mt-3'>
                            <div className='flex gap-4'>
                                <span className='text-neutral-600 w-[100px] mr-[20px]'>관심 직종</span>
                                <span className='text-neutral-900'>{member.field}</span>
                            </div>
                        </div>
                        <div className='flex gap-[60px] text-[16px] mt-3'>
                            <div className='flex gap-4'>
                                <span className='text-neutral-600 w-[100px] mr-[20px]'>경력</span>
                                <span className='text-neutral-900'>{member.experience}</span>
                            </div>
                        </div>
                    </div>

                    {/* 자기소개 */}
                    <div className='mb-[64px]'>
                        <h3 className='text-[20px] font-bold mb-4'>자기소개</h3>
                        <p className='text-[16px] text-neutral-900 leading-relaxed whitespace-pre-line py-4'>
                            {member.introduction}
                        </p>
                    </div>

                    {/* 핵심역량 */}
                    <div className='mb-[64px]'>
                        <h3 className='text-[20px] font-bold mb-4'>핵심역량</h3>
                        <ul className='space-y-2 list-disc list-inside text-[16px] text-neutral-900'>
                            {member.coreCompetencies.map((competency, index) => (
                                <li key={index}>{competency}</li>
                            ))}
                        </ul>
                    </div>

                    {/* 프로필 분석 키워드 */}
                    <div className='mb-[64px]'>
                        <h3 className='text-[20px] font-bold mb-4'>프로필 분석 키워드</h3>
                        <div className='mb-2'>
                            <a href="#" className='text-[16px] text-primary-500-normal'>
                                [설세한 서포터형] 티업
                            </a>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            {member.portfolioKeywords.map((keyword, index) => (
                                <span key={index} className='text-[16px] text-neutral-600'>
                                    {keyword}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* 보유스킬 */}
                    <div className='mb-8'>
                        <h3 className='text-[20px] font-bold mb-6'>보유스킬</h3>
                        
                        {/* 디자인 툴 */}
                        <div className='flex gap-4 mb-4'>
                            <span className='text-[16px] text-neutral-600 w-[60px]'>디자인</span>
                            <div className='flex flex-wrap gap-[6px]'>
                                {member.designTools.map((tool, index) => (
                                    <span key={index} className='px-[16px] py-[6px] text-neutral-700 border border-[#eeeeee] text-[16px] rounded-lg'>
                                        {tool}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* 기록 툴 */}
                        <div className='flex gap-4 mb-4'>
                            <span className='text-[16px] text-neutral-600 w-[60px]'>기획</span>
                            <div className='flex flex-wrap gap-[6px]'>
                                {member.recordTools.map((tool, index) => (
                                    <span key={index} className='px-[16px] py-[6px] text-neutral-700 border border-[#eeeeee] text-[16px] rounded-lg'>
                                        {tool}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* 기타 툴 */}
                        <div className='flex gap-4'>
                            <span className='text-[16px] text-neutral-600 w-[60px]'>기타</span>
                            <div className='flex flex-wrap gap-[6px]'>
                                {member.etcTools.map((tool, index) => (
                                    <span key={index} className='px-[16px] py-[6px] text-neutral-700 border border-[#eeeeee] text-[16px] rounded-lg'>
                                        {tool}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 관심 분야 */}
                    <div className='mt-[64px] ml-[10px]'>
                        <h2 className='font-bold text-[20px] mb-4'>
                            관심 분야
                        </h2>
                        <div className='flex gap-[10px]'>
                            <p className='w-[165px] h-[36px] bg-primary-150-light border border-primary-400 rounded-2xl text-primary-500-normal font-semibold items-center flex justify-center'>
                                ITㆍ웹,모바일 서비스
                            </p>
                            <p className='w-[127px] h-[36px] bg-primary-150-light border border-primary-400 rounded-2xl text-primary-500-normal font-semibold items-center flex justify-center'>
                                교육ㆍ에듀테크
                            </p>
                            <p className='w-[114px] h-[36px] bg-primary-150-light border border-primary-400 rounded-2xl text-primary-500-normal font-semibold items-center flex justify-center'>
                                금융ㆍ핀테크
                            </p>
                        </div>
                    </div>

                    {/* 주요 경력/이력 */}
                    <div className='mt-[64px]'>
                        <h2 className='font-bold text-[20px] mb-[22px]'>
                            주요 경력/이력
                        </h2>
                        
                        {/* 경력 카드 */}
                        <div className='p-[20px]'>
                            {/* 헤더 */}
                            <div className='flex items-start  mb-4'>
                                <div className='w-[40px] h-[40px] bg-primary-400-normal rounded-lg flex items-center justify-center flex-shrink-0'>
                                    <img src={projectIcon} alt="Project" className='w-6 h-6' />
                                </div>
                                <div className='flex-1 mb-[10px] ml-[20px]'>
                                    <h3 className='text-[18px] font-semibold mb-2'>트리플 UX.UI 개선 및 리브랜딩</h3>
                                    <p className='text-[14px] text-neutral-600'>
                                        2025.9 - 2025.12 (3개월) | UXUI / 브랜딩 | 리드 디자이너
                                    </p>
                                </div>
                            </div>

                            {/* 디자인 시스템 컴포넌트 개선 */}
                            <div className='mb-6 p-[20px] ml-[40px]'>
                                <h4 className='text-[16px] font-bold mb-3'>디자인 시스템 컴포넌트 개선</h4>
                                <ul className='space-y-2 list-disc list-inside text-[14px] text-neutral-700'>
                                    <li>피그마를 활용한 UI 컴포넌트 제작 및 관리</li>
                                    <li>통일되지 않은 컬러, 타이포그래피 정리</li>
                                    <li>디자인 시스템 활용률 기존 대비 60% 증가</li>
                                </ul>
                            </div>

                            {/* 여플 IA 구조 재정리 및 Bottom Navi Bar 도입 */}
                            <div className='mb-6 p-[20px] ml-[40px]'>
                                <h4 className='text-[16px] font-bold mb-3'>여플 IA 구조 재정리 및 Bottom Navi Bar 도입</h4>
                                <ul className='space-y-2 list-disc list-inside text-[14px] text-neutral-700'>
                                    <li>혼란했던 기능들과 복잡한 네임들을 구조적으로 개선</li>
                                    <li>기능의 조제를 모르거나 적은 사용률의 문제를 해결하기 위해 바텀 네비바 제작</li>
                                    <li>페이지 이동 Deapth를 줄여 편리하게 하고, 핵심 기능의 노출도를 높임</li>
                                </ul>
                            </div>

                            {/* 사용자 체류 시간을 늘리기 위한 극대화 전략 제안 */}
                            <div className='mb-6 p-[20px] ml-[40px]'>
                                <h4 className='text-[16px] font-bold mb-3'>사용자 체류 시간을 늘리기 위한 극대화 전략 제안</h4>
                                <ul className='space-y-2 list-disc list-inside text-[14px] text-neutral-700'>
                                    <li>여행 전 중심의 Flow에서 여행 전.중.후 전반에 활동 될 수 있게 UX 개선</li>
                                    <li>유저의 주사용 기능과 서비스 목적의 바탕으로 사용자 친화적 UX 재설계 & 기능 노출</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* 포트폴리오 링크 및 파일 */}
                    <div className='mt-[44px]'>
                        <h3 className='font-bold text-[20px] mb-4'>
                            포트폴리오 링크 및 파일
                        </h3>
                        <div>
                            <img src={clip} alt="Clip" className='inline-block w-[18px] h-[18px] mr-[10px]' />
                            <span className='text-[16px] text-primary-500-normal font-semibold'>
                                넥트 프로젝트 기획서
                            </span>
                        </div>
                        <a href="#" className='text-[16px] ml-[30px] text-neutral-600 underline'>https://www.figma.com/slide/</a>
                    </div>

                    {/* 프로젝트 히스토리 */}                    
                    <div className='mt-[64px] w-[386px] border border-neutral-200 rounded-xl overflow-hidden'>
                        <div className='w-full h-[211px] bg-black rounded-xl'></div>
                        
                        <div className='pl-[20px] pr-[20px]'>
                            <h4 className='font-semibold text-[18px] mt-[14px] mb-[6px]'>트리플 UX.UI 개선 및 리브랜딩</h4>
                            <p className='text-[14px] text-neutral-600 mb-[6px] line-clamp-2'>
                                사용 체류 시간을 늘리고 기업 비전에 맞게 전략 및 BI 제안 <br />
                                / 여행의 전반에 활용 될 수 있는 UX Flow 개선 / GUI 제작
                            </p>
                            <p className='text-[14px] text-neutral-400'>2025.10~2025.12</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberProfileModal;