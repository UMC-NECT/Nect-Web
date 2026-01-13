const CategoryFilter = () => {
    const categories = [
        { name: '브랜딩' },
        { name: '기획' },
        { name: 'UX/UI' },
        { name: '영상' },
        { name: '그래픽' },
        { name: '프론트' },
        { name: '스프링' },
        { name: '백엔드' },
    ];

    return (
        <div>
            <h2 className="text-[28px] font-bold mb-8">분야별 창작자를 탐색하세요!</h2>
            
            {/* 카테고리 버튼들 */}
            <div className="flex justify-between">
                {categories.map((category) => (
                    <button
                        key={category.name}
                        className="flex flex-col items-center gap-3 group"
                    >
                        {/* 임시 아이콘 */}
                        <div className="w-[95px] h-[95px] rounded-[32px] bg-neutral-200 border-neutral-300">
                        </div>
                        {/* 카테고리 이름 */}
                        <span className="text-[20px] font-medium text-neutral-900">
                            {category.name}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryFilter;