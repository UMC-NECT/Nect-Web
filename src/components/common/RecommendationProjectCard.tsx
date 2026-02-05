import { getTagStyle } from '@/utils/tagStyles';
import RecruitmentStatusChip from '@/components/common/RecruitmentStatusChip';

interface RecommendationProjectCardProps {
    project: {
        id: number;
        image: string;
        status: string;
        title: string;
        subtitle: string;
        part: string;
        dDay: string;
        description: string;
        tags: string[];
        members?: string;
    };
    variant?: 'default' | 'list';
}

const RecommendationProjectCard = ({ project, variant = 'default' }: RecommendationProjectCardProps) => {
    // 변형에 따른 스타일 설정
    const sizeStyles = {
        default: {
            card: 'w-90',
            image: 'w-90 h-50',
            height: project.description.length > 40 ? 'h-85' : 'h-80',
            infoArea: '',
            infoMargin: 'mt-3.5',
            chipPosition: 'bottom-[7px]'
        },
        list: {
            card: 'w-[413px]',
            image: 'w-[413px] h-[230px]',
            height: 'h-[370px]',
            infoArea: 'h-[110px]',
            infoMargin: 'mt-[14px]',
            chipPosition: 'bottom-[22px]'
        }
    };

    const styles = sizeStyles[variant];
    const visibleTags = project.tags.slice(0, 3);
    const remainingCount = project.tags.length - 3;

    return (
        <div className={`${styles.card} ${styles.height} bg-white rounded-xl cursor-pointer border border-neutral-100 hover:border-primary-400-normal hover:shadow-lg hover:-translate-y-2 transition-all duration-300`}>
            {/* 이미지 영역 */}
            <div className={`relative ${styles.image} rounded-xl overflow-hidden`}>
                <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                />

                {/* 모집 중 태그 */}
                <div className={`absolute ${styles.chipPosition} right-3`}>
                    <RecruitmentStatusChip
                        status={project.status as '모집 전' | '모집 중' | '모집 완료'} 
                    />
                </div>
            </div>

            {/* 정보 영역 */}
            <div className={`gap-3 mx-5 ${styles.infoMargin} ${styles.infoArea}`}>
                <div className="flex justify-between items-center mt-3 mb-2">
                    <div className="flex items-center gap-1.5 flex-1 h-6.5">
                        <h3 className="text-lg font-semibold text-neutral-900 truncate">{project.title}</h3>
                        <div className='flex items-center justify-between gap-[3px] mt-0.75'>
                            <span className="text-sm font-semibold text-neutral-700">{project.subtitle}</span>
                            <span className="text-neutral-500 font-medium text-sm">{project.part}</span>
                        </div>
                    </div>
                    <span className="text-lg font-semibold text-primary-500-normal whitespace-nowrap">{project.dDay}</span>
                </div>

                <p className="text-sm text-neutral-600 font-medium mb-3 line-clamp-2">
                    {project.description}
                </p>

                <div className="flex gap-2 flex-wrap h-6 items-center justify-between">
                    <div className="flex gap-2">
                        {visibleTags.map((tag, index) => (
                            <span
                                key={index}
                                className={`px-2 py-0.5 text-sm text-neutral-700 rounded-md ${getTagStyle(tag)}`}
                            >
                                {tag}
                            </span>
                        ))}
                        {remainingCount > 0 && (
                            <span className="px-2 py-0.5 text-sm text-neutral-700 rounded-md bg-neutral-100">
                                ...
                            </span>
                        )}
                    </div>
                    {project.members && (
                        <span className="text-[16px] font-medium text-neutral-500 whitespace-nowrap">
                            팀원 <span className="text-neutral-700">{project.members}</span>
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecommendationProjectCard;