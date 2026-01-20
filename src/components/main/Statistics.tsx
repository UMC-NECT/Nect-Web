const Statistics = () => {
    const stats = [
        {
            number: '1만 개+',
            description: '누적 프로젝트 수',
        },
        {
            number: '80%',
            description: '매칭 성공률',
        },
        {
            number: '65%',
            description: '프로젝트 재참여율',
        },
    ];

    return (
        <div className="w-[1200px] mx-auto">
            <h2 className="text-[24px] font-semibold mb-8">사이드프로젝트는? NECT!</h2>
            
            {/* 통계 */}
            <div className="grid grid-cols-3 gap-8">
                {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                        <div className="text-[40px] font-bold mb-2">
                            {stat.number}
                        </div>
                        <div className="text-[18px] text-neutral-700 font-medium">
                            {stat.description}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Statistics;