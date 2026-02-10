import { useState } from 'react';
import clip from '@/assets/icons/common/clip.svg';
import chevronDown from '@/assets/icons/common/chevron-down.svg'
import chevronUp from '@/assets/icons/common/chevron-up.svg'
import type { ProjectDetailDto } from '@/types/api/project';

interface ProjectGoalsSectionProps {
    projectData: ProjectDetailDto;
}

const ProjectGoalsSection = ({ projectData }: ProjectGoalsSectionProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const hasPurposes = projectData.purposes?.values && projectData.purposes.values.length > 0;
    const hasFunctions = projectData.functions?.values && projectData.functions.values.length > 0;
    const hasServiceUsers = projectData.serviceUsers?.values && projectData.serviceUsers.values.length > 0;
    const hasPlanFiles = projectData.planFiles?.files && projectData.planFiles.files.length > 0;

    return (
        <div className='mt-[64px] ml-[10px]'>
            <h2 className='font-bold text-[20px] mb-4'>
                프로젝트 목표
                <span className='text-red-500 text-[16px] ml-1'>*</span>
            </h2>

            <div className='relative'>
                {hasPurposes ? (
                    <ul className={`space-y-2 list-disc list-outside text-[16px] pl-5 transition-all ${!isExpanded ? 'max-h-[150px] overflow-hidden' : ''}`}>
                        {projectData.purposes.values.map((purpose, index) => (
                            <li key={index}>{purpose}</li>
                        ))}
                    </ul>
                ) : (
                    <p className='text-[16px] text-neutral-500'>프로젝트 목표가 없습니다.</p>
                )}

                {!isExpanded && hasPurposes && (
                    <div className='absolute bottom-0 left-0 right-0 h-[60px] bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none'></div>
                )}
            </div>

            {isExpanded && (
                <div>
                    {hasFunctions && (
                        <div className='mt-[64px]'>
                            <h3 className='font-bold text-[20px] mb-4'>
                                주요 기능
                                <span className='text-red-500 text-[16px] ml-1'>*</span>
                            </h3>
                            <ul className='space-y-2 list-disc list-outside text-[16px] pl-5'>
                                {projectData.functions.values.map((func, index) => (
                                    <li key={index}>{func}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {hasServiceUsers && (
                        <div className='mt-[64px]'>
                            <h3 className='font-bold text-[20px] mb-4'>
                                서비스 사용자
                                <span className='text-red-500 text-[16px] ml-1'>*</span>
                            </h3>
                            <ul className='space-y-2 list-disc list-outside text-[16px] pl-5'>
                                {projectData.serviceUsers.values.map((user, index) => (
                                    <li key={index}>{user}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* 프로젝트 세부 기획 파일 - 항상 표시 */}
                    <div className='mt-[64px]'>
                        <h3 className='font-bold text-[20px] mb-4'>
                            프로젝트 세부 기획 파일
                        </h3>
                        {hasPlanFiles ? (
                            <div>
                                {projectData.planFiles.files.map((file, index) => (
                                    <div key={index} className='mb-2'>
                                        <img src={clip} alt="Clip" className='inline-block w-[18px] h-[18px] mr-[10px]' />
                                        <span className='text-[16px] text-primary-500-normal font-semibold'>
                                            {file.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className='text-[16px] text-neutral-500'>프로젝트 세부 기획 파일이 없습니다.</p>
                        )}
                    </div>
                </div>
            )}

            {/* 더보기 버튼 - 항상 표시 (프로젝트 세부 파일 섹션 포함) */}
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