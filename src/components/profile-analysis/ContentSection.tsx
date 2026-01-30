interface ContentSectionProps {
    title: string
    children: React.ReactNode
}

const ContentSection = ({ title, children }: ContentSectionProps) => {
    return (
        <div className='flex flex-col w-full justify-center mt-12'>
            <span className='heading-3 font-bold text-primary-600-normal'>{title}</span>
            {children}
        </div>
    )
}

export default ContentSection