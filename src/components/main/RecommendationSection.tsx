import { useState, useRef, useEffect } from 'react';
import { CREATOR_TYPES, type CreatorType } from '@/constants/categories';

const RecommendationSection = () => {
    const [selectedCategory, setSelectedCategory] = useState<CreatorType>('디자이너');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const recommendations = [
        { id: 1, name: '추천 1' },
        { id: 2, name: '추천 2' },
        { id: 3, name: '추천 3' },
        { id: 4, name: '추천 4' },
    ];

    // 외부 클릭 감지
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    return (
        <div className="w-[1200px] mx-auto">
            <h2 className="text-[28px] font-bold mb-8 flex items-center gap-2">
                내가 찾고 있는 
                {/* 드롭다운 */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="text-primary-500-normal hover:text-primary-600-normal transition-colors flex items-center gap-1"
                    >
                        {selectedCategory}
                        <svg 
                            className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    
                    {/* 드롭다운 메뉴 */}
                    {isDropdownOpen && (
                        <div className="absolute top-full mt-2 bg-white border border-neutral-200 rounded-xl shadow-lg py-2 z-10 min-w-[140px]">
                            {CREATOR_TYPES.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => {
                                        setSelectedCategory(category);
                                        setIsDropdownOpen(false);
                                    }}
                                    className={`w-full px-4 py-2 text-left text-[16px] font-medium hover:bg-neutral-100 transition-colors ${
                                        selectedCategory === category ? 'text-primary-500-normal' : 'text-neutral-700'
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                를 만나보세요
            </h2>
            
            {/* 추천 카드들 */}
            <div className="grid grid-cols-4 gap-3">
                {recommendations.map((item) => (
                    <div 
                        key={item.id}
                        className="rounded-xl"
                    >
                        {/* 프로필 이미지 영역 (더미) */}
                        <div className="w-[285px] h-[280px] bg-neutral-300 rounded-lg mb-4"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecommendationSection;