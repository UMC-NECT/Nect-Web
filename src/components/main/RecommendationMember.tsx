import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import { useRef } from 'react';

import BarIcon from '@/assets/icons/common/Bar.svg?react';
import { recommendationMembers } from '@/constants/RecommendationMembers';
import { useLocation } from 'react-router';
import { getTagStyle } from '@/utils/tagStyles';


const RecommendationMember = () => {
    const paginationRef = useRef<HTMLDivElement>(null);
    const location = useLocation()
    const isProfileAnalysisPage = location.pathname === '/profile-analysis'

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
                    className="pt-3! recommendation-member-swiper"
                >
                    {recommendationMembers.map((member) => (
                        <SwiperSlide key={member.id}>
                            <div className={`w-90 ${member.description.length > 40 ? 'h-85' : 'h-80'} bg-white rounded-xl cursor-pointer border border-neutral-100 hover:border-primary-400-normal hover:shadow-lg hover:-translate-y-2 transition-all duration-300`}>
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
                                    <div className="flex h-6.5 items-center text-lg font-semibold text-neutral-900 gap-1.5 mb-1.5">
                                        <span>{member.name}</span>
                                        <BarIcon className="w-0.5 h-3" />
                                        <span className="text-neutral-500 font-medium">{member.position}</span>
                                    </div>

                                    <p className="text-sm text-neutral-700 line-clamp-2 mb-3">
                                        {member.description}
                                    </p>

                                    {/* 포지션 태그 */}
                                    <div className="flex gap-2 flex-wrap h-6">
                                        {member.tags.map((tag, index) => (
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