interface ProjectHistoryCardProps {
    positions: string[];
    title: string;
    description: string;
    period: string;
    imageBg?: string;
    imageUrl?: string;
    getPositionStyle: (position: string) => string;
    variant?: 'default' | 'large';
}

const ProjectHistoryCard = ({ 
    positions, 
    title, 
    description, 
    period, 
    imageBg = 'bg-neutral-400',
    imageUrl,
    getPositionStyle,
    variant = 'default'
}: ProjectHistoryCardProps) => {
    
    const sizeStyles = {
        default: {
            card: 'w-[386px] h-[342px]',
            image: 'h-[211px]'
        },
        large: {
            card: 'w-[384px] h-[342px]',
            image: 'h-[211px]'
        }
    };

    const styles = sizeStyles[variant];

    return (
        <div className={`${styles.card} cursor-pointer`}>
            <div className='flex gap-[10px] mb-[12px]'>
                {positions.map((position, index) => (
                    <span 
                        key={index}
                        className={`inline-flex items-center justify-center px-[8px] py-[2px] ${getPositionStyle(position.toLowerCase())} text-neutral-700 rounded-[6px] text-[14px] font-medium`}
                    >
                        {position}
                    </span>
                ))}
            </div>
            
            <div className='border border-neutral-200 rounded-xl overflow-hidden hover:border-primary-400-normal hover:shadow-lg hover:-translate-y-2 transition-all duration-300'>
                <div className={`w-full ${styles.image} ${imageBg} rounded-xl overflow-hidden`}>
                    {imageUrl && (
                        <img 
                            src={imageUrl} 
                            alt={title}
                            className='w-full h-full object-cover'
                        />
                    )}
                </div>
                
                <div className='pl-[20px] pr-[20px] pb-[20px]'>
                    <h4 className='font-semibold text-[18px] text-neutral-900 mt-[14px] mb-[6px]'>{title}</h4>
                    <p className='text-[14px] font-medium text-neutral-600 mb-[6px] line-clamp-2'>
                        {description}
                    </p>
                    <p className='text-[14px] text-neutral-400'>{period}</p>
                </div>
            </div>
        </div>
    );
};

export default ProjectHistoryCard;