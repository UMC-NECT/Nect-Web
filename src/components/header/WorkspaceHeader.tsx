import { useState, useEffect } from 'react';
import LogoIcon from '@/assets/icons/header/Logo.svg?react';
import BarIcon from '@/assets/icons/common/Bar.svg?react';
import SearchIcon from '@/assets/icons/header/Search.svg?react';
import { Link, useNavigate } from 'react-router';
import useGetProjectUsers from '@/hooks/project-users/useGetProjectUsers';
import { useProjectIdStore } from '@/stores/useProjectIdStroe';
import { getProjectUsers } from '@/api/project-users/projectUsers';
import type { ProjectUserDto } from '@/types/api/project-users';

interface WorkspaceHeaderProps {
    onNavigate: () => void;
}

const WorkspaceHeader = ({ onNavigate }: WorkspaceHeaderProps) => {
    const [showExploreMenu, setShowExploreMenu] = useState(false);
    const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
    const [projects, setProjects] = useState<ProjectUserDto[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
    const navigate = useNavigate()
    const projectData = useGetProjectUsers()
    const { setProjectId } = useProjectIdStore()
    
    const exploreMenuItems = [
        { name: '프로젝트 찾기' },
        { name: '팀원 찾기' },
        { name: '출시 프로젝트' },
    ];

    // 프로젝트 목록 조회
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await getProjectUsers()
                if (response.body) {
                    setProjects(response.body)
                    // 프로젝트가 1개면 자동으로 선택
                    if (response.body.length === 1) {
                        setSelectedProjectId(response.body[0].projectId)
                    }
                }
            } catch (error) {
                console.error('프로젝트 목록 조회 실패:', error)
            }
        }
        fetchProjects()
    }, [])

    // 프로젝트 선택 핸들러
    const handleProjectSelect = (projectId: number) => {
        setSelectedProjectId(projectId)
        setShowWorkspaceMenu(false)
        // 프로젝트 선택 시 해당 프로젝트 페이지로 이동
        navigate(`/team-board/${projectId}`)
    }

    // 프로젝트 개수에 따른 동작
    const shouldShowMenu = projects.length >= 2 // 2개 이상일 때 메뉴 표시
    // 표시할 프로젝트 목록 (최대 2개만)
    const displayProjects = projects.slice(0, 2)

    // 호버 시 메뉴 표시
    const handleWorkspaceMouseEnter = () => {
        if (shouldShowMenu) {
            setShowWorkspaceMenu(true)
            setShowExploreMenu(false)
        }
    }

    return (
        <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-[0px_4px_20px_0px_rgba(25,25,25,0.02)]">
            {/* 상단 헤더 */}
            <div className="fixed left-[92px] right-[92px] h-[66px] ">
                <div className="mx-auto flex h-full items-center gap-9 px-6 relative">
                    {/* 로고 */}
                    <Link to='/' className="flex items-center cursor-pointer">
                        <LogoIcon className="h-10 w-auto" />
                    </Link>

                    {/* 네비게이션 */}
                    <nav className="flex items-center gap-4">
                        {/* 프로젝트·팀원 탐색 */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    onNavigate()
                                    setProjectId(null)
                                    navigate('/')
                                }}
                                onMouseEnter={() => {
                                    setShowExploreMenu(true);
                                    setShowWorkspaceMenu(false);
                                }}
                                className={`text-[18px] font-medium transition-colors ${
                                    showExploreMenu
                                        ? 'text-primary-500-normal'
                                        : 'text-neutral-400'
                                }`}
                            >
                                프로젝트ㆍ팀원 탐색
                            </button>

                            {/* 프로젝트·팀원 탐색 드롭다운 */}
                            {showExploreMenu && (
                                <div
                                    className="absolute top-[46px] left-[-10px] w-[160px] bg-white rounded-12 border border-neutral-200 overflow-hidden z-50 shadow-[0px_4px_20px_0px_rgba(25,25,25,0.04)]"
                                    onMouseEnter={() => setShowExploreMenu(true)}
                                    onMouseLeave={() => setShowExploreMenu(false)}
                                >
                                    {exploreMenuItems.map((item, index) => (
                                        <div key={item.name}>
                                            <button
                                                className="w-full h-[54px] px-4 text-left text-[16px] font-medium text-neutral-900 hover:bg-neutral-50 transition-colors flex items-center"
                                            >
                                                {item.name}
                                            </button>
                                            {index < exploreMenuItems.length - 1 && (
                                                <div className="border-b border-neutral-200"></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <BarIcon />

                        {/* 팀 작업실 */}
                        <div className="relative">
                            <button
                                onMouseEnter={handleWorkspaceMouseEnter}
                                onClick={() => {
                                    // 프로젝트가 있으면 첫 번째 프로젝트로 이동
                                    if (projects.length > 0 && projects[0]) {
                                        const targetProjectId = selectedProjectId || projects[0].projectId
                                        setProjectId(targetProjectId)
                                        navigate(`/team-board/${targetProjectId}`)
                                    } else if (projectData && projectData.length > 0) {
                                        // fallback: projectData 사용
                                        const targetProjectId = projectData[0].projectId
                                        setProjectId(targetProjectId)
                                        navigate(`/team-board/${targetProjectId}`)
                                    } else {
                                        // 프로젝트가 없으면 메뉴만 표시 (또는 에러 처리)
                                        if (!shouldShowMenu) {
                                            console.warn('프로젝트가 없습니다.')
                                        }
                                    }
                                }}
                                className={`text-[18px] font-medium transition-colors ${
                                    showWorkspaceMenu
                                        ? 'text-primary-500-normal'
                                        : 'text-neutral-900 hover:text-neutral-900'
                                }`}
                            >
                                팀 작업실
                            </button>

                            {/* 팀 작업실 드롭다운 - 프로젝트가 2개 이상일 때 표시 (최대 2개만) */}
                            {shouldShowMenu && showWorkspaceMenu && (
                                <div
                                    className="absolute top-[46px] left-[-20px] w-[160px] bg-white rounded-12 border border-neutral-200 overflow-hidden z-50 shadow-[0px_4px_20px_0px_rgba(25,25,25,0.04)]"
                                    onMouseEnter={() => setShowWorkspaceMenu(true)}
                                    onMouseLeave={() => setShowWorkspaceMenu(false)}
                                >
                                    {displayProjects.map((project, index) => (
                                        <div key={project.projectId}>
                                            <button
                                                onClick={() => handleProjectSelect(project.projectId)}
                                                className={`w-full h-[54px] px-4 text-left text-[16px] font-medium transition-colors flex items-center ${
                                                    selectedProjectId === project.projectId
                                                        ? 'bg-primary-50 text-primary-500-normal'
                                                        : 'text-neutral-900 hover:bg-neutral-50'
                                                }`}
                                            >
                                                {project.projectTitle}
                                            </button>
                                            {index < displayProjects.length - 1 && (
                                                <div className="border-b border-neutral-200"></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* 오른쪽 공간 */}
                    <div className="flex-1" />

                    {/* 검색 아이콘 */}
                    <button
                        className="flex h-10 w-10 items-center justify-center"
                        aria-label="검색"
                    >
                        <SearchIcon className="h-8 w-8 text-neutral-700" />
                    </button>
                </div>
            </div>

            {/* 하단 빈 공간 (ExploreHeader와 높이 맞추기) */}
            <div className="h-[66px]"></div>
        </header>
    );
};

export default WorkspaceHeader;