interface TabProps {
    label: string;
    active?: boolean;
    onClick?: () => void;
}

const Tab = ({ label, active = false, onClick }: TabProps) => (
    <button 
        onClick={onClick}
        className={`w-[80px] h-[50px] font-semibold text-[16px] border-b-2 transition-colors flex items-center justify-center ${
            active 
                ? 'text-primary-500-normal border-primary-500' 
                : 'text-neutral-400 border-neutral-300'
        }`}
    >
        {label}
    </button>
);

export default Tab;