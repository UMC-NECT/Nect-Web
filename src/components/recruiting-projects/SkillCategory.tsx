interface SkillCategoryProps {
    category: string;
    tools: string[];
}

const SkillCategory = ({ category, tools }: SkillCategoryProps) => {
    return (
        <div className='flex gap-4 mb-5 items-center'>
            <span className='text-[16px] text-neutral-600 w-[60px]'>{category}</span>
            <div className='flex flex-wrap gap-[6px]'>
                {tools.map((tool, index) => (
                    <span 
                        key={index} 
                        className='px-[16px] py-[6px] text-neutral-700 border border-neutral-200 text-[16px] rounded-[100px] flex justify-center items-center'
                    >
                        {tool}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default SkillCategory;