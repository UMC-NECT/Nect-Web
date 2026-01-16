import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

const Slider = () => {
    // 원본 데이터
    const originalSlides = [
        { id: 1, color: 'bg-neutral-300' },
        { id: 2, color: 'bg-neutral-400' },
        { id: 3, color: 'bg-neutral-500' },
    ];

    // 슬라이드 복제 (무한 루프를 위해)
    const slides = [...originalSlides, ...originalSlides];

    return (
        <div className="w-full overflow-visible mb-16">
            <Swiper
                modules={[Autoplay, Navigation]}
                spaceBetween={31}
                slidesPerView="auto"
                centeredSlides={true}
                loop={true}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                navigation={false}
                className="!overflow-visible"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={`${slide.id}-${index}`} className="!w-[1200px]">
                        <div className={`w-[1200px] h-[373px] ${slide.color} rounded-2xl flex items-center justify-center`}>
                            <span className="text-white text-2xl font-bold">
                                Slide {slide.id}
                            </span>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Slider;