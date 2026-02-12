import bar from '@/assets/icons/common/Bar.svg';
import type { MemberDetailDto } from '@/types/api/member/detail';
import DefaultProfileImage from '@/assets/Default_Profile.svg';

interface MemberProfileHeaderProps {
    member: MemberDetailDto;
    actionButtons?: React.ReactNode;
}

const roleLabelMap: Record<string, string> = {
    PLANNER: '기획자',
    DESIGNER: '디자이너',
    DEVELOPER: '개발자',
    MARKETER: '마케터',
    OTHER: '기타',
};

const MemberProfileHeader = ({ member, actionButtons }: MemberProfileHeaderProps) => {
    const roleLabel = roleLabelMap[member.role] ?? member.role;

    return (
        <div className='flex items-start gap-6 h-[100px]'>
            <div className='w-[100px] h-[100px] rounded-full flex-shrink-0 overflow-hidden bg-neutral-200'>
                {member.profileImageUrl ? (
                    <img src={member.profileImageUrl} alt='' className='w-full h-full object-cover' />
                ) : (
                    <img src={DefaultProfileImage} alt='' className='w-full h-full object-cover' />
                )}
            </div>

            <div className='flex-1 h-[90px] pt-[5px]'>
                <div className='flex items-center gap-3 mb-1'>
                    <h2 className='text-[20px] font-bold'>{member.name}</h2>
                    <img src={bar} alt='Bar' className='w-[2px] h-[16px] bg-neutral-300' />
                    <span className='text-[20px] text-neutral-400'>{roleLabel}</span>
                </div>
                <p className='text-[14px] text-neutral-500 mb-2 h-[21px]'>{member.email}</p>
            </div>

            {actionButtons && (
                <div className='flex gap-[10px] h-[48px] items-start'>
                    {actionButtons}
                </div>
            )}
        </div>
    );
};

export default MemberProfileHeader;
