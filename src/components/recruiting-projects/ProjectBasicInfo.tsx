import type { ProjectDetailDto } from '@/types/api/project';
import type { RecruitmentDto } from '@/types/api/project/recruitment';
import { useProjectRecruitments } from '@/hooks/queries/project';

interface ProjectBasicInfoProps {
    projectData: ProjectDetailDto;
    projectId: number;
    getPositionStyle: (position: string) => string;
}

const ProjectBasicInfo = ({ projectData, projectId, getPositionStyle }: ProjectBasicInfoProps) => {
    // 모집 정보 API 호출
    const { data: recruitments } = useProjectRecruitments(projectId);

    // 날짜 포맷팅 함수
    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}. ${String(date.getDate()).padStart(2, '0')}`;
    };

    // 남은 일수 계산
    const calculateDaysLeft = (endDate: string | null) => {
        if (!endDate) return null;
        const end = new Date(endDate);
        const today = new Date();
        const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff : 0;
    };

    const daysLeft = calculateDaysLeft(projectData.defaultInfo.planned_ended_on);

    return (
        <>
            {/* 프로젝트 정보 내용 */}
            <div className='flex h-[178px] text-[16px]'>
                <div className='w-[320px] h-[178px] bg-neutral-200 rounded-lg mr-[28px]'>
                    {projectData.defaultInfo.image_name && (
                        <img 
                            src={projectData.defaultInfo.image_name} 
                            alt={projectData.defaultInfo.project_title}
                            className='w-full h-full object-cover rounded-lg'
                        />
                    )}
                </div>
                <div className='flex-1'>
                    <div className='mb-4 flex gap-[20px] items-start'>
                        <p className='text-neutral-600 mb-1 w-[100px] whitespace-nowrap'>프로젝트 이름</p>
                        <p className='font-semibold text-primary-600-normal'>{projectData.defaultInfo.project_title || '-'}</p>
                    </div>
                    <div className='mb-4 flex gap-[20px] items-start'>
                        <p className='text-neutral-600 mb-1 w-[100px] whitespace-nowrap'>프로젝트 소개</p>
                        <p className='ml-3'>{projectData.defaultInfo.description || '프로젝트 소개가 없습니다.'}</p>
                    </div>
                    <div className='mb-4 flex gap-[20px] items-start'>
                        <p className='text-neutral-600 mb-1 w-[100px] whitespace-nowrap'>예상 기간</p>
                        <p>{formatDate(projectData.defaultInfo.planned_started_on)} ~ {formatDate(projectData.defaultInfo.planned_ended_on)}</p>
                    </div>
                    <div className='mb-4 flex gap-[20px] items-start'>
                        <p className='text-neutral-600 mb-1 w-[100px] whitespace-nowrap'>모집 여부</p>
                        <p className='text-[16px] flex items-center gap-2'>
                            <div className='bg-primary-100-light w-[74px] h-[26px] rounded-xl flex items-center gap-2 px-2'>
                                <span className='inline-block w-[10px] h-[10px] bg-primary-500-normal rounded-full'></span>
                                <span className='text-[14px]'>모집 중</span>
                            </div>
                            {daysLeft !== null && (
                                <span className='text-primary-500-normal font-bold text-[18px] ml-[10px]'>D-{daysLeft}</span>
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* 프로젝트 분야 */}
            <div className='mt-[64px] ml-[10px]'>
                <h2 className='font-bold text-[20px] mb-4'>
                    프로젝트 분야
                    <span className='text-red-500 text-[16px] ml-1'>*</span>
                </h2>
                {projectData.fields?.fields && projectData.fields.fields.length > 0 ? (
                    <div className='flex gap-[10px] flex-wrap'>
                        {projectData.fields.fields.map((field: { is_selected: boolean; field_name: string }, index: number) => (
                            <p key={index} className='px-4 h-[36px] bg-primary-150-light border border-primary-400 rounded-2xl text-primary-500-normal font-semibold items-center flex justify-center'>
                                {field.field_name}
                            </p>
                        ))}
                    </div>
                ) : (
                    <p className='text-[16px] text-neutral-500'>프로젝트 분야 정보가 없습니다.</p>
                )}
            </div>

            {/* 모집 정보 및 필수 스택 */}
            <div className='mt-[64px] ml-[10px]'>
                <h2 className='font-bold text-[20px] mb-4'>
                    모집 정보 및 필수 스택
                    <span className='text-red-500 text-[16px] ml-1'>*</span>
                </h2>
                
                {recruitments && recruitments.length > 0 ? (
                    <div className='space-y-6'>
                        {recruitments.map((recruitment: RecruitmentDto) => (
                            <div key={recruitment.recruitmentId}>
                                <div className='mb-3'>
                                    <span className={`inline-flex items-center justify-center px-[8px] py-[2px] ${getPositionStyle(recruitment.roleField.toLowerCase())} text-neutral-700 rounded-[6px] text-[14px] font-medium`}>
                                        {recruitment.customField || recruitment.roleField}
                                    </span>
                                    <span className='ml-2 text-[16px] text-neutral-600'>
                                        {recruitment.capacity}명 모집
                                    </span>
                                </div>
                                {recruitment.requirements && recruitment.requirements.length > 0 && (
                                    <ul className='ml-6 space-y-1'>
                                        {recruitment.requirements.map((req: string, idx: number) => (
                                            <li key={idx} className='text-[16px] text-neutral-600 list-disc'>
                                                {req}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className='text-[16px] text-neutral-500'>모집 정보가 없습니다.</p>
                )}
            </div>

            {/* 프로젝트 파트 / 팀원 구성 */}
            <div className='mt-[64px] ml-[10px]'>
                <h2 className='font-bold text-[20px] mb-4'>
                    프로젝트 파트 <span className="text-neutral-600">/</span> 팀원 구성
                    <span className='text-red-500 text-[16px] ml-1'>*</span>
                </h2>

                {projectData.defaultInfo.team_roles && projectData.defaultInfo.team_roles.length > 0 ? (
                    <div className='space-y-6'>
                        {(() => {
                            // role을 파트별로 그룹화
                            const groupByPart = (roles: typeof projectData.defaultInfo.team_roles) => {
                                const partMap: Record<string, { label: string; roles: typeof roles }> = {}
                                roles.forEach((role: { role_field: string; required_count: number }) => {
                                    const field = role.role_field.toLowerCase();
                                    let partKey = '';
                                    let partLabel = '';
                                    
                                    if (field.includes('pm') || field.includes('기획')) {
                                        partKey = 'planning';
                                        partLabel = '기획';
                                    } else if (field.includes('design') || field.includes('디자인')) {
                                        partKey = 'design';
                                        partLabel = '디자인';
                                    } else if (field.includes('frontend') || field.includes('backend') || field.includes('개발')) {
                                        partKey = 'development';
                                        partLabel = '개발';
                                    } else {
                                        partKey = 'other';
                                        partLabel = '기타';
                                    }
                                    
                                    if (!partMap[partKey]) {
                                        partMap[partKey] = { label: partLabel, roles: [] };
                                    }
                                    partMap[partKey].roles.push(role);
                                });
                                
                                return partMap;
                            };
                            
                            const grouped = groupByPart(projectData.defaultInfo.team_roles);
                            
                            return Object.entries(grouped).map(([key, { label, roles }]) => {
                                const totalCount = roles.reduce((sum: number, role: { role_field: string; required_count: number }) => sum + role.required_count, 0)
                                
                                return (
                                    <div key={key} className='flex items-center gap-6'>
                                        <p className='w-[90px] text-[16px] font-medium'>{label}</p>
                                        <p className='w-[50px] text-[16px]'>{totalCount}명</p>
                                        <div className='flex gap-2 flex-wrap'>
                                            {roles.map((role: { role_field: string; required_count: number }, idx: number) => (
                                                <span 
                                                    key={idx}
                                                    className={`inline-flex items-center justify-center px-[8px] py-[2px] ${getPositionStyle(role.role_field.toLowerCase())} text-neutral-700 rounded-[6px] text-[14px] font-medium`}
                                                >
                                                    {role.role_field} ({role.required_count})
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                );
                            });
                        })()}
                    </div>
                ) : (
                    <p className='text-[16px] text-neutral-500'>팀원 구성 정보가 없습니다.</p>
                )}
            </div>
        </>
    );
};

export default ProjectBasicInfo;