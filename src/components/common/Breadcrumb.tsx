import { Link } from "react-router";

interface BreadcrumbItem {
    label: string
    path?: string
}

interface BreadcrumbProps {
    items: BreadcrumbItem[]
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
    return (
        <nav className="text-[14px] text-neutral-400 gap-1 flex items-center">
            {items.map((item, index) => (
                <>
                    {item.path ? (
                        <Link 
                            key={`link-${index}`}
                            to={item.path}
                            className="hover:text-neutral-600 hover:font-semibold cursor-pointer transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span 
                            key={`span-${index}`}
                            className="hover:text-neutral-600 hover:font-semibold cursor-pointer transition-colors"
                        >
                            {item.label}
                        </span>
                    )}
                    {index < items.length - 1 && (
                        <span key={`separator-${index}`} className="text-neutral-400">
                            {' > '}
                        </span>
                    )}
                </>
            ))}
        </nav>
    );
};

export default Breadcrumb;