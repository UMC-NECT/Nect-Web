import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import ChevronRight from '@/assets/icons/common/chevron-right.svg?react';

// 이미지 import
import slide1 from '../../assets/icons/main/slide1.png';
import slide2 from '../../assets/icons/main/slide2.png';
import slide3 from '../../assets/icons/main/slide3.png';

const Slider = () => {
    const originalSlides = [
        { 
            id: 1, 
            image: slide1,
            alt: '슬라이드 1' 
        },
        { 
            id: 2, 
            image: slide2,
            alt: '슬라이드 2' 
        },
        { 
            id: 3, 
            image: slide3,
            alt: '슬라이드 3' 
        },
    ];

    const slides = [...originalSlides, ...originalSlides];

    return (
        <>
            <div className="w-full overflow-visible mb-16">
                <Swiper
                    modules={[Autoplay, Navigation, Pagination]}
                    spaceBetween={31}
                    slidesPerView="auto"
                    centeredSlides={true}
                    loop={true}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    navigation={false}
                    pagination={{ clickable: true }}
                    className="mySwiper !overflow-visible cursor-pointer w-282"
                >
                    {slides.map((slide, index) => (
                        <SwiperSlide key={`${slide.id}-${index}`} className="!w-282">
                            <div className="relative w-282 h-87.5 rounded-2xl overflow-hidden group">
                                <img 
                                    src={slide.image} 
                                    alt={slide.alt}
                                    className="w-full h-full object-cover"
                                />
                                
                                {/* 모집 정보 보러가기 버튼 */}
                                <div className="w-[159px] h-11 absolute bottom-[14px] right-6 flex items-center gap-1 text-neutral-50 hover:text-neutral-300 hover:stroke-neutral-300 transition-all">
                                    <span className="text-body1 font-semibold mr-1">모집 정보 보러가기</span>
                                    <ChevronRight className="w-4 h-4 stroke-neutral-50" />
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <style>{`
                    /* 활성 슬라이드 강조 효과 */
                    .mySwiper .swiper-slide {
                        opacity: 0.5;
                        transition: opacity 0.3s ease;
                    }

                    .mySwiper .swiper-slide-active {
                        opacity: 1;
                    }

                    /* 페이지네이션 위치 */
                    .mySwiper .swiper-pagination {
                        position: absolute;
                        bottom: -48px;
                        left: 0;
                        width: 100%;
                        text-align: center;
                    }

                    /* 페이지네이션 스타일 */
                    .mySwiper .swiper-pagination-bullet {
                        width: 10px;
                        height: 10px;
                        background: #CCCCCC;
                        opacity: 1;
                        border-radius: 50%;
                        transition: all 0.3s;
                    }

                    .mySwiper .swiper-pagination-bullet-active {
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
        </>
    );
};

export default Slider;