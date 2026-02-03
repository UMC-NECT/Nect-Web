import { useState } from 'react';
import BgPattern from '@/assets/icons/main/bg.svg';
import portfolio from '@/assets/icons/main/nugu.svg';

const ProjectShowcase = () => {
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);
    
    const projects = [
        { id: 1, title: 'NUGU AI Speaker 모바일 앱 구현'},
        { id: 2, title: 'NUGU AI Speaker 모바일 앱 구현' },
        { id: 3, title: 'NUGU AI Speaker 모바일 앱 구현' },
        { id: 4, title: 'NUGU AI Speaker 모바일 앱 구현' },
        { id: 5, title: 'NUGU AI Speaker 모바일 앱 구현' },
        { id: 6, title: 'NUGU AI Speaker 모바일 앱 구현' },
    ];

    // 충분히 많이 복제해서 끊김 방지
    const firstRowProjects = [...projects.slice(0, 3), ...projects.slice(0, 3), ...projects.slice(0, 3), ...projects.slice(0, 3)];
    const secondRowProjects = [...projects.slice(3, 6), ...projects.slice(3, 6), ...projects.slice(3, 6), ...projects.slice(3, 6)];

    return (
        <div className="w-full h-237 -mx-4 relative overflow-hidden">
            {/* SVG 배경 */}
            <div 
                className="absolute inset-0 bg-neutral-900"
                style={{
                    backgroundImage: `url(${BgPattern})`,
                }}
            />
            
            <div className="relative mt-28">
                <h2 className="text-[32px] font-bold mb-12 text-center text-white">
                    완주한 프로젝트의<br />
                    프로젝트를 넥트에서 확인해보세요 !
                </h2>
                
                {/* 첫 번째 줄 - 왼쪽으로 흐름 */}
                <div className="flex gap-10.75 mb-8">
                    <div 
                        className={`flex gap-10.75 ${hoveredRow === 1 ? '' : 'animate-scroll-left'}`}
                        onMouseEnter={() => setHoveredRow(1)}
                        onMouseLeave={() => setHoveredRow(null)}
                    >
                        {firstRowProjects.map((project, index) => (
                            <div 
                                key={`first-${index}`}
                                className="w-103.5 h-72.5 rounded-xl cursor-pointer shrink-0 transition-transform duration-300 hover:-translate-y-4"
                            >
                                <div
                                    className="w-full h-57.5 rounded-xl"
                                    style={{
                                        backgroundImage: `url(${portfolio})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                />
                                <div>
                                    <h3 className="text-md text-neutral-50 p-2.5">
                                        {project.title}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* 두 번째 줄 - 오른쪽으로 흐름 */}
                <div className="flex gap-10.75 mb-14">
                    <div 
                        className={`flex gap-10.75 ${hoveredRow === 2 ? '' : 'animate-scroll-right'}`}
                        onMouseEnter={() => setHoveredRow(2)}
                        onMouseLeave={() => setHoveredRow(null)}
                    >
                        {secondRowProjects.map((project, index) => (
                            <div 
                                key={`second-${index}`}
                                className="w-103.5 h-72.5 rounded-xl cursor-pointer shrink-0 transition-transform duration-300 hover:-translate-y-4"
                            >
                                <div
                                    className="w-full h-57.5 rounded-xl"
                                    style={{
                                        backgroundImage: `url(${portfolio})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                />
                                <div>
                                    <h3 className="text-md text-neutral-000 p-2.5">
                                        {project.title}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectShowcase;