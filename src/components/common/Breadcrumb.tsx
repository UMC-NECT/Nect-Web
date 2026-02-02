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
        <nav className="text-[14px] text-neutral-400">
            {items.map((item, index) => (
                <span key={index}>
                    {item.path ? (
                        <Link 
                            to={item.path}
                            className="hover:text-neutral-600 hover:underline cursor-pointer transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span>{item.label}</span>
                    )}
                    {index < items.length - 1 && ' > '}
                </span>
            ))}
        </nav>
    );
};

export default Breadcrumb;