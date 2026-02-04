import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { useRef, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/swiper-bundle.css'; 

import { newsItems } from '@/constants/newsItem';

const NewsSection = () => {
    const swiperRef = useRef<SwiperType | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const repeatedNewsItems = Array(5).fill(newsItems).flat().map((item, index) => ({
        ...item,
        id: index + 1
    }));

    const handlePaginationClick = (index: number) => {
        if (swiperRef.current) {
            swiperRef.current.slideToLoop(index * 3);
        }
    };

    return (
        <div className="w-308.25 h-184 mx-auto mb-12.5 relative">
            <h2 className="text-[32px] font-bold text-center mb-16.5">
                넥트에서 협업의 전 과정을<br />
                A부터 Z까지
            </h2>
            
            <div className="w-[1128px] relative mx-auto">
                <Swiper
                    modules={[Navigation, Pagination]}
                    slidesPerView={3}
                    slidesPerGroup={3}
                    spaceBetween={24}
                    navigation={{
                        nextEl: '.news-custom-next',
                        prevEl: '.news-custom-prev',
                    }}
                    pagination={false}
                    loop={true}
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    onSlideChange={(swiper) => {
                        const realIndex = swiper.realIndex;
                        setActiveIndex(Math.floor(realIndex / 3));
                    }}
                    className="news-section-swiper"
                >
                    {repeatedNewsItems.map((item, index) => (
                        <SwiperSlide key={`news-${index}`}>
                            <div 
                                className="w-90 h-80.5 border-2 rounded-xl p-10"
                                style={{
                                    backgroundColor: item.bgColor,
                                    borderColor: item.borderColor
                                }}
                            >
                                <div className='h-[91px] gap-[3px]'>
                                    <h3 className={`text-[24px] font-bold ${
                                        item.isActive ? 'text-primary-600-normal' : 'text-neutral-900'
                                    }`}>
                                        {item.title}
                                    </h3>
                                    
                                    <p className="h-[50px] text-[18px] text-neutral-600 whitespace-pre-line">
                                        {item.description}
                                </p>
                                </div>

                                <div className="w-35 h-35 ml-auto mt-3 mb-6 overflow-hidden">
                                    <img 
                                        src={item.image} 
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* 화살표 버튼 */}
                <div className="news-custom-prev absolute left-[-50px] top-[138px] z-10 w-12 h-12 flex items-center justify-center cursor-pointer transition-all hover:bg-neutral-100 hover:rounded-full text-neutral-700">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </div>          
                <div className="news-custom-next absolute right-[-50px] top-[138px] z-10 w-12 h-12 flex items-center justify-center cursor-pointer transition-all hover:bg-neutral-100 hover:rounded-full text-neutral-700">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>

            {/* 수동 페이지네이션 */}
            <div className="news-manual-pagination flex justify-center gap-2 mt-12">
                {[0, 1, 2, 3, 4].map((idx) => (
                    <div
                        key={idx}
                        className={`pagination-dot transition-all cursor-pointer ${idx === activeIndex ? 'active' : ''}`}
                        onClick={() => handlePaginationClick(idx)}
                    />
                ))}
            </div>

            <style>{`
                .news-section-swiper {
                    overflow: hidden !important;
                }

                .pagination-dot {
                    width: 10px;
                    height: 10px;
                    background: #CCCCCC;
                    border-radius: 50%;
                    transition: all 0.3s;
                }

                .pagination-dot.active {
                    background: #595959;
                    width: 22px;
                    border-radius: 6px;
                }

                /* Custom 버튼 disabled 상태 */
                .news-custom-prev.swiper-button-disabled,
                .news-custom-next.swiper-button-disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
};

export default NewsSection;