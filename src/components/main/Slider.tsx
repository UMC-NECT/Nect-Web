import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

// 이미지 import
import slide1 from '../../assets/icons/main/slide1.svg';
import slide2 from '../../assets/icons/main/slide2.svg';
import slide3 from '../../assets/icons/main/slide3.svg';

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
                    <SwiperSlide key={`${slide.id}-${index}`} className="!w-[1128px]">
                        <div className="relative w-[1128px] h-[350px] rounded-2xl overflow-hidden">
                            <img 
                                src={slide.image} 
                                alt={slide.alt}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Slider;