import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import RecommendationMemberCard from '@/components/common/RecommendationMemberCard';
import { useRecommendationMembers } from '@/hooks/queries/home';

const RecommendationMember = () => {
    const paginationRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const navigate = useNavigate();
    const isProfileAnalysisPage = location.pathname === '/profile-analysis';

    const { data: members, isLoading, isError } = useRecommendationMembers(15);

    // 로딩 상태
    if (isLoading) {
        return (
            <div className="w-308.25 h-111.75 mx-auto mb-11.25 relative -ml-11.5">
                {!isProfileAnalysisPage && (
                    <div className="w-282 mx-auto mb-4">
                        <h2 className="text-[22px] text-neutral-900 font-semibold">나와 연관된 추천 팀원</h2>
                    </div>
                )}
                <div className="flex items-center justify-center h-80 text-neutral-500">
                    로딩 중...
                </div>
            </div>
        );
    }

    // 에러 상태
    if (isError) {
        return (
            <div className="w-308.25 h-111.75 mx-auto mb-11.25 relative -ml-11.5">
                {!isProfileAnalysisPage && (
                    <div className="w-282 mx-auto mb-4">
                        <h2 className="text-[22px] text-neutral-900 font-semibold">나와 연관된 추천 팀원</h2>
                    </div>
                )}
                <div className="flex items-center justify-center h-80 text-neutral-500">
                    팀원을 불러오는데 실패했습니다.
                </div>
            </div>
        );
    }

    // 빈 데이터 상태
    if (!members || members.length === 0) {
        return (
            <div className="w-308.25 h-111.75 mx-auto mb-11.25 relative -ml-11.5">
                {!isProfileAnalysisPage && (
                    <div className="w-282 mx-auto mb-4">
                        <h2 className="text-[22px] text-neutral-900 font-semibold">나와 연관된 추천 팀원</h2>
                    </div>
                )}
                <div className="flex items-center justify-center h-80 text-neutral-500">
                    추천 팀원이 없습니다.
                </div>
            </div>
        );
    }

    // 카드 클릭 핸들러
    const handleCardClick = (userId: number) => {
        navigate(`/matching-available/${userId}`);
    };

    return (
        <div className="w-308.25 h-111.75 mx-auto mb-11.25 relative">
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
                            try {
                                if (paginationRef.current && swiper.params.pagination && typeof swiper.params.pagination === 'object' && swiper.pagination) {
                                    swiper.params.pagination.el = paginationRef.current;
                                    swiper.pagination.init();
                                    swiper.pagination.render();
                                    swiper.pagination.update();
                                }
                            } catch {
                                // 페이지네이션 초기화 실패 시 무시
                            }
                        }, 0);
                    }}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    loop={members.length > 3}
                    className="!pt-3 recommendation-member-swiper"
                >
                    {members.map((member) => (
                        <SwiperSlide key={member.userId}>
                            <div onClick={() => handleCardClick(member.userId)}>
                                <RecommendationMemberCard member={member} showRoles={false} />
                            </div>
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
                .recommendation-member-swiper ~ .custom-pagination {
                    display: flex;
                    gap: 8px;
                    height: auto;
                }

                .recommendation-member-swiper ~ .custom-pagination .swiper-pagination-bullet {
                    width: 10px;
                    height: 10px;
                    background: #CCCCCC;
                    opacity: 1;
                    border-radius: 50%;
                    transition: all 0.3s;
                    margin: 0;
                }

                .recommendation-member-swiper ~ .custom-pagination .swiper-pagination-bullet-active {
                    background: #595959;
                    width: 22px;
                    border-radius: 6px;
                }

                .recommendation-member-swiper .member-custom-prev.swiper-button-disabled,
                .recommendation-member-swiper .member-custom-next.swiper-button-disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                    pointer-events: none;
                }

                .recommendation-member-swiper > .swiper-pagination {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default RecommendationMember;