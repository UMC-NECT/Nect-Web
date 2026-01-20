const ProjectShowcase = () => {
    // 더미 프로젝트 데이터
    const projects = [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
    ];

    return (
        <div className="w-full -mx-4 bg-neutral-500 py-16">
            <div>
                <h2 className="text-[28px] font-bold mb-12 text-center">
                    완주한 프로젝트를 포트폴리오로 확인하세요!
                </h2>
                
                {/* 첫 번째 줄 */}
                <div className="flex gap-[43px] mb-[63px]">
                    {projects.slice(0, 3).map((project) => (
                        <div 
                            key={project.id}
                            className="w-[444px] h-[303px] bg-neutral-200 cursor-pointer"
                        >
                        </div>
                    ))}
                </div>
                
                {/* 두 번째 줄 */}
                <div className="flex gap-[43px] justify-end">
                    {projects.slice(3, 6).map((project) => (
                        <div 
                            key={project.id}
                            className="w-[444px] h-[303px] bg-neutral-200 cursor-pointer"
                        >
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectShowcase;