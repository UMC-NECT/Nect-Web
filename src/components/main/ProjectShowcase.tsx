import { useState } from 'react';
import BgPattern from '@/assets/icons/main/bg.svg';
import goalThumb1 from '@/assets/images/goal-project/goal-project-thumbnail_1.png';
import goalThumb2 from '@/assets/images/goal-project/goal-project-thumbnail_2.png';
import goalThumb3 from '@/assets/images/goal-project/goal-project-thumbnail_3.png';
import goalThumb4 from '@/assets/images/goal-project/goal-project-thumbnail_4.png';
import goalThumb5 from '@/assets/images/goal-project/goal-project-thumbnail_5.png';
import goalThumb6 from '@/assets/images/goal-project/goal-project-thumbnail_6.png';
import goalThumb7 from '@/assets/images/goal-project/goal-project-thumbnail_7.png';
import goalThumb8 from '@/assets/images/goal-project/goal-project-thumbnail_8.png';
import goalThumb9 from '@/assets/images/goal-project/goal-project-thumbnail_9.png';
import goalThumb10 from '@/assets/images/goal-project/goal-project-thumbnail_10.png';
import goalThumb11 from '@/assets/images/goal-project/goal-project-thumbnail_11.png';
import goalThumb12 from '@/assets/images/goal-project/goal-project-thumbnail_12.png';
import goalThumb13 from '@/assets/images/goal-project/goal-project-thumbnail_13.png';
import goalThumb14 from '@/assets/images/goal-project/goal-project-thumbnail_14.png';

const GOAL_THUMBNAILS = [
    goalThumb1, goalThumb2, goalThumb3, goalThumb4, goalThumb5, goalThumb6,
    goalThumb7, goalThumb8, goalThumb9, goalThumb10, goalThumb11, goalThumb12,
    goalThumb13, goalThumb14,
];

const ProjectShowcase = () => {
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);

    const projects = [
        { id: 1, title: 'Triple Renewal', thumbIndex: 0 },
        { id: 2, title: '파마코 가디언즈', thumbIndex: 1 },
        { id: 3, title: '뉴멘톡 수학', thumbIndex: 2 },
        { id: 4, title: 'Fuel-Storage', thumbIndex: 3 },
        { id: 5, title: '뉴멘토 수학학원 리브랜딩', thumbIndex: 4 },
        { id: 6, title: 'GLASS:ON', thumbIndex: 5 },
        { id: 7, title: '수학왕초보', thumbIndex: 6 },
        { id: 8, title: '팝업스토어 구매유도 웹앱', thumbIndex: 7 },
        { id: 9, title: '왓츠인마이백', thumbIndex: 8 },
        { id: 10, title: 'IMPRINTU', thumbIndex: 9 },
        { id: 11, title: 'The O&M', thumbIndex: 10 },
        { id: 12, title: 'OBJE', thumbIndex: 11 },
        { id: 13, title: '비오웨이브', thumbIndex: 12 },
        { id: 14, title: 'Bodle', thumbIndex: 13 },
    ];

    // 모든 프로젝트를 충분히 복제해서 끊김 없이 스크롤. 두 번째 줄은 중간(7번째)부터 시작해 시각적 오프셋
    const firstRowProjects = [...projects, ...projects, ...projects, ...projects];
    const secondRowStartFromMiddle = [...projects.slice(7), ...projects.slice(0, 7)];
    const secondRowProjects = [...secondRowStartFromMiddle, ...secondRowStartFromMiddle, ...secondRowStartFromMiddle, ...secondRowStartFromMiddle];

    return (
        <div className="w-full h-237 -mx-4 relative overflow-hidden">
            {/* SVG 배경 */}
            <div
                className="absolute inset-0 [background:linear-gradient(127.97deg,rgba(102,15,216,0.16),rgba(102,15,216,0)_40%),linear-gradient(180deg,rgba(102,15,216,0.16),rgba(102,15,216,0)_40%),linear-gradient(180deg,rgba(102,15,216,0)_60%,rgba(102,15,216,0.2)),linear-gradient(#000,#000)]"
                style={{
                    backgroundImage: `url(${BgPattern})`,
                }}
            />

            <div className="relative mt-28">
                <h2 className="text-[32px] font-bold mb-14 text-center text-white">
                    완주한 프로젝트의<br />
                    프로젝트를 넥트에서 확인해보세요 !
                </h2>

                {/* 첫 번째 줄 - 왼쪽으로 흐름. 호버 시 해당 줄만 일시정지, 카드 hover 유지 */}
                <div className="flex gap-10.75 mb-8">
                    <div
                        className={`flex gap-3 animate-scroll-left ${hoveredRow === 1 ? 'paused' : ''}`}
                        onMouseEnter={() => setHoveredRow(1)}
                        onMouseLeave={() => setHoveredRow(null)}
                    >
                        {firstRowProjects.map((project, index) => (
                            <div
                                key={`first-${index}`}
                                className="w-[434px] h-[264px] rounded-xl cursor-pointer shrink-0 transition-transform duration-300 hover:-translate-y-4"
                            >
                                <img
                                    src={GOAL_THUMBNAILS[project.thumbIndex % GOAL_THUMBNAILS.length]}
                                    className="w-[414px] h-[230px] rounded-xl border border-neutral-800 overflow-hidden"
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

                {/* 두 번째 줄 - 오른쪽으로 흐름. 호버 시 해당 줄만 일시정지, 카드 hover 유지 */}
                <div className="flex gap-10.75 mb-8">
                    <div
                        className={`flex gap-3 animate-scroll-right ${hoveredRow === 2 ? 'paused' : ''}`}
                        onMouseEnter={() => setHoveredRow(2)}
                        onMouseLeave={() => setHoveredRow(null)}
                    >
                        {secondRowProjects.map((project, index) => (
                            <div
                                key={`second-${index}`}
                                className="w-[434px] h-[264px] rounded-xl cursor-pointer shrink-0 transition-transform duration-300 hover:-translate-y-4"
                            >
                                <img
                                    src={GOAL_THUMBNAILS[project.thumbIndex % GOAL_THUMBNAILS.length]}
                                    className="w-[414px] h-[230px] rounded-xl overflow-hidden"
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