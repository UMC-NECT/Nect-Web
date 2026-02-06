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
    };
}

const RecommendationProjectCard = ({ project }: RecommendationProjectCardProps) => {
    return (
        <div className={`w-90 h-[340px] pb-4 flex flex-col bg-white rounded-xl cursor-pointer border border-neutral-100 hover:border-primary-400-normal hover:shadow-lg hover:-translate-y-2 transition-all duration-300`}>
            {/* 이미지 영역 */}
            <div className="relative w-90 h-50 rounded-xl">
                <img
                    src={project.image}
                    alt={project.title}
                />

                {/* 모집 중 태그 */}
                <div className="absolute bottom-[7px] right-3">
                    <RecruitmentStatusChip
                        status={project.status as '모집 전' | '모집 중' | '모집 완료'}
                    />
                </div>
            </div>

            {/* 정보 영역 */}
            <div className="flex flex-col flex-1 mx-5 mt-3.5 min-h-0">
                <div className="flex justify-between items-center mt-3 mb-1.5">
                    <div className="flex items-center gap-1.5 flex-1">
                        <h3 className="title-3 font-semibold text-neutral-900 truncate">{project.title}</h3>
                        <div className='flex items-center justify-between gap-[3px] mt-0.75'>
                            <span className="button-1 font-semibold text-neutral-700">{project.subtitle}</span>
                            <span className="button-1 text-neutral-500">{project.part}</span>
                        </div>
                    </div>
                    <span className="title-3 font-semibold text-primary-500-normal whitespace-nowrap">{project.dDay}</span>
                </div>

                <p className="body-2 font-medium text-neutral-600 line-clamp-2">
                    {project.description}
                </p>

                <div className="flex gap-2 flex-wrap mt-auto">
                    {project.tags.map((tag, index) => (
                        <span
                            key={index}
                            className={`h-[22px] px-2 py-0.5 text-sm text-neutral-700 rounded-md ${getTagStyle(tag)}`}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default RecommendationProjectCard;
