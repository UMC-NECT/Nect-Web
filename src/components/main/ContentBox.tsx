interface ContentBoxProps {
    children: React.ReactNode;
    className?: string;
}

const ContentBox = ({ children, className = '' }: ContentBoxProps) => {
    return (
        <div className={`bg-white border border-neutral-200 rounded-xl p-[46px] ${className}`}>
            {children}
        </div>
    );
};

export default ContentBox;