import bar from '@/assets/icons/common/Bar.svg';
import type { Member } from '@/types/member';

interface MemberProfileHeaderProps {
    member: Member;
    actionButtons?: React.ReactNode;
}

const MemberProfileHeader = ({ member, actionButtons }: MemberProfileHeaderProps) => {
    return (
        <div className='flex items-start gap-6'>
            <div className='w-[110px] h-[110px] bg-yellow-200 rounded-full flex-shrink-0'></div>
            
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

            {actionButtons && (
                <div className='flex gap-[10px] h-[48px] items-start'>
                    {actionButtons}
                </div>
            )}
        </div>
    );
};

export default MemberProfileHeader;
