import bar from '@/assets/icons/common/Bar.svg';

interface Member {
    name: string;
    position: string;
    email: string;
    profileImage?: string;
    isRecruiting?: boolean;
}

interface MemberProfileHeaderProps {
    member: Member;
    actionButtons?: React.ReactNode;
}

const MemberProfileHeader = ({ member, actionButtons }: MemberProfileHeaderProps) => {
    return (
        <div className='flex items-start gap-6 h-[100px]'>
            <div className='w-[100px] h-[100px] bg-yellow-200 rounded-full flex-shrink-0'></div>
            
            <div className='flex-1 h-[90px] pt-[5px]'>
                <div className='flex items-center gap-3 mb-1'>
                    <h2 className='text-[20px] font-bold'>{member.name}</h2>
                    <img src={bar} alt="Bar" className='w-[2px] h-[16px] bg-neutral-300' />
                    <span className='text-[20px] text-neutral-400'>{member.position}</span>
                </div>
                <p className='text-[14px] text-neutral-500 mb-2 h-[21px]'>{member.email}</p>
                {member.isRecruiting && (
                    <span className='inline-flex items-center justify-center w-[64px] h-[28px] border border-primary-200-light bg-primary-100-light text-primary-500-normal text-[14px] font-semibold rounded-[100px]'>
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
