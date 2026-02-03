import More from '@/assets/icons/common/chevron-right.svg?react';
import projectBg from '@/assets/icons/main/nugu.svg'; 
import profile from '@/assets//icons/main/profile.svg';
import BarIcon from '@/assets/icons/common/Bar.svg?react';

const RecommendedProjects = () => {
    const projects = [
        {
            id: 1,
            background: projectBg,
            character: profile,
            category: '매칭 가능',
            name: '시루',
            position: 'PM',
            description: '디자인 전공 출신 만능형 프로덕트 매니저입니다! 함께 성장 할 팀을 구합니다!',
        },
        {
            id: 2,
            background: projectBg,
            character: profile,
            category: '매칭 가능',
            name: '이방토',
            position: 'Design',
            description: '프로젝트 경험이 많은 UX.UI 디자이너 입니다 ! UX리서치/ 브랜딩/ 패키지/ 그래...',
        },
        {
            id: 3,
            background: projectBg,
            character: profile, 
            category: '매칭 가능',
            name: '김넥터',
            position: 'Develop',
            description: '풀스택 개발 가능합니다! (ExpressJS/ NestJS/ ReactJS/ NextJS/ Python)',
        },
        {
            id: 4,
            background: projectBg,
            character: profile,
            category: '매칭 가능',
            name: '김넥터',
            position: 'Frontend',
            description: '자기소개 (2줄까지 보여짐)',
        },
    ];

    return (
        <div className="w-138 h-142.5">
            <div className="flex justify-between items-center mb-5 w-138 h-7.5">
                <h2 className="text-[22px] text-neutral-900 font-bold">지금 매칭 가능한 넥터</h2>
                <p className="w-16.5 h-6 flex items-center gap-1 cursor-pointer text-neutral-500 font-semibold text-md hover:text-neutral-700">
                    더보기
                    <More className="w-4 h-4 stroke-neutral-500 hover:stroke-neutral-700 mr-1" />
                </p>
            </div>  
            
            <div className="grid grid-cols-2 gap-2">
                {projects.map((project) => (
                    <div 
                        key={project.id} 
                        className="w-68 h-64 rounded-xl overflow-hidden cursor-pointer bg-white border-neutral-100 border-[1.5px] hover:border-primary-400-normal hover:shadow-lg transition-all duration-200"
                    >
                        {/* 상단: 배경 + 이미지 영역 */}
                        <div className="relative h-30">
                            <img 
                                src={project.background} 
                                alt="background"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            
                            {/* 프로필 이미지 + 매칭 가능 버튼 */}
                            <div className="absolute top-18.5 left-3 right-3 w-62">
                                <div className='flex justify-between items-end'>
                                    <img 
                                        src={project.character} 
                                        alt="character"
                                        className="w-20 h-20 border-neutral-100 border rounded-full object-cover"
                                    />
                                    
                                    <div className="flex items-center justify-center gap-1 border border-primary-200-light rounded-2xl bg-white w-21.5 h-6.5">
                                        <span className="w-2.5 h-2.5 bg-primary-500-normal rounded-full"></span>
                                        <span className="text-sm text-neutral-700 font-semibold">
                                            {project.category}
                                        </span>
                                    </div>
                                </div>
                                {/* 하단: 텍스트 정보 영역 */}
                                <div className="px-3 flex flex-col h-18 gap-1.5 mt-2">
                                    <div className="flex items-center text-lg font-semibold text-neutral-900 gap-1.5">
                                        <span>{project.name}</span>
                                        <BarIcon className="w-0.5 h-3" />
                                        <span className="text-neutral-500 font-medium">{project.position}</span>
                                    </div>
                                    
                                    <p className="text-[13px] text-neutral-600 line-clamp-2">
                                        {project.description}
                                    </p>
                                </div>
                            </div>
                            
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecommendedProjects;