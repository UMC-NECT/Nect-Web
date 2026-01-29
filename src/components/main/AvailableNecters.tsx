import More from '@/assets/icons/common/chevron-right.svg?react';
import projectBg from '@/assets/icons/main/nugu.svg'; 
import Bookmark from '@/assets/icons/main/bookmark.svg?react';
import profile from '@/assets//icons/main/profile.svg';
import BarIcon from '@/assets/icons/common/Bar.svg?react';

const RecommendedProjects = () => {
    const projects = [
        {
            id: 1,
            background: projectBg, // 배경 이미지
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
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl text-neutral-900 font-bold">지금 매칭 가능한 넥터</h2>
                <p className="flex items-center gap-1 cursor-pointer text-neutral-500 font-semibold text-md">
                    더보기
                    <More className="w-4 h-4 color-neutral-500 mr-1" />
                </p>
            </div>  
            
            <div className="grid grid-cols-2 gap-3 bg-white">
                {projects.map((project) => (
                    <div 
                        key={project.id} 
                        className="w-[272px] h-[256px] rounded-xl overflow-hidden cursor-pointer bg-white border-neutral-100 border-[1.5px] hover:border-primary-400-normal hover:shadow-lg transition-all duration-200"
                    >
                        {/* 상단: 배경 + 캐릭터 영역 */}
                        <div className="relative h-[140px]">
                            <img 
                                src={project.background} 
                                alt="background"
                                className="absolute inset-0 w-full h-30 object-cover rounded-xl"
                            />
                            <div className="absolute top-4 right-4 w-8 h-8 bg-black/30 rounded-full p-2 cursor-pointer group">
                                <Bookmark 
                                    className="w-full h-full [&>path]:stroke-white [&>path]:fill-none [&>path]:transition-all [&>path]:duration-200 group-hover:[&>path]:stroke-primary-500-normal group-hover:[&>path]:fill-primary-500-normal"
                                />
                            </div>
                            <img 
                                src={project.character} 
                                alt="character"
                                className="absolute bottom-5 left-4 w-16 h-16 translate-y-1/2 border-neutral-100 border-[1px] rounded-4xl"
                            />
                        </div>

                        {/* 매칭 가능 */}
                        <div className="flex justify-end px-4">
                            <div className="flex items-center gap-1 border border-primary-200-light rounded-2xl w-fit px-3 py-1">
                                <span className="w-[10px] h-[10px] bg-primary-500-normal rounded-full"></span>
                                <span className="text-sm text-neutral-700 font-semibold">
                                    {project.category}
                                </span>
                            </div>
                        </div>
                        
                        {/* 하단: 텍스트 정보 영역 */}
                        <div className="px-4 flex flex-col">
                            <div className="flex pb-[7px] items-center text-lg font-semibold text-neutral-900 gap-1">
                                <span>{project.name}</span>
                                <BarIcon className="w-[2px] h-3" />
                                <span className="text-neutral-500 font-medium">{project.position}</span>
                            </div>
                            
                            <p className="text-sm text-neutral-700 line-clamp-2 mr-2">
                                {project.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecommendedProjects;