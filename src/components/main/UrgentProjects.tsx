const UrgentProjects = () => {
    const projects = [
        {
            id: 1,
            tag: '5일 남음',
            category: '디자이너 모집중 (2)',
            title: '넥트 NECT',
            description: '모든 창작자들을 위한 매칭 플랫폼',
            period: '프로젝트 기간: 2025.11.08 ~ 2026.02.19',
        },
        {
            id: 2,
            tag: '5일 남음',
            category: '디자이너 모집중 (2)',
            title: '넥트 NECT',
            description: '모든 창작자들을 위한 매칭 플랫폼',
            period: '프로젝트 기간: 2025.11.08 ~ 2026.02.19',
        },
        {
            id: 3,
            tag: '5일 남음',
            category: '디자이너 모집중 (2)',
            title: '넥트 NECT',
            description: '모든 창작자들을 위한 매칭 플랫폼',
            period: '프로젝트 기간: 2025.11.08 ~ 2026.02.19',
        },
        {
            id: 4,
            tag: '5일 남음',
            category: '디자이너 모집중 (2)',
            title: '넥트 NECT',
            description: '모든 창작자들을 위한 매칭 플랫폼',
            period: '프로젝트 기간: 2025.11.08 ~ 2026.02.19',
        },
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-[24px] font-bold">모집 중인 프로젝트</h3>
                <button className="px-4 py-1 bg-neutral-200 text-[16px] text-neutral-900 rounded-3xl hover:bg-neutral-200 transition-colors">
                    더보기
                </button>
            </div>
            
            {/* 프로젝트 리스트 */}
            <div className="flex flex-col gap-3">
                {projects.map((project) => (
                    <div 
                        key={project.id}
                        className="h-[111px] bg-neutral-100 rounded-xl px-5 py-4 cursor-pointer flex gap-4 border border-neutral-300"
                    >
                        {/* 왼쪽: 태그 */}
                        <div className="flex-shrink-0">
                            <span className="px-3 py-1 bg-neutral-300 text-neutral-900 rounded-2xl text-[16px] font-medium">
                                {project.tag}
                            </span>
                        </div>
                        
                        {/* 오른쪽: 나머지 정보 */}
                        <div className="flex-1 flex flex-col justify-between">
                            {/* 카테고리 */}
                            <span className="text-[14px] text-neutral-700">
                                {project.category}
                            </span>
                            
                            {/* 제목 */}
                            <h4 className="text-[18px] font-bold">{project.title}</h4>
                            
                            {/* 설명과 기간 */}
                            <div className="flex items-center justify-between">
                                <p className="text-[14px] text-neutral-700">{project.description}</p>
                                <p className="text-[14px] text-neutral-700 whitespace-nowrap ml-4">
                                    {project.period}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UrgentProjects;