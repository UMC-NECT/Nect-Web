import { useState } from 'react'
import { createPortal } from 'react-dom'
import LogoIcon from '@/assets/icons/header/Logo.svg?react'
import BarIcon from '@/assets/icons/common/Bar.svg?react'
import SearchIcon from '@/assets/icons/header/Search.svg?react'
import { Link, useNavigate } from 'react-router'
import useGetProjectUsers from '@/hooks/project-users/useGetProjectUsers'
import useFilteredWorkspaceItems from '@/hooks/project-users/useFilteredWorkspaceItems'
import { useProjectIdStore } from '@/stores/useProjectIdStroe'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { LOCAL_STORAGE_KEY } from '@/constants/key'
import CTAModal from '@/components/common/CTAModal'

interface WorkspaceHeaderProps {
    onNavigate?: () => void;
}

const WorkspaceHeader = ({ onNavigate }: WorkspaceHeaderProps) => {
	const [showExploreMenu, setShowExploreMenu] = useState(false)
	const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false)
	const [showNoWorkspaceModal, setShowNoWorkspaceModal] = useState(false)
	const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)
	const navigate = useNavigate()
	const projectData = useGetProjectUsers()
	const filteredWorkspaceItems = useFilteredWorkspaceItems(projectData)
	const { setProjectId } = useProjectIdStore()
	const { getItem: getAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
	const isLoggedIn = getAccessToken()

	const exploreMenuItems = [
		{ name: '프로젝트 찾기', href: '/projectList' },
		{ name: '팀원 찾기', href: '/necterList' },
	]

	const displaySelectedId = selectedProjectId ?? (filteredWorkspaceItems.length === 1 ? filteredWorkspaceItems[0].projectId : null)

	const handleProjectSelect = (projectId: number) => {
		setSelectedProjectId(projectId)
		setShowWorkspaceMenu(false)
		navigate(`/team-board/${projectId}`)
	}

	const shouldShowMenu = filteredWorkspaceItems.length >= 2
	const displayProjects = filteredWorkspaceItems

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
                                    onNavigate?.()
                                    setProjectId(null)
                                    navigate('/')
                                }}
                                onMouseEnter={() => {
                                    setShowExploreMenu(true);
                                    setShowWorkspaceMenu(false);
                                }}
                                className={`title-3 font-medium transition-colors ${
                                    showExploreMenu
                                        ? 'text-primary-500-normal'
                                        : 'text-neutral-400'
                                }`}
                            >
                                프로젝트<span className='-mx-1'>ㆍ</span>팀원 탐색
                            </button>

                            {/* 프로젝트·팀원 탐색 드롭다운 */}
                            {showExploreMenu && (
                                <div
                                    className="absolute top-[46px] left-[-10px] min-w-[160px] bg-white rounded-12 border border-neutral-200 overflow-hidden z-50 shadow-[0px_4px_20px_0px_rgba(25,25,25,0.04)]"
                                    onMouseEnter={() => setShowExploreMenu(true)}
                                    onMouseLeave={() => setShowExploreMenu(false)}
                                >
                                    {exploreMenuItems.map((item, index) => (
                                        <div key={item.name}>
                                            <button
                                                className="w-full h-[54px] px-4 text-left text-[16px] font-medium text-neutral-900 hover:bg-neutral-50 transition-colors flex items-center whitespace-nowrap"
                                                onClick={() => navigate(item.href)}
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
                                    if (!isLoggedIn) {
                                        navigate('/login')
                                        return
                                    }
                                    if (filteredWorkspaceItems.length === 0) {
                                        setShowNoWorkspaceModal(true)
                                        return
                                    }
                                    const targetProjectId = displaySelectedId ?? filteredWorkspaceItems[0].projectId
                                    setProjectId(targetProjectId)
                                    navigate(`/team-board/${targetProjectId}`)
                                }}
                                className={`title-3 font-medium transition-colors ${
                                    showWorkspaceMenu
                                        ? 'text-primary-500-normal'
                                        : 'text-neutral-900 hover:text-neutral-900'
                                }`}
                            >
                                팀 작업실
                            </button>
                            {showNoWorkspaceModal &&
                                createPortal(
                                    <CTAModal
                                        message='생성된 작업실이 없습니다.'
                                        subMessage='프로젝트 등록 후 이용 할 수 있습니다.'
                                        buttonMsg='확인'
                                        onButtonClick={() => setShowNoWorkspaceModal(false)}
                                    />,
                                    document.body
                                )}

                            {/* 팀 작업실 드롭다운 - 프로젝트가 2개 이상일 때 표시 (최대 2개만) */}
                            {shouldShowMenu && showWorkspaceMenu && (
                                <div
                                    className="absolute top-[46px] left-[-20px] min-w-[160px] bg-white rounded-12 border border-neutral-200 overflow-hidden z-50 shadow-[0px_4px_20px_0px_rgba(25,25,25,0.04)]"
                                    onMouseEnter={() => setShowWorkspaceMenu(true)}
                                    onMouseLeave={() => setShowWorkspaceMenu(false)}
                                >
                                    {displayProjects.map((project, index) => (
                                        <div key={project.projectId}>
                                            <button
                                                onClick={() => handleProjectSelect(project.projectId)}
                                                className={`w-full h-[54px] px-4 text-left text-[16px] font-medium transition-colors flex items-center whitespace-nowrap ${
                                                    displaySelectedId === project.projectId
                                                        ? 'bg-primary-50 text-primary-500-normal'
                                                        : 'text-neutral-900 hover:bg-neutral-50'
                                                }`}
                                            >
                                                {project.name}
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