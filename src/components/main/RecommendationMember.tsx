import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import { useRef } from 'react';

import { recommendationMembers } from '@/constants/RecommendationMembers';
import { useLocation } from 'react-router';
import RecommendationMemberCard from '@/components/common/RecommendationMemberCard';

const RecommendationMember = () => {
    const paginationRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const isProfileAnalysisPage = location.pathname === '/profile-analysis';

    return (
        <div className="w-308.25 h-111.75 mx-auto mb-11.25 relative -ml-11.5">
            {!isProfileAnalysisPage && (
                <div className="w-282 mx-auto mb-4">
                    <h2 className="text-[22px] text-neutral-900 font-semibold">나와 연관된 추천 팀원</h2>
                </div>
            )}

            <div className="w-282 mx-auto">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    slidesPerView={3}
                    slidesPerGroup={3}
                    spaceBetween={16}
                    navigation={{
                        nextEl: '.member-custom-next',
                        prevEl: '.member-custom-prev',
                    }}
                    pagination={{ 
                        clickable: true,
                    }}
                    onSwiper={(swiper) => {
                        setTimeout(() => {
                            if (paginationRef.current && swiper.params?.pagination && typeof swiper.params.pagination === 'object') {
                                swiper.params.pagination.el = paginationRef.current;
                                if (swiper.pagination) {
                                    swiper.pagination.init();
                                    swiper.pagination.render();
                                    swiper.pagination.update();
                                }
                            }
                        }, 0);
                    }}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    loop={true}
                    className="!pt-3 recommendation-member-swiper"
                >
                    {recommendationMembers.map((member) => (
                        <SwiperSlide key={member.id}>
                            <RecommendationMemberCard member={member} />
                        </SwiperSlide>
                    ))}
                </Swiper>
                {/* 페이지네이션 */}
                <div ref={paginationRef} className="custom-pagination mt-6 flex justify-center"></div>
            </div>

            {/* 화살표 버튼 */}
            <div className="member-custom-prev absolute left-1.25 top-49.5 z-10 w-10 h-10 flex items-center justify-center cursor-pointer transition-all hover:bg-neutral-300 hover:rounded-4xl">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            <div className="member-custom-next absolute right-1.25 top-49.5 z-10 w-10 h-10 flex items-center justify-center cursor-pointer transition-all hover:bg-neutral-300 hover:rounded-4xl">
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

                .member-custom-prev.swiper-button-disabled,
                .member-custom-next.swiper-button-disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                    pointer-events: none;
                }

                .recommendation-member-swiper > .swiper-pagination {
                    display: none !important;
                }
            `}</style>
        </div>
    );
};

export default RecommendationMember;