import More from '@/assets/icons/common/chevron-right.svg?react';
import BarIcon from '@/assets/icons/common/Bar.svg?react';

const UrgentProjects = () => {
    // 태그 색상 매핑
    const getTagStyle = (tag: string) => {
        const tagName = tag.split(' ')[0].toLowerCase();
        
        const styles: Record<string, string> = {
            'design': 'bg-tag-pink',
            'frontend': 'bg-tag-green',
            'backend': 'bg-tag-blue',
            'server': 'bg-tag-orange',
            'data': 'bg-tag-yellow',
            'video': 'bg-tag-green',
            'music': 'bg-tag-blue',
        };
        
        return styles[tagName];
    };

    const projects = [
        {
            id: 1,
            dDay: 'D-22',
            title: '넥트 (Nect)',
            category: 'UX.UI・개발・엔지니어',
            description: '아이디어 분석 & 팀원 매칭 & 협업 보드까지, 사이드 프로젝트 웹 개발',
            tags: ['Design (1)', 'Frontend (2)', 'Backend (1)'],
            members: '5/10'
        },
        {
            id: 2,
            dDay: 'D-12',
            title: '에어비엔비 UX 개선',
            category: 'UX.UI・개발・엔지니어',
            description: '사용자의 탐색 및 결제 Flow로 개선하는 리디자인 및 구현 프로젝트',
            tags: ['Design (1)', 'Backend (2)'],
            members: '4/7'
        },
        {
            id: 3,
            dDay: 'D-32',
            title: 'OOO',
            category: '모집 중인・분야들',
            description: 'AI를 활용한 어쩌고',
            tags: ['Frontend (2)', 'Backend (1)', 'Server (1)', 'Data (1)', '...'],
            members: '0/00'
        },
        {
            id: 4,
            dDay: 'D-48',
            title: '스포티파이 캠페인 영상 제작',
            category: '영상/모션・기획/홍보',
            description: '프로젝트 설명',
            tags: ['Design (2)', 'Video Director (1)', 'Music Director (1)', '...'],
            members: '0/00'
        },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl text-neutral-900 font-bold">모집 중인 프로젝트</h2>
                <p className="flex items-center gap-1 cursor-pointer text-neutral-500 font-semibold text-md">
                    더보기
                    <More className="w-4 h-4 color-neutral-500 mr-1" />
                </p>
            </div>  
            
            {/* 프로젝트 리스트 */}
            <div className="flex flex-col gap-2.5">
                {projects.map((project) => (
                    <div 
                        key={project.id} 
                        className="w-[552px] h-[124px] p-3 bg-white rounded-xl border border-neutral-100 cursor-pointer hover:border-purple-400 transition-colors"
                    >
                        {/* 상단: 제목 + 날짜 */}
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex flex-col gap-1 font-semibold">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg text-neutral-900">{project.title}</h3>
                                    <BarIcon className="w-[2px] h-4" />
                                    <span className="text-md text-neutral-500">{project.category}</span>
                                </div>
                                <p className="text-sm text-neutral-800">{project.description}</p>
                            </div>
                            <span className="text-xl font-bold text-purple-600 whitespace-nowrap ml-4">
                                {project.dDay}
                            </span>
                        </div>
                        
                        {/* 하단: 태그 + 인원 */}
                        <div className="flex justify-between items-center">
                            <div className="flex gap-2 flex-wrap">
                                {project.tags.map((tag, index) => (
                                    <span 
                                        key={index}
                                        className={`px-3 py-1 text-sm text-neutral-800 rounded-lg ${getTagStyle(tag)}`}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <span className="text-md text-neutral-500 whitespace-nowrap ml-4">
                                팀원 <p className="inline text-neutral-700">{project.members}</p>
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UrgentProjects;