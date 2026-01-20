import { CATEGORY_FIELDS } from '@/constants/categories';

const CategoryFilter = () => {
    return (
        <div>
            <h2 className="text-[28px] font-bold mb-8">분야별 창작자를 탐색하세요!</h2>
            
            {/* 카테고리 버튼들 */}
            <div className="flex justify-between">
                {CATEGORY_FIELDS.map((category) => (
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