const Statistics = () => {
    const stats = [
        {
            number: '1만 개+',
            description: '누적 프로젝트 수',
            isPrimary: true,
        },
        {
            number: '80%',
            description: '매칭 성공률',
            isPrimary: false,
        },
        {
            number: '65%',
            description: '프로젝트 재참여율',
            isPrimary: false,
        },
        {
            number: '10만명+',
            description: '누적 이용자수',
            isPrimary: false,
        },
    ];

    return (
        <div className="w-282 h-[150px] mx-auto mb-17">
            <h2 className="text-[22px] font-bold mb-11">사이드프로젝트는 NECT에서</h2>
            
            {/* 통계 */}
            <div className="h-20 flex items-center">
                {stats.map((stat, index) => (
                    <>
                        <div key={index} className="w-[252px] h-[79px] px-5 gap-[6px]">
                            <div className={`text-[40px] font-bold ${
                                stat.isPrimary ? 'text-primary-500-normal' : 'text-neutral-900'
                            }`}>
                                {stat.number}
                            </div>
                            <div className="text-[18px] text-left text-neutral-500 font-medium">
                                {stat.description}
                            </div>
                        </div>
                        {index < stats.length - 1 && (
                            <div className="w-10 flex justify-center">
                                <div className="w-px h-20 bg-neutral-300"/>
                            </div>
                        )}
                    </>
                ))}
            </div>
        </div>
    );
};

export default Statistics;