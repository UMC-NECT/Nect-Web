const RecommendedProjects = () => {
    const projects = [1, 2, 3, 4]; // 4개 더미 데이터

    return (
        <div>
            <h3 className="text-[24px] font-bold mb-6">맞춤형 프로젝트 추천</h3>
            
            {/* 2x2 그리드 */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-3">
                {projects.map((project) => (
                    <div key={project}>
                        {/* 프로젝트 이미지 영역 (더미) */}
                        <div className="w-[280px] h-[235px] bg-neutral-300 rounded-lg"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecommendedProjects;