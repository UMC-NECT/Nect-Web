import bar from '@/assets/icons/common/bar.svg';

interface MemberCardProps {
    member: {
        name: string;
        role?: string;
        position: string;
        introduction: string;
        isMatching?: boolean;
        profileImage?: string;
    };
    onClick?: () => void;
}

const MemberCard = ({ member, onClick }: MemberCardProps) => {
    const isMatching = member.isMatching;
    const bgColor = member.role === 'Leader' ? 'bg-primary-50-light' : 'bg-white';

    return (
        <div 
            onClick={!isMatching ? onClick : undefined}
            className={`w-[386px] h-[112px] ${bgColor} border border-primary-200-light rounded-xl p-[16px] flex gap-3 ${!isMatching ? 'cursor-pointer' : ''}`}
        >
            <div className='w-[80px] h-[80px] bg-yellow-200 rounded-full flex-shrink-0'></div>
            
            <div className='flex-1 h-[74px]'>
                <div className='flex items-baseline mb-2'>
                    {member.role && (
                        <h4 className='text-[18px] text-primary-600-normal mr-[6px]'>{member.role}</h4>
                    )}
                    <span className={`text-[18px] ${isMatching ? 'text-neutral-300' : 'text-neutral-900'}`}>
                        {member.name}
                    </span>
                    <img src={bar} alt="Bar" className='mx-2 w-[2px] h-[12px] bg-neutral-300' />
                    <span className={`text-[18px] ${isMatching ? 'text-neutral-300' : 'text-neutral-500'}`}>
                        {member.position}
                    </span>
                </div>
                <p className={`text-[14px] ${isMatching ? 'text-neutral-300' : member.role ? 'text-neutral-600' : 'text-neutral-500'}`}>
                    {member.introduction}
                </p>
            </div>
        </div>
    );
};

export default MemberCard;