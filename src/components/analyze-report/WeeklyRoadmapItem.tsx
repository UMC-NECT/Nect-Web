import arrowUp from '@/assets/icons/common/chevron-up.svg'
import arrowDown from '@/assets/icons/common/chevron-down.svg'

interface WeeklyRoadmapItemProps {
    title: string
    details: string[]
    isExpanded: boolean
    onToggle: () => void
}

const WeeklyRoadmapItem = ({ title, details, isExpanded, onToggle }: WeeklyRoadmapItemProps) => {
    return (
        <>
            <button 
                onClick={onToggle}
                className={`bg-white p-4 flex items-center justify-between cursor-pointer w-[800px] h-[60px] border-l border-r border-gray-200 ${
                    isExpanded ? 'rounded-t-lg border-t' : 'rounded-lg border-t border-b'
                }`}
            >
                <span className='text-[16px] font-medium'>{title}</span>
                <img 
                    src={isExpanded ? arrowUp : arrowDown} 
                    alt="toggle" 
                    className='w-5 h-5'
                />
            </button>
            {isExpanded && (
                <div className='bg-primary-50-light border-l border-r border-b border-primary-200-light rounded-b-lg p-6'>
                    {details.map((detail, index) => (
                        <p key={index} className='text-[14px] text-gray-700 mb-2'>
                            {detail}
                        </p>
                    ))}
                </div>
            )}
        </>
    );
};

export default WeeklyRoadmapItem;