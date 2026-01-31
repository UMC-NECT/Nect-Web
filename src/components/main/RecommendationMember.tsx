import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

import More from '@/assets/icons/common/chevron-right.svg?react';
import Bookmark from '@/assets/icons/main/bookmark.svg?react';
import BarIcon from '@/assets/icons/common/Bar.svg?react';
import { recommendationMembers } from '@/constants/RecommendationMembers';
import { useLocation } from 'react-router';

const RecommendationMember = () => {
    // 포지션 색상 매핑
    const getPositionStyle = (position: string) => {
        const positionName = position.toLowerCase();
        const styles: Record<string, string> = {
            'pm': 'bg-tag-purple',
            'design': 'bg-tag-pink',
            'frontend': 'bg-tag-green',
            'backend': 'bg-tag-blue',
            'develop': 'bg-tag-blue',
            'server': 'bg-tag-orange',
            'data': 'bg-tag-yellow',
        };

        return styles[positionName] || 'bg-tag-yellow';
    };

    const location = useLocation()
    const isProfileAnalysisPage = location.pathname === '/profile-analysis'

    return (
        <div className="w-[1233px] mx-auto mb-[50px] relative">
            {!isProfileAnalysisPage && (
                <div className="w-[1128px] mx-auto flex justify-between items-center mb-8">
                <h2 className="text-2xl text-neutral-900 font-semibold">나와 연관된 추천 팀원</h2>
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
                        nextEl: '.member-custom-next',
                        prevEl: '.member-custom-prev',
                    }}
                    pagination={{ clickable: true }}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    loop={true}
                    className="pb-12 !pt-3 recommendation-member-swiper"
                >
                    {recommendationMembers.map((member) => (
                        <SwiperSlide key={member.id}>
                            <div className="w-[360px] h-[360px] mt-2 mb-13 rounded-2xl overflow-hidden cursor-pointer bg-white border border-neutral-100 hover:border-primary-400-normal hover:shadow-lg hover:-translate-y-2 transition-all duration-300">
                                {/* 상단: 배경 + 캐릭터 영역 */}
                                <div className="relative h-[180px]">
                                    <img
                                        src={member.background}
                                        alt="background"
                                        className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                                    />
                                    <div className="absolute top-4 right-4 w-8 h-8 bg-black/30 rounded-full p-2 cursor-pointer group">
                                        <Bookmark
                                            className="w-full h-full [&>path]:stroke-white [&>path]:fill-none [&>path]:transition-all [&>path]:duration-200 group-hover:[&>path]:stroke-primary-500-normal group-hover:[&>path]:fill-primary-500-normal"
                                        />
                                    </div>
                                    <img
                                        src={member.character}
                                        alt="character"
                                        className="absolute bottom-0 left-4 w-16 h-16 translate-y-1/2 border border-neutral-100 rounded-full bg-white"
                                    />
                                </div>

                                {/* 매칭 가능 태그 */}
                                <div className="flex justify-end px-4 pt-2">
                                    <div className="flex items-center gap-1 border border-primary-200-light rounded-2xl w-fit px-3 py-1">
                                        <span className="w-[10px] h-[10px] bg-primary-500-normal rounded-full"></span>
                                        <span className="text-sm text-neutral-700 font-semibold">
                                            {member.category}
                                        </span>
                                    </div>
                                </div>
                                {/* 하단: 텍스트 정보 영역 */}
                                <div className="px-4 pt-2 flex flex-col">
                                    <div className="flex pb-2 items-center text-lg font-semibold text-neutral-900 gap-1">
                                        <span>{member.name}</span>
                                        <BarIcon className="w-[2px] h-3" />
                                        <span className="text-neutral-500 font-medium">{member.position}</span>
                                    </div>
                                    <p className="text-sm text-neutral-700 line-clamp-2 mb-3">
                                        {member.description}
                                    </p>

                                    {/* 포지션 태그 */}
                                    <div className="flex gap-2 flex-wrap">
                                        {member.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className={`px-3 py-1 text-sm text-neutral-700 rounded-lg ${getPositionStyle(tag)}`}
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
            <div className="member-custom-prev absolute left-[5px] top-[198px] z-10 w-10 h-10 flex items-center justify-center cursor-pointer transition-all hover:bg-neutral-300 hover:rounded-4xl">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            <div className="member-custom-next absolute right-[5px] top-[198px] z-10 w-10 h-10 flex items-center justify-center cursor-pointer transition-all hover:bg-neutral-300 hover:rounded-4xl">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18L15 12L9 6" stroke="#333333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>

            <style>{`
                /* 페이지네이션 스타일 */
                .recommendation-member-swiper .swiper-pagination-bullet {
                    width: 10px;
                    height: 10px;
                    background: #CCCCCC;
                    opacity: 1;
                    border-radius: 50%;
                    transition: all 0.3s;
                }
                .recommendation-member-swiper .swiper-pagination-bullet-active {
                    background: #595959;
                    width: 22px;
                    border-radius: 6px;
                }

                /* Custom 버튼 disabled 상태 */
                .member-custom-prev.swiper-button-disabled,
                .member-custom-next.swiper-button-disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
};

export default RecommendationMember;