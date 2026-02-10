import More from '@/assets/icons/common/chevron-right.svg?react';
import BarIcon from '@/assets/icons/common/Bar.svg?react';
import { Link } from 'react-router';
import { getTagStyle } from '@/utils/tagStyles';
import { useRecruitingProjects } from '@/hooks/queries/home';

const UrgentProjects = () => {
    const { data: projects, isLoading, isError } = useRecruitingProjects(4);

    // roles 객체를 태그 배열로 변환
    const getRoleTags = (roles: Record<string, number>) => {
        const tags = Object.entries(roles).map(([role, count]) => `${role} (${count})`);
        // 최대 4개까지만 표시, 나머지는 '...'
        if (tags.length > 4) {
            return [...tags.slice(0, 4), '...'];
        }
        return tags;
    };

    // authorPart 한글 변환
    const getDisplayPart = (part: string) => {
        const partMap: Record<string, string> = {
            'DEVELOPER': '개발',
            'DESIGNER': '디자인',
            'PLANNER': '기획',
            'OTHER': '기타',
        };
        return partMap[part] || part;
    };

    return (
        <div className="w-138 h-142.5">
            <div className="flex justify-between items-center mb-5 w-138 h-7.5">
                <h2 className="text-[22px] text-neutral-900 font-bold">모집 중인 프로젝트</h2>
                {!isLoading && !isError && projects && projects.length > 0 && (
                    <Link
                        to="/projectList"
                        className="w-16.5 h-6 flex items-center gap-1 cursor-pointer text-neutral-500 font-semibold text-md hover:text-neutral-700"
                    >
                        더보기
                        <More className="w-4 h-4 stroke-neutral-500 hover:stroke-neutral-700 mr-1" />
                    </Link>
                )}
            </div>

            {/* 로딩 상태 */}
            {isLoading && (
                <div className="flex items-center justify-center h-100 text-neutral-500">
                    로딩 중...
                </div>
            )}

            {/* 에러 상태 */}
            {isError && (
                <div className="flex items-center justify-center h-100 text-neutral-500">
                    프로젝트를 불러오는데 실패했습니다.
                </div>
            )}

            {/* 빈 데이터 상태 */}
            {!isLoading && !isError && (!projects || projects.length === 0) && (
                <div className="flex items-center justify-center h-100 text-neutral-500">
                    모집 중인 프로젝트가 없습니다.
                </div>
            )}

            {/* 프로젝트 리스트 */}
            {!isLoading && !isError && projects && projects.length > 0 && (
                <div className="flex flex-col gap-2">
                    {projects.map((project) => (
                        <Link
                            key={project.projectId}
                            to={`/recruiting-projects/${project.projectId}`}
                            className="w-138 h-31 px-5.5 py-4 bg-white rounded-xl border border-neutral-100 cursor-pointer hover:border-purple-400 transition-colors block"
                        >
                            {/* 상단: 제목 + 날짜 */}
                            <div className="flex justify-between items-start mb-3 h-13.25">
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-[16px] text-neutral-900 font-semibold">{project.projectName}</h3>
                                        <BarIcon className="w-0.5 h-3" />
                                        <span className="text-[14px] text-neutral-500 font-semibold">
                                            {project.authorName} · {getDisplayPart(project.authorPart)}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-neutral-600">{project.introduction}</p>
                                </div>
                                <span className="text-xl font-bold text-primary-500-normal whitespace-nowrap ml-4">
                                    D-{project.leftDays}
                                </span>
                            </div>

                            {/* 하단: 태그 + 인원 */}
                            <div className="flex justify-between items-center">
                                <div className="flex gap-2 flex-wrap">
                                    {getRoleTags(project.roles).map((tag, index) => (
                                        <span
                                            key={index}
                                            className={`px-2 py-1 gap-0.5 text-sm text-neutral-800 rounded-md h-6 flex justify-center items-center ${getTagStyle(tag)}`}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <span className="text-[16px] text-neutral-500 whitespace-nowrap w-14.75 h-6">
                                    팀원 <span className="text-neutral-700">{project.curMemberCount}/{project.maxMemberCount}</span>
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UrgentProjects;