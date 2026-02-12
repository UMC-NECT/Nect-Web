import { useState } from 'react';
import ProjectHistory from './ProjectHistory';
import ProfileCard from '@/components/mypage/ProfileCard';
import RoleTagChip from '@/components/mission-modal/RoleTagChip';
import MemberProfileModal from './MemberProfileModal';
import type { ProjectDetailDto } from '@/types/api/project';
import type { ProjectMemberDto } from '@/types/api/project/members';
import { useProjectMembers } from '@/hooks/queries/project';
import { useMemberDetail } from '@/hooks/queries/member/useMemberDetail';

interface TeamMembersTabProps {
    projectData: ProjectDetailDto;
    getPositionStyle: (position: string) => string;
    projectId: number;
}

const TeamMembersTab = ({ projectData, getPositionStyle, projectId }: TeamMembersTabProps) => {
    const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
    const { data: membersData } = useProjectMembers(projectId);
    const { data: memberDetail, isLoading: isMemberDetailLoading } = useMemberDetail(
        selectedMemberId ?? 0,
        { enabled: !!selectedMemberId }
    );

    // role_field별로 멤버 그룹화 (API 응답의 role_field 기준 동적 그룹핑)
    const membersByRoleField = (membersData?.users ?? []).reduce<Record<string, ProjectMemberDto[]>>((acc, user) => {
        const key = user.role_field;
        if (!acc[key]) acc[key] = [];
        acc[key].push(user);
        return acc;
    }, {});

    // role_field 순서 (우선 표시할 파트 순)
    const roleFieldOrder = ['PM', 'SERVICE', 'PLANNER', 'UI_UX', 'DESIGN', 'FRONTEND', 'BACKEND', 'SERVER', 'DATA', 'AI_MACHINE_LEARNING', 'MARKETER', 'MARKETING', 'OTHER'];
    const sortedRoleFields = Object.keys(membersByRoleField).sort((a, b) => {
        const aIdx = roleFieldOrder.indexOf(a);
        const bIdx = roleFieldOrder.indexOf(b);
        if (aIdx === -1 && bIdx === -1) return a.localeCompare(b);
        if (aIdx === -1) return 1;
        if (bIdx === -1) return -1;
        return aIdx - bIdx;
    });

    const handleMemberClick = (member: ProjectMemberDto) => {
        setSelectedMemberId(member.user_id);
    };

    const roleLabelMap: Record<string, string> = {
        PLANNER: '기획자',
        DESIGNER: '디자이너',
        DEVELOPER: '개발자',
        MARKETER: '마케터',
        OTHER: '기타',
    };

    return (
        <div className='flex flex-col gap-16 w-full ml-[10px] pb-[64px]'>
            {/* 섹션 01. 파트별 팀원 프로필 */}
            <div className='flex flex-col gap-6'>
                <h3 className='title-2 font-bold text-neutral-900'>파트별 팀원 프로필</h3>
                {sortedRoleFields.length === 0 ? (
                    <p className='text-[16px] text-neutral-500'>팀원 정보가 없습니다.</p>
                ) : (
                    <div className='flex flex-col gap-12'>
                        {sortedRoleFields.map((roleField) => {
                            const members = membersByRoleField[roleField] ?? [];
                            const sectionLabel = members[0]?.part_label ?? members[0]?.custom_role_field_name ?? roleField;
                            return (
                                <div key={roleField} className='flex flex-col gap-3'>
                                    <RoleTagChip
                                        roleId={Math.max(1, roleFieldOrder.indexOf(roleField) + 1)}
                                        roleName={sectionLabel}
                                        roleField={roleField}
                                        state='default'
                                        className='hover:cursor-default'
                                    />
                                    <div className='flex flex-wrap gap-3 w-full'>
                                        {members.map((member) => {
                                            const isSelected = selectedMemberId === member.user_id;
                                            const roleFromDetail = isSelected && memberDetail?.role ? memberDetail.role : null;
                                            const roleToShow = member.role ?? roleFromDetail;
                                            const partDisplay = roleToShow
                                                ? (roleLabelMap[roleToShow] ?? roleToShow)
                                                : member.part_label || member.custom_role_field_name || member.role_field;
                                            return (
                                                <div
                                                    key={member.user_id}
                                                    className='cursor-pointer'
                                                    onClick={() => handleMemberClick(member)}
                                                >
                                                    <ProfileCard
                                                        profileImage={
                                                            member.profile_image_url ? (
                                                                <img
                                                                    src={member.profile_image_url}
                                                                    alt=''
                                                                    className='w-20 h-20 rounded-full object-cover'
                                                                />
                                                            ) : undefined
                                                        }
                                                        isLeader={member.member_type === 'LEADER'}
                                                        highlighted={member.member_type === 'LEADER'}
                                                        nickname={member.nickname}
                                                        part={partDisplay}
                                                        introduction={member.bio ?? undefined}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 섹션 02. 팀원들의 프로젝트 히스토리 */}
            <div className='flex flex-col gap-5'>
                <ProjectHistory projectData={projectData} getPositionStyle={getPositionStyle} noTopMargin />
            </div>

            {/* 모달 */}
            {selectedMemberId && (
                <MemberProfileModal
                    isOpen={true}
                    onClose={() => setSelectedMemberId(null)}
                    member={memberDetail}
                    isLoading={isMemberDetailLoading}
                />
            )}
        </div>
    );
};

export default TeamMembersTab;