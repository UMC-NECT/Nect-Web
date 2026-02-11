import { useState, useEffect } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import ContentBox from '@/components/main/ContentBox';
import TabGroup from '@/components/main/TabGroup';
import CategoryDropdown from '@/components/main/CategoryDropdown';
import RecommendationProjectCard from '@/components/common/RecommendationProjectCard';
import { useRecruitingProjects } from '@/hooks/queries/home';
import { CATEGORIES, TABS, PART_MAP } from '@/constants/filters';

const ProjectListPage = () => {
    const [selectedTab, setSelectedTab] = useState('전체');
    const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);

    // API 호출 (100개 요청)
    const { data: projects, isLoading, error } = useRecruitingProjects(100);

    // 탭에 따라 필터링
    const filteredProjects = projects?.filter(project => {
        if (selectedTab === '전체') return true;

        // authorPart가 null이면 '기타'로 처리
        if (!project.authorPart) {
            return selectedTab === '기타';
        }

        const projectPart = PART_MAP[project.authorPart] || '기타';
        return projectPart === selectedTab;
    }) || [];

    useEffect(() => {
        document.body.style.backgroundColor = '#FAFAFA';

        return () => {
            document.body.style.backgroundColor = '';
        };
    }, []);

    return (
        <div className="pt-16">
            <div className="mt-9 w-[912px] mx-auto">
                <div className='ml-7'>
                    <Breadcrumb
                        items={[
                            { label: '홈', path: '/' },
                            { label: '프로젝트 찾기', path: '/projectList' },
                            { label: '모집 중인 프로젝트', path: '/projectList' },
                            { label: selectedCategory }
                        ]}
                    />

                    <h1 className="mt-7 text-[40px] font-bold">
                        모집 중인 프로젝트
                    </h1>
                </div>

                <ContentBox className="mt-[42px] w-[972px] mx-auto">
                    {/* 탭 영역 */}
                    <TabGroup
                        tabs={[...TABS]}
                        activeTab={selectedTab}
                        onTabChange={setSelectedTab}
                    />

                    {/* 드롭다운 영역 */}
                    <div className="mt-[44px] mx-5">
                        <CategoryDropdown
                            categories={[...CATEGORIES]}
                            selectedCategory={selectedCategory}
                            onCategoryChange={setSelectedCategory}
                        />
                    </div>

                    {/* 로딩/에러/데이터 처리 */}
                    {isLoading && (
                        <div className="mt-6 mx-5 flex justify-center items-center h-64">
                            <p className="text-neutral-500">로딩 중...</p>
                        </div>
                    )}

                    {error && (
                        <div className="mt-6 mx-5 flex justify-center items-center h-64">
                            <p className="text-red-500">에러가 발생했습니다</p>
                        </div>
                    )}

                    {!isLoading && !error && filteredProjects.length === 0 && (
                        <div className="mt-6 mx-5 flex justify-center items-center h-64">
                            <p className="text-neutral-500">모집 중인 프로젝트가 없습니다</p>
                        </div>
                    )}

                    {/* 프로젝트 카드 그리드 */}
                    {!isLoading && !error && filteredProjects.length > 0 && (
                        <div className="mt-6 mx-5 grid grid-cols-2 gap-x-[12px] gap-y-[14px]">
                            {filteredProjects.map(project => (
                                <RecommendationProjectCard
                                    key={project.projectId}
                                    project={project}
                                    variant="list"
                                />
                            ))}
                        </div>
                    )}
                </ContentBox>
            </div>
        </div>
    );
};

export default ProjectListPage;