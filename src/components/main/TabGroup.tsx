import Tab from './Tab';

interface TabGroupProps {
    tabs: string[];
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const TabGroup = ({ tabs, activeTab, onTabChange }: TabGroupProps) => {
    return (
        <div className="flex gap-[2px]">
            {tabs.map(tab => (
                <Tab 
                    key={tab}
                    label={tab} 
                    active={activeTab === tab}
                    onClick={() => onTabChange(tab)}
                />
            ))}
        </div>
    );
};

export default TabGroup;