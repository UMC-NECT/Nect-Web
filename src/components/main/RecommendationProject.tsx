import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import { useRef } from 'react';

import { recommendationProjects } from '@/constants/RecommendationProjects';
import { useLocation } from 'react-router';
import { getTagStyle } from '@/utils/tagStyles';

const RecommendationProject = () => {
    const paginationRef = useRef<HTMLDivElement>(null);

    const location = useLocation()
    const isProfileAnalysisPage = location.pathname === '/profile-analysis'

    return (
        <div className="w-308.25 h-111.75 mx-auto mb-12.5 relative -ml-11.5">
            {!isProfileAnalysisPage && (
                <div className="w-282 mx-auto mb-4">
                    <h2 className="text-[22px] text-neutral-900 font-semibold">나와 연관된 추천 프로젝트</h2>
                </div>
            )}

            <div className="w-282 mx-auto">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    slidesPerView={3}
                    slidesPerGroup={3}
                    spaceBetween={16}
                    navigation={{
                        nextEl: '.custom-next',
                        prevEl: '.custom-prev',
                    }}
                    pagination={{ 
                        clickable: true,
                    }}
                    onSwiper={(swiper) => {
                        setTimeout(() => {
                            if (paginationRef.current && swiper.params.pagination && typeof swiper.params.pagination === 'object') {
                                swiper.params.pagination.el = paginationRef.current;
                                swiper.pagination?.init();
                                swiper.pagination?.render();
                                swiper.pagination?.update();
                            }
                        }, 0);
                    }}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    loop={true}
                    className="!pt-3 recommendation-project-swiper"
                >
                    {recommendationProjects.map((project) => (
                        <SwiperSlide key={project.id}>
                            <div className={`w-90 ${project.description.length > 40 ? 'h-85' : 'h-80'} bg-white rounded-xl cursor-pointer border border-neutral-100 hover:border-primary-400-normal hover:shadow-lg hover:-translate-y-2 transition-all duration-300`}>
                                {/* 이미지 영역 */}
                                <div className="relative w-90 h-50 rounded-xl">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                    />

                                    {/* 모집 중 태그 */}
                                    <div className="absolute bottom-2 right-3">
                                        <div className="flex items-center justify-center gap-1 bg-neutral-000 border border-neutral-100 rounded-2xl w-18.5 h-6.5">
                                            <span className="w-2.5 h-2.5 bg-primary-500-normal rounded-full"></span>
                                            <span className="text-[14px] text-neutral-700 font-semibold">
                                                {project.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* 정보 영역 */}
                                <div className="gap-3 mx-5 mt-3.5">
                                    <div className="flex justify-between items-center mt-3 mb-2">
                                        <div className="flex items-center gap-1.5 flex-1 h-6.5">
                                            <h3 className="text-lg font-semibold text-neutral-900 truncate">{project.title}</h3>
                                            <div className='flex items-center justify-between gap-5 mt-0.75'>
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
                        </SwiperSlide>
                    ))}
                </Swiper>
                {/* 페이지네이션을 Swiper 밖으로 */}
                <div ref={paginationRef} className="custom-pagination mt-6 flex justify-center"></div>
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
                .custom-pagination {
                    display: flex;
                    gap: 8px;
                    height: auto;
                }

                .custom-pagination .swiper-pagination-bullet {
                    width: 10px !important;
                    height: 10px !important;
                    background: #CCCCCC !important;
                    opacity: 1 !important;
                    border-radius: 50% !important;
                    transition: all 0.3s !important;
                    margin: 0 !important;
                }

                .custom-pagination .swiper-pagination-bullet-active {
                    background: #595959 !important;
                    width: 22px !important;
                    border-radius: 6px !important;
                }

                .custom-prev.swiper-button-disabled,
                .custom-next.swiper-button-disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                    pointer-events: none;
                }

                .recommendation-project-swiper > .swiper-pagination {
                    display: none !important;
                }
            `}</style>
        </div>
    );
};

export default RecommendationProject;