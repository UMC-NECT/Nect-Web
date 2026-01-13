import { useState } from 'react';

const NewsSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    
    const newsItems = [
        {
            id: 1,
            title: '메칭의 전과정을 함께!',
            description: '관심사 목표 기반의 프로필 설정을 통해 매칭을 분석해줘요!'
        },
        {
            id: 2,
            title: '프로젝트 초심자를 위한 가이드!',
            description: '아이디어 분석을 통해 프로젝트를 보다 쉽게 시작할 수 있어요'
        },
        {
            id: 3,
            title: '추가 소식 3',
            description: '세 번째 소식 내용입니다'
        },
        {
            id: 4,
            title: '추가 소식 4',
            description: '네 번째 소식 내용입니다'
        },
    ];

    const handlePrev = () => {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => Math.min(newsItems.length - 2, prev + 1));
    };

    return (
        <div className="w-[1200px] mx-auto">
            <h2 className="text-[28px] font-bold mb-2 text-center">
                넥트에서 협업의 전 과정을
            </h2>
            <p className="text-[28px] font-bold text-center mb-12">
                A부터 Z까지
            </p>
            
            {/* 카로셀 컨테이너 */}
            <div className="relative flex items-center justify-center gap-6">
                {/* 왼쪽 화살표 */}
                <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="w-12 h-12 flex-shrink-0 flex items-center justify-center hover:bg-neutral-100 rounded-full transition-colors disabled:opacity-30"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* 카드들 */}
                <div className="overflow-hidden" style={{ width: '930px' }}> {/* 453 * 2 + 24 = 930px */}
                    <div 
                        className="flex gap-6 transition-transform duration-300"
                        style={{
                            transform: `translateX(-${currentIndex * 477}px)` // 453 + 24 = 477px
                        }}
                    >
                        {newsItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex-shrink-0 w-[453px] bg-neutral-200 rounded-2xl p-8"
                            >
                                {/* 이미지 영역 (더미) */}
                                <div className="w-[129.5px] h-[92.5px] bg-neutral-400 mb-6"></div>
                                
                                {/* 제목 */}
                                <h3 className="text-[20px] font-bold mb-3">{item.title}</h3>
                                
                                {/* 설명 */}
                                <p className="text-[20px] font-semibold leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 오른쪽 화살표 */}
                <button
                    onClick={handleNext}
                    disabled={currentIndex >= newsItems.length - 2}
                    className="w-12 h-12 flex-shrink-0 flex items-center justify-center hover:bg-neutral-100 rounded-full transition-colors disabled:opacity-30"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default NewsSection;