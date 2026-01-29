import BgPattern from '@/assets/icons/main/bg.svg';
import portfolio from '@/assets/icons/main/nugu.svg';

const ProjectShowcase = () => {
    const projects = [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
    ];

    return (
        <div className="w-full h-[1064px] -mx-4 relative py-16 overflow-hidden">
            {/* SVG 배경 */}
            <div 
                className="absolute inset-0 bg-neutral-900"
                style={{
                    backgroundImage: `url(${BgPattern})`,
                }}
            />
            
            <div className="relative mt-12">
                <h2 className="text-[32px] font-bold mb-12 text-center text-white">
                    완주한 프로젝트의<br />
                    프로젝트를 넥트에서 확인해보세요 !
                </h2>
                
                {/* 첫 번째 줄 - 왼쪽으로 흐름 */}
                <div className="flex gap-[43px] mb-[63px] overflow-hidden">
                    <div className="flex gap-[43px] animate-scroll-left">
                        {[...projects.slice(0, 3), ...projects.slice(0, 3)].map((project, index) => (
                            <div 
                                key={`first-${index}`}
                                className="w-[414px] h-[230px] rounded-xl cursor-pointer flex-shrink-0"
                                style={{
                                    backgroundImage: `url(${portfolio})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            />
                        ))}
                    </div>
                </div>
                
                {/* 두 번째 줄 - 오른쪽으로 흐름 */}
                <div className="flex gap-[43px] overflow-hidden">
                    <div className="flex gap-[43px] animate-scroll-right">
                        {[...projects.slice(3, 6), ...projects.slice(3, 6)].map((project, index) => (
                            <div 
                                key={`second-${index}`}
                                className="w-[414px] h-[230px] rounded-xl cursor-pointer flex-shrink-0"
                                style={{
                                    backgroundImage: `url(${portfolio})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                @keyframes scroll-left {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                
                @keyframes scroll-right {
                    0% {
                        transform: translateX(-50%);
                    }
                    100% {
                        transform: translateX(0);
                    }
                }
                
                .animate-scroll-left {
                    animation: scroll-left 20s linear infinite;
                }
                
                .animate-scroll-right {
                    animation: scroll-right 20s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default ProjectShowcase;