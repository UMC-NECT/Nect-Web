import { newsItems } from '@/constants/newsItem';

const NewsSection = () => {
    return (
        <div className="w-308.25 mx-auto relative">
            <h2 className="text-[32px] font-bold text-center pb-16.5">
                넥트에서 협업의 전 과정을<br />
                A부터 Z까지
            </h2>
            
            <div className="w-[1128px] relative mx-auto">
                <div className="flex gap-6">
                    {newsItems.slice(0, 3).map((item, index) => (
                        <div 
                            key={index}
                            className="w-90 h-80.5 border-2 rounded-xl p-10"
                            style={{
                                backgroundColor: item.bgColor,
                                borderColor: item.borderColor
                            }}
                        >
                            <div className='h-[91px] gap-[3px]'>
                                <h3 className={`text-[24px] font-bold ${
                                    item.isActive ? 'text-primary-600-normal' : 'text-neutral-900'
                                }`}>
                                    {item.title}
                                </h3>
                                
                                <p className="h-[50px] text-[18px] text-neutral-600 whitespace-pre-line">
                                    {item.description}
                                </p>
                            </div>

                            <div className="w-35 h-35 ml-auto mt-3 pb-6 overflow-hidden">
                                <img 
                                    src={item.image} 
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NewsSection;