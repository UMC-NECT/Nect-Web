import type { ProjectDetailDto } from '@/types/api/project';
import type { TeamRole, TeamRoleField } from '@/types/api/project/detail';
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

    const isTeamRole = (role: unknown): role is TeamRole => {
        if (!role || typeof role !== 'object') return false;
        return 'role' in role && 'count' in role && 'role_fields' in role;
    };

    const isTeamRoleArray = (value: unknown): value is TeamRole[] => {
        return Array.isArray(value) && value.every(isTeamRole);
    };

    const rawTeamRoles = projectData.defaultInfo.team_roles;
    const teamRoleList: TeamRole[] = Array.isArray(rawTeamRoles)
        ? (isTeamRoleArray(rawTeamRoles) ? rawTeamRoles : [])
        : rawTeamRoles?.roles || [];

    const roleLabelMap: Record<string, string> = {
        PLANNER: '기획자',
        DESIGNER: '디자이너',
        DEVELOPER: '개발자',
        MARKETER: '마케터',
        OTHER: '기타',
    };

    const roleOrder = ['PLANNER', 'DESIGNER', 'DEVELOPER', 'MARKETER', 'OTHER'];
    const roleOrderMap = roleOrder.reduce<Record<string, number>>((acc, role, index) => {
        acc[role] = index;
        return acc;
    }, {});

    const roleFieldLabelMap: Record<string, { label: string; styleKey: string }> = {
        PM: { label: 'PM', styleKey: 'pm' },
        SERVICE: { label: 'PM', styleKey: 'pm' },
        UI_UX: { label: 'Design', styleKey: 'design' },
        DESIGN: { label: 'Design', styleKey: 'design' },
        FRONTEND: { label: 'Frontend', styleKey: 'frontend' },
        BACKEND: { label: 'Backend', styleKey: 'backend' },
        SERVER: { label: 'Server', styleKey: 'server' },
        DATA: { label: 'Data', styleKey: 'data' },
        MARKETER: { label: 'Marketer', styleKey: 'pm' },
        MARKETING: { label: 'Marketer', styleKey: 'pm' },
        DEVELOP: { label: 'Develop', styleKey: 'develop' },
    };

    const formatRoleFieldLabel = (field: TeamRoleField) => {
        if (field.label_en) return field.label_en;
        const mapped = roleFieldLabelMap[field.role_field];
        if (mapped) return mapped.label;
        return field.role_field
            .toLowerCase()
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const getRoleFieldStyleKey = (value: string) => {
        return roleFieldLabelMap[value]?.styleKey ?? value.toLowerCase();
    };

    const teamRoleRows = [...teamRoleList]
        .filter((role) => role.count > 0)
        .sort((a, b) => {
        const aOrder = roleOrderMap[a.role] ?? Number.MAX_SAFE_INTEGER;
        const bOrder = roleOrderMap[b.role] ?? Number.MAX_SAFE_INTEGER;
        return aOrder - bOrder;
        });

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
                            {projectData.defaultInfo.recruitment_status === 'OPEN' ? (
                                <>
                                    <div className='bg-primary-100-light w-[74px] h-[26px] rounded-xl flex items-center gap-2 px-2'>
                                        <span className='inline-block w-[10px] h-[10px] bg-primary-500-normal rounded-full'></span>
                                        <span className='text-[14px]'>모집 중</span>
                                    </div>
                                    {daysLeft !== null && (
                                        <span className='text-primary-500-normal font-bold text-[18px] ml-[10px]'>D-{daysLeft}</span>
                                    )}
                                </>
                            ) : (
                                <span className='text-neutral-600'>모집 마감</span>
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
                {(() => {
                    const selectedFields = projectData.fields?.fields?.filter((f) => f.is_selected) ?? [];
                    return selectedFields.length > 0 ? (
                        <div className='flex gap-[10px] flex-wrap'>
                            {selectedFields.map((field: { field_name: string }, index: number) => (
                                <p key={index} className='px-4 h-[36px] bg-primary-150-light border border-primary-400 rounded-2xl text-primary-500-normal font-semibold items-center flex justify-center'>
                                    {field.field_name}
                                </p>
                            ))}
                        </div>
                    ) : (
                        <p className='text-[16px] text-neutral-500'>프로젝트 분야 정보가 없습니다.</p>
                    );
                })()}
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
                                        {recruitment.description || '설명이 없습니다.'}
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

                {teamRoleRows.length > 0 ? (
                    <div className='space-y-6'>
                        {teamRoleRows.map((role) => (
                            <div key={role.role} className='flex items-center gap-6'>
                                <p className='w-[90px] text-[16px] font-medium'>
                                    {roleLabelMap[role.role] || role.role}
                                </p>
                                <p className='w-[50px] text-[16px]'>{role.count}명</p>
                                <div className='flex gap-2 flex-wrap'>
                                    {(role.role_fields || [])
                                        .filter((field: TeamRoleField) => field.count > 0)
                                        .map((field: TeamRoleField) => (
                                            <span
                                                key={`${role.role}-${field.role_field}`}
                                                className={`inline-flex items-center justify-center px-[8px] py-[2px] ${getPositionStyle(getRoleFieldStyleKey(field.role_field))} text-neutral-700 rounded-[6px] text-[14px] font-medium`}
                                            >
                                                {formatRoleFieldLabel(field)}
                                            </span>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className='text-[16px] text-neutral-500'>팀원 구성 정보가 없습니다.</p>
                )}
            </div>
        </>
    );
};

export default ProjectBasicInfo;