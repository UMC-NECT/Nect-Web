import React from 'react';
import { useStatistics } from '@/hooks/queries/home';

const Statistics = () => {
    const { data: stats } = useStatistics();

    // 숫자를 포맷팅하는 함수
    const formatNumber = (num: number) => {
        if (num >= 10000) {
            return `${Math.floor(num / 10000)}만${num % 10000 > 0 ? '+' : ''}`;
        }
        return num.toLocaleString();
    };

    // 로딩 또는 에러 시 기본값 표시
    const displayStats = [
        {
            number: stats ? `${formatNumber(stats.totalProjectCount)}개${stats.totalProjectCount >= 10000 ? '+' : ''}` : '1만 개+',
            description: '누적 프로젝트 수',
            isPrimary: true,
        },
        {
            number: stats ? `${stats.matchingSuccessRate}%` : '80%',
            description: '매칭 성공률',
            isPrimary: false,
        },
        {
            number: stats ? `${stats.reParticipateRate}%` : '65%',
            description: '프로젝트 재참여율',
            isPrimary: false,
        },
        {
            number: stats ? `${formatNumber(stats.totalUserCount)}명${stats.totalUserCount >= 10000 ? '+' : ''}` : '10만명+',
            description: '누적 이용자수',
            isPrimary: false,
        },
    ];

    return (
        <div className="w-282 h-[150px] mx-auto mb-16">
            <h2 className="text-[22px] font-bold mb-11">사이드프로젝트는 NECT에서</h2>
            
            {/* 통계 */}
            <div className="h-20 flex items-center">
                {displayStats.map((stat, index) => (
                    <React.Fragment key={index}>
                        <div className="w-[252px] h-[79px] px-5 gap-[6px]">
                            <div className={`text-[40px] font-bold ${
                                stat.isPrimary ? 'text-primary-500-normal' : 'text-neutral-900'
                            }`}>
                                {stat.number}
                            </div>
                            <div className="text-[18px] text-left text-neutral-500 font-medium">
                                {stat.description}
                            </div>
                        </div>
                        {index < displayStats.length - 1 && (
                            <div className="w-10 flex justify-center">
                                <div className="w-px h-20 bg-neutral-300"/>
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default Statistics;