import BarIcon from '@/assets/icons/common/Bar.svg?react';

interface RecommendationMemberCardProps {
    member: {
        id: number;
        background: string;
        character: string;
        category: string;
        name: string;
        position: string;
        description: string;
    };
}

const RecommendationMemberCard = ({ member }: RecommendationMemberCardProps) => {
    return (
        <div className={`w-90 h-[300px] pb-4 bg-white rounded-xl cursor-pointer border border-neutral-100 hover:border-primary-400-normal hover:shadow-lg hover:-translate-y-2 transition-all duration-300`}>
            {/* 상단: 배경 + 캐릭터 영역 */}
            <div className="relative h-45">
                <img
                    src={member.background}
                    alt="background"
                    className="absolute inset-0 w-full h-full object-cover rounded-t-xl"
                />
                <img
                    src={member.character}
                    alt="character"
                    className="absolute bottom-0 left-4 w-16 h-16 translate-y-1/2 border border-neutral-100 rounded-full bg-white"
                />
            </div>

            {/* 매칭 가능 태그 */}
            <div className="flex justify-end px-4 pt-2">
                <div className="flex items-center justify-center gap-1 border border-primary-200-light rounded-2xl w-21.5 h-6.5">
                    <span className="w-2.5 h-2.5 bg-primary-500-normal rounded-full"></span>
                    <span className="text-[14px] text-neutral-700 font-semibold">
                        {member.category}
                    </span>
                </div>
            </div>

            {/* 하단: 텍스트 정보 영역 */}
            <div className="flex flex-col px-5">
                <div className="flex items-center gap-1.5 mb-1.5">
                    <span className='title-3 font-semibold text-neutral-900'>{member.name}</span>
                    <BarIcon className="w-0.5 h-3" />
                    <span className="title-3 text-neutral-500 font-medium">{member.position}</span>
                </div>

                <p className="body-2 font-medium text-neutral-600 line-clamp-2 mb-3">
                    {member.description}
                </p>
            </div>
        </div>
    );
};

export default RecommendationMemberCard;