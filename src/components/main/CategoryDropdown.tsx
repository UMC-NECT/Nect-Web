import { useState } from 'react';
import Down from '@/assets/icons/common/chevron-down.svg';
import Up from '@/assets/icons/common/chevron-up.svg';

interface CategoryDropdownProps {
    categories: string[];
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
}

const CategoryDropdown = ({ 
    categories, 
    selectedCategory, 
    onCategoryChange 
}: CategoryDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="w-[240px] relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-[6px] text-[20px] font-bold text-neutral-900"
            >
                {selectedCategory}
                <img 
                    src={isOpen ? Up : Down} 
                    alt="toggle" 
                    className="w-5 h-5"
                />
            </button>

            {isOpen && (
                <ul className="absolute z-10 shadow-drop-neutral-1 bg-neutral-000 rounded-[10px] mt-[10px] w-[177px] py-2">
                    {categories.map(category => (
                        <li 
                            key={category}
                            onClick={() => {
                                onCategoryChange(category);
                                setIsOpen(false);
                            }}
                            className={`cursor-pointer text-[16px] font-medium h-10 items-center flex pl-5 ${
                                selectedCategory === category 
                                    ? 'text-primary-500' 
                                    : 'text-neutral-700 hover:text-primary-600-normal hover:bg-neutral-100'
                            }`}
                        >
                            {category}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CategoryDropdown;