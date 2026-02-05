import More from '@/assets/icons/common/chevron-right.svg?react';
import BarIcon from '@/assets/icons/common/Bar.svg?react';
import { Link } from 'react-router-dom';

import { getTagStyle } from '@/utils/tagStyles';

import { getTagStyle } from '@/utils/tagStyles';

const UrgentProjects = () => {

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
        <div className="w-138 h-142.5">
            <div className="flex justify-between items-center mb-5 w-138 h-7.5">
                <h2 className="text-[22px] text-neutral-900 font-bold">모집 중인 프로젝트</h2>
<<<<<<< HEAD
                <Link 
                    to="/projectList"
                    className="w-16.5 h-6 flex items-center gap-1 cursor-pointer text-neutral-500 font-semibold text-md hover:text-neutral-700"
                >
                    더보기
                    <More className="w-4 h-4 stroke-neutral-500 hover:stroke-neutral-700 mr-1" />
                </Link>
=======
                <p className="w-16.5 h-6 flex items-center gap-1 cursor-pointer text-neutral-500 font-semibold text-md hover:text-neutral-700">
                    더보기
                    <More className="w-4 h-4 stroke-neutral-500 mr-1" />
                </p>
>>>>>>> 68c2c1e584e1754f63e52ca973f54ff3fff9197a
            </div>  
            
            {/* 프로젝트 리스트 */}
            <div className="flex flex-col gap-2">
                {projects.map((project) => (
                    <div 
                        key={project.id} 
                        className="w-138 h-31 px-5.5 py-4 bg-white rounded-xl border border-neutral-100 cursor-pointer hover:border-purple-400 transition-colors"
                    >
                        {/* 상단: 제목 + 날짜 */}
                        <div className="flex justify-between items-start mb-3 h-13.25">
                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-[16px] text-neutral-900 font-semibold">{project.title}</h3>
                                    <BarIcon className="w-0.5 h-3" />
                                    <span className="text-[14px] text-neutral-500 font-semibold">{project.category}</span>
                                </div>
                                <p className="text-sm font-medium text-neutral-600">{project.description}</p>
                            </div>
                            <span className="text-xl font-bold text-primary-500-normal whitespace-nowrap ml-4">
                                {project.dDay}
                            </span>
                        </div>
                        
                        {/* 하단: 태그 + 인원 */}
                        <div className="flex justify-between items-center">
                            <div className="flex gap-2 flex-wrap">
                                {project.tags.map((tag, index) => (
                                    <span 
                                        key={index}
                                        className={`px-2 py-1 gap-0.5 text-sm text-neutral-800 rounded-md h-6 flex justify-center items-center ${getTagStyle(tag)}`}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <span className="text-[16px] text-neutral-500 whitespace-nowrap w-14.75 h-6">
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