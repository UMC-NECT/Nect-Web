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
<<<<<<< HEAD
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
            infoMargin: 'mt-3.5'
        },
        list: {
            card: 'w-[413px]',
            image: 'w-[413px] h-[230px]',
            height: 'h-[370px]',
            infoArea: 'h-[110px]',
            infoMargin: 'mt-[14px]'
        }
    };

    const styles = sizeStyles[variant];

    return (
        <div className={`${styles.card} ${styles.height} bg-white rounded-xl cursor-pointer border border-neutral-100 hover:border-primary-400-normal hover:shadow-lg hover:-translate-y-2 transition-all duration-300`}>
            {/* 이미지 영역 */}
            <div className={`relative ${styles.image} rounded-xl overflow-hidden`}>
                <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
=======
}

const RecommendationProjectCard = ({ project }: RecommendationProjectCardProps) => {
    return (
        <div className={`w-90 ${project.description.length > 40 ? 'h-85' : 'h-80'} bg-white rounded-xl cursor-pointer border border-neutral-100 hover:border-primary-400-normal hover:shadow-lg hover:-translate-y-2 transition-all duration-300`}>
            {/* 이미지 영역 */}
            <div className="relative w-90 h-50 rounded-xl">
                <img
                    src={project.image}
                    alt={project.title}
>>>>>>> 68c2c1e584e1754f63e52ca973f54ff3fff9197a
                />

                {/* 모집 중 태그 */}
                <div className="absolute bottom-[7px] right-3">
                    <RecruitmentStatusChip
                        status={project.status as '모집 전' | '모집 중' | '모집 완료'} 
                    />
                </div>
            </div>

            {/* 정보 영역 */}
<<<<<<< HEAD
            <div className={`gap-3 mx-5 ${styles.infoMargin} ${styles.infoArea}`}>
                <div className="flex justify-between items-center mt-3 mb-2">
                    <div className="flex items-center gap-1.5 flex-1 h-6.5">
                        <h3 className="text-lg font-semibold text-neutral-900 truncate">{project.title}</h3>
                        <div className='flex items-center justify-between gap-[3px] mt-0.75'>
=======
            <div className="gap-3 mx-5 mt-3.5">
                <div className="flex justify-between items-center mt-3 mb-2">
                    <div className="flex items-center gap-1.5 flex-1 h-6.5">
                        <h3 className="text-lg font-semibold text-neutral-900 truncate">{project.title}</h3>
                        <div className='flex items-center justify-between gap-5 mt-0.75'>
>>>>>>> 68c2c1e584e1754f63e52ca973f54ff3fff9197a
                            <span className="text-sm font-semibold text-neutral-700">{project.subtitle}</span>
                            <span className="text-neutral-500 text-sm">{project.part}</span>
                        </div>
                    </div>
                    <span className="text-lg font-semibold text-primary-500-normal whitespace-nowrap">{project.dDay}</span>
                </div>

                <p className="text-sm text-neutral-700 mb-3 line-clamp-2">
                    {project.description}
                </p>

                <div className="flex gap-2 flex-wrap h-6">
                    {project.tags.map((tag, index) => (
                        <span
                            key={index}
                            className={`px-2 py-0.5 text-sm text-neutral-700 rounded-md ${getTagStyle(tag)}`}
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