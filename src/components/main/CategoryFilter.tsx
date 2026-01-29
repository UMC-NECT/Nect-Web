import { CATEGORY_FIELDS } from '@/constants/categories';
import More from '@/assets/icons/common/chevron-right.svg?react';

const CategoryFilter = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl text-neutral-900 font-bold">분야별 프로젝트와 넥터를 탐색하세요!</h2>
                <p className="flex items-center gap-1 cursor-pointer text-neutral-500 font-semibold text-md">
                    더보기
                    <More className="w-4 h-4 color-neutral-500 mr-1" />
                </p>
            </div>        
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
                        <span className="text-lg font-semibold text-neutral-900">
                            {category.name}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryFilter;