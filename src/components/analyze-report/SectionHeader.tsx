interface SectionHeaderProps {
    number: string
    title: string
    className?: string
}

const SectionHeader = ({ number, title, className = '' }: SectionHeaderProps) => {
    return (
        <div className={`flex gap-6 ${className}`}>
            <h2 className='font-bold text-[28px] flex-shrink-0'>{number}</h2>
            <div className='flex-1'>
                <p className='font-bold text-[24px] text-primary-600-normal mb-8 mt-1'>
                    {title}
                </p>
            </div>
        </div>
    );
};

export default SectionHeader;