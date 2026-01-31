import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

import More from '@/assets/icons/common/chevron-right.svg?react';
import Bookmark from '@/assets/icons/main/bookmark.svg?react';
import { recommendationProjects } from '@/constants/RecommendationProjects';
import { useLocation } from 'react-router';

const RecommendationProject = () => {
    // 태그 색상 매핑
    const getTagStyle = (tag: string) => {
        const tagName = tag.split(' ')[0].toLowerCase();
        const styles: Record<string, string> = {
            'design': 'bg-tag-pink',
            'frontend': 'bg-tag-green',
            'backend': 'bg-tag-blue',
            'server': 'bg-tag-orange',
            'data': 'bg-tag-yellow',
            'video': 'bg-tag-green',
            'music': 'bg-tag-blue',
        };

        return styles[tagName] || 'bg-tag-yellow';
    };

    const location = useLocation()
    const isProfileAnalysisPage = location.pathname === '/profile-analysis'

    return (
        <div className="w-[1233px] mx-auto mb-[50px] relative">
            {!isProfileAnalysisPage && (
                <div className="w-[1128px] mx-auto flex justify-between items-center mb-3">
                    <h2 className="text-2xl text-neutral-900 font-semibold">나와 연관된 추천 프로젝트</h2>
                    <p className="flex items-center gap-1 cursor-pointer text-neutral-500 font-semibold text-md">
                        더보기
                        <More className="w-4 h-4 color-neutral-500 mr-1" />
                    </p>
                </div>
            )}

            <div className="w-[1128px] mx-auto">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    slidesPerView={3}
                    slidesPerGroup={3}
                    spaceBetween={16}
                    navigation={{
                        nextEl: '.custom-next',
                        prevEl: '.custom-prev',
                    }}
                    pagination={{ clickable: true }}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    loop={true}
                    className="pb-12 !pt-3 recommendation-project-swiper"
                >
                    {recommendationProjects.map((project) => (
                        <SwiperSlide key={project.id}>
                            <div className="w-[360px] min-h-[320px] mt-2 mb-13 bg-white rounded-2xl cursor-pointer border border-neutral-100 hover:border-primary-400-normal hover:shadow-lg hover:-translate-y-2 transition-all duration-300">
                                {/* 이미지 영역 */}
                                <div className="relative h-[200px] w-full">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover rounded-2xl"
                                    />

                                    {/* 북마크 */}
                                    <div className="absolute top-4 right-4 w-8 h-8 bg-black/30 rounded-full p-2 cursor-pointer group">
                                        <Bookmark
                                            className="w-full h-full [&>path]:stroke-white [&>path]:fill-none [&>path]:transition-all [&>path]:duration-200 group-hover:[&>path]:stroke-primary-500-normal group-hover:[&>path]:fill-primary-500-normal"
                                        />
                                    </div>

                                    {/* 모집 중 태그 */}
                                    <div className="absolute bottom-2 right-3">
                                        <div className="flex items-center gap-1 bg-neutral-000 border border-neutral-100 rounded-2xl px-3 py-1">
                                            <span className="w-[10px] h-[10px] bg-primary-500-normal rounded-full"></span>
                                            <span className="text-sm text-neutral-700 font-semibold">
                                                {project.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {/* 정보 영역 */}
                                <div className="p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-1 flex-1">
                                            <h3 className="text-lg font-semibold text-neutral-900 truncate">{project.title}</h3>
                                            <span className="text-sm font-semibold text-neutral-700">{project.subtitle}</span>
                                            <span className="text-neutral-500 text-sm">{project.part}</span>
                                        </div>
                                        <span className="text-lg font-bold text-primary-500-normal whitespace-nowrap ml-2">{project.dDay}</span>
                                    </div>

                                    <p className="text-sm text-neutral-700 mb-3 line-clamp-2">
                                        {project.description}
                                    </p>

                                    <div className="flex gap-2 flex-wrap h-6">
                                        {project.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className={`px-2.5 text-sm text-neutral-700 rounded-lg ${getTagStyle(tag)}`}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* 화살표 버튼 */}
            <div className="custom-prev absolute left-[5px] top-[198px] z-10 w-10 h-10 flex items-center justify-center cursor-pointer transition-all hover:bg-neutral-300 hover:rounded-4xl">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            <div className="custom-next absolute right-[5px] top-[198px] z-10 w-10 h-10 flex items-center justify-center cursor-pointer transition-all hover:bg-neutral-300 hover:rounded-4xl">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18L15 12L9 6" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>

            <style>{`
                /* 페이지네이션 스타일 */
                .recommendation-project-swiper .swiper-pagination-bullet {
                    width: 10px;
                    height: 10px;
                    background: #CCCCCC;
                    opacity: 1;
                    border-radius: 50%;
                    transition: all 0.3s;
                }
                .recommendation-project-swiper .swiper-pagination-bullet-active {
                    background: #595959;
                    width: 22px;
                    border-radius: 6px;
                }

                /* Custom 버튼 disabled 상태 */
                .custom-prev.swiper-button-disabled,
                .custom-next.swiper-button-disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
};

export default RecommendationProject;