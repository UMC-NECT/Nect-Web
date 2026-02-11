import { useState } from 'react';
import ProjectHistory from './ProjectHistory';
import MemberCard from './MemberCard';
import MemberProfileModal from './MemberProfileModal';
import type { ProjectDetailDto } from '@/types/api/project';
import type { ProjectMemberDto } from '@/types/api/project/members';
import type { MemberDetailDto } from '@/types/api/member/detail';
import { useProjectMembers } from '@/hooks/queries/project';

interface TeamMembersTabProps {
    projectData: ProjectDetailDto;
    getPositionStyle: (position: string) => string;
    projectId: number;
}

const TeamMembersTab = ({ projectData, getPositionStyle, projectId }: TeamMembersTabProps) => {
    const [selectedMember, setSelectedMember] = useState<MemberDetailDto | null>(null);
    const { data: membersData } = useProjectMembers(projectId);

    // role_field별로 멤버 그룹화
    const getMembersByField = (field: string) => {
        return membersData?.users.filter(user => user.role_field === field) || [];
    };

    const pmMembers = getMembersByField('PM');
    const designMembers = getMembersByField('DESIGN');
    const frontendMembers = getMembersByField('FRONTEND');
    const backendMembers = getMembersByField('BACKEND');

    // API 데이터를 모달 형식으로 변환
    const convertToMemberDetail = (member: ProjectMemberDto): MemberDetailDto => {
        return {
            userId: member.user_id,
            name: member.name,
            nickname: member.nickname,
            email: '',
            role: member.member_type === 'LEADER' ? 'Leader' : 'Member',
            profileImageUrl: member.profile_image_url,
            bio: member.bio,
            coreCompetencies: null,
            userStatus: 'ACTIVE',
            isPublicMatching: false,
            careerDuration: null,
            interestedJob: member.custom_role_field_name,
            interestedField: member.part_label,
            careers: null,
            portfolios: null,
            projectHistories: null,
            skills: null,
            profileType: null,
            tags: null,
        };
    };

    const handleMemberClick = (member: ProjectMemberDto) => {
        setSelectedMember(convertToMemberDetail(member));
    };

    return (
        <div className='ml-[10px]'>
            <h2 className="font-bold text-[20px] mb-[24px]">파트별 팀원 프로필</h2>

            {/* PM */}
            <div className='flex flex-col mt-[24px]'>
                <div className='mb-[12px]'>
                    <span className={`inline-flex items-center justify-center w-[37px] h-[24px] px-[8px] py-[2px] ${getPositionStyle('pm')} text-neutral-700 rounded-[6px] text-[14px] font-medium`}>
                        PM
                    </span>
                </div>
                {pmMembers.map((member) => (
                    <MemberCard 
                        key={member.user_id} 
                        member={{
                            name: member.name,
                            role: member.member_type === 'LEADER' ? 'Leader' : undefined,
                            position: member.part_label,
                            introduction: member.bio,
                            profileImage: member.profile_image_url || undefined
                        }} 
                        onClick={() => handleMemberClick(member)} 
                    />
                ))}
            </div>

            {/* Design */}
            <div className='mt-[24px]'>
                <div className='mb-[12px]'>
                    <span className={`inline-flex items-center justify-center w-[61px] h-[24px] px-[8px] py-[2px] ${getPositionStyle('design')} text-neutral-700 rounded-[6px] text-[14px] font-medium`}>
                        Design
                    </span>
                </div>
                <div className='flex gap-6'>
                    {designMembers.map((member) => (
                        <MemberCard 
                            key={member.user_id} 
                            member={{
                                name: member.name,
                                role: member.member_type === 'LEADER' ? 'Leader' : undefined,
                                position: member.part_label,
                                introduction: member.bio,
                                profileImage: member.profile_image_url || undefined
                            }} 
                            onClick={() => handleMemberClick(member)} 
                        />
                    ))}
                </div>
            </div>

            {/* Frontend */}
            <div className='mt-[24px]'>
                <div className='mb-[12px]'>
                    <span className={`inline-flex items-center justify-center w-[74px] h-[24px] px-[8px] py-[2px] ${getPositionStyle('frontend')} text-neutral-700 rounded-[6px] text-[14px] font-medium`}>
                        Frontend
                    </span>
                </div>
                <div className='flex gap-6'>
                    {frontendMembers.slice(0, 2).map((member) => (
                        <MemberCard 
                            key={member.user_id} 
                            member={{
                                name: member.name,
                                role: member.member_type === 'LEADER' ? 'Leader' : undefined,
                                position: member.part_label,
                                introduction: member.bio,
                                profileImage: member.profile_image_url || undefined
                            }} 
                            onClick={() => handleMemberClick(member)} 
                        />
                    ))}
                </div>
                <div className='flex gap-6 mt-[12px]'>
                    {frontendMembers.slice(2, 4).map((member) => (
                        <MemberCard 
                            key={member.user_id} 
                            member={{
                                name: member.name,
                                role: member.member_type === 'LEADER' ? 'Leader' : undefined,
                                position: member.part_label,
                                introduction: member.bio,
                                profileImage: member.profile_image_url || undefined
                            }} 
                            onClick={() => handleMemberClick(member)} 
                        />
                    ))}
                </div>
            </div>

            {/* Backend */}
            <div className='mt-[24px] mb-[64px]'>
                <div className='mb-[12px]'>
                    <span className={`inline-flex items-center justify-center w-[72px] h-[24px] px-[8px] py-[2px] ${getPositionStyle('backend')} text-neutral-700 rounded-[6px] text-[14px] font-medium`}>
                        Backend
                    </span>
                </div>
                <div className='flex gap-6'>
                    {backendMembers.slice(0, 2).map((member) => (
                        <MemberCard 
                            key={member.user_id} 
                            member={{
                                name: member.name,
                                role: member.member_type === 'LEADER' ? 'Leader' : undefined,
                                position: member.part_label,
                                introduction: member.bio,
                                profileImage: member.profile_image_url || undefined
                            }} 
                            onClick={() => handleMemberClick(member)} 
                        />
                    ))}
                </div>
                <div className='flex gap-6 mt-[12px]'>
                    {backendMembers.slice(2, 4).map((member) => (
                        <MemberCard 
                            key={member.user_id} 
                            member={{
                                name: member.name,
                                role: member.member_type === 'LEADER' ? 'Leader' : undefined,
                                position: member.part_label,
                                introduction: member.bio,
                                profileImage: member.profile_image_url || undefined
                            }} 
                            onClick={() => handleMemberClick(member)} 
                        />
                    ))}
                </div>
            </div>

            <ProjectHistory projectData={projectData} getPositionStyle={getPositionStyle} />

            {/* 모달 */}
            {selectedMember && (
                <MemberProfileModal 
                    isOpen={true}
                    onClose={() => setSelectedMember(null)}
                    member={selectedMember}
                />
            )}
        </div>
    );
};

export default TeamMembersTab;