import { useState } from 'react';
import clip from '@/assets/icons/common/clip.svg';
import chevronDown from '@/assets/icons/common/chevron-down.svg'
import chevronUp from '@/assets/icons/common/chevron-up.svg'

const ProjectGoalsSection = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className='mt-[64px] ml-[10px]'>
            <h2 className='font-bold text-[20px] mb-4'>
                프로젝트 목표
                <span className='text-red-500 text-[16px] ml-1'>*</span>
            </h2>

            <div className='relative'>
                <ul className={`space-y-2 list-disc list-outside text-[16px] pl-5 transition-all ${!isExpanded ? 'max-h-[150px] overflow-hidden' : ''}`}>
                    <li>사이드 프로젝트를 함께 할 팀원을 신뢰성있고 쉽게 찾을 수 있게함</li>
                    <li>프로젝트 팀 매칭 서비스부터 협업 플랫폼까지 원스톱 생태계 구축</li>
                    <li>팀 중심의 크리에이터에게 새로운 협업 문화 확산</li>
                </ul>

                {!isExpanded && (
                    <div className='absolute bottom-0 left-0 right-0 h-[60px] bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none'></div>
                )}
            </div>

            {isExpanded && (
                <div>
                    <div className='mt-[64px]'>
                        <h3 className='font-bold text-[20px] mb-4'>
                            주요 기능
                            <span className='text-red-500 text-[16px] ml-1'>*</span>
                        </h3>
                        <ul className='space-y-2 list-disc list-outside text-[16px] pl-5'>
                            <li>관심사ㆍ목표 기반 매칭 시스템 (관심분야ㆍ역할ㆍ목표 등 입력)</li>
                            <li>아이디어 분석 기능 (프로젝트 아이디어 입력시, 달성을 위한 목표ㆍ팀구성ㆍ기간 등을 정리해줌)</li>
                            <li>협업 보드 (매칭 후 프로젝트 내에서 역할ㆍ일정ㆍ작업을 한눈에 관리)</li>
                            <li>기본 알림 및 커뮤니케이션 기능 (초대, 역할 변경, 일정 마감 등의 주요 이벤트를 실시간으로 공유)</li>
                            <li>Week-Mission 시스템 (주 단위로 프로젝트를 설계하고 주차별 진행률을 시각화)</li>
                        </ul>
                    </div>

                    <div className='mt-[64px]'>
                        <h3 className='font-bold text-[20px] mb-4'>
                            서비스 사용자
                            <span className='text-red-500 text-[16px] ml-1'>*</span>
                        </h3>
                        <ul className='space-y-2 list-disc list-outside text-[16px] pl-5'>
                            <li>대학생 - 공모전, 해커톤, 포트폴리오용 프로젝트를 진행하고 싶은 학생</li>
                            <li>직장인 - 본업 외 사이드프로젝트나 개인 브랜딩을 위해 팀을 구하는 직장인</li>
                            <li>프리랜서/크리에이터 - 새로운 협업 경험을 통해 네트워크를 넓히고 싶은 창작자</li>
                        </ul>
                    </div>

                    <div className='mt-[64px]'>
                        <h3 className='font-bold text-[20px] mb-4'>
                            프로젝트 세부 기획 파일
                        </h3>
                        <div>
                            <img src={clip} alt="Clip" className='inline-block w-[18px] h-[18px] mr-[10px]' />
                            <span className='text-[16px] text-primary-500-normal font-semibold'>
                                넥트 프로젝트 기획서
                            </span>
                        </div>
                        <a href="#" className='text-[16px] ml-[30px] text-neutral-600 underline'>https://www.figma.com/slide/</a>
                    </div>
                </div>
            )}

            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className='w-full mt-10 h-[48px] bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-center gap-2'
            >
                <span className='text-[16px] font-semibold text-neutral-600'>
                    {isExpanded ? '접기' : '더보기'}
                </span>
                <img 
                    src={isExpanded ? chevronUp : chevronDown} 
                    alt={isExpanded ? '접기' : '더보기'} 
                    className='w-[12px] h-[12px]'
                />
            </button>
        </div>
    );
};

export default ProjectGoalsSection;