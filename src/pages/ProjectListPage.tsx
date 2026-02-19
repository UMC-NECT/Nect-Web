import { useMemo, useState, useEffect } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import ContentBox from '@/components/main/ContentBox';
import TabGroup from '@/components/main/TabGroup';
import CategoryDropdown from '@/components/main/CategoryDropdown';
import RecommendationProjectCard from '@/components/common/RecommendationProjectCard';
import { useRecruitingProjects } from '@/hooks/queries/home';
import { useOnboardingEnums } from '@/hooks/auth/useOnboardingEnums';
import { TABS, PART_MAP } from '@/constants/filters';
import LoadingScreen from '@/components/splash/LoadingScreen';

const ProjectListPage = () => {
    const [selectedTab, setSelectedTab] = useState('전체');
    const { data: projects, isLoading, error } = useRecruitingProjects(100);
    const { interestFields } = useOnboardingEnums();

    const categories = useMemo(
        () => ['전체', ...interestFields.map(i => i.label), '기타'],
        [interestFields]
    );
    const [selectedCategory, setSelectedCategory] = useState('전체');

    const interestFieldValueByLabel = useMemo(() => {
        const map: Record<string, string> = {}
        interestFields.forEach(item => { map[item.label] = item.value })
        return map
    }, [interestFields])

    const categoryEnumValue = interestFieldValueByLabel[selectedCategory] ?? null

    const filteredProjects = useMemo(() => {
        if (!projects) return []
        return projects.filter(project => {
            if (selectedTab !== '전체') {
                if (!project.authorPart) {
                    if (selectedTab !== '기타') return false
                } else {
                    const projectPart = PART_MAP[project.authorPart] || '기타'
                    if (projectPart !== selectedTab) return false
                }
            }
            if (selectedCategory === '전체') return true
            if (selectedCategory === '기타') {
                if (categoryEnumValue) return project.interestField === categoryEnumValue
                return !project.interestField
            }
            return project.interestField === categoryEnumValue
        })
    }, [projects, selectedTab, selectedCategory, categoryEnumValue])

    useEffect(() => {
        document.body.style.backgroundColor = '#FAFAFA';

        return () => {
            document.body.style.backgroundColor = '';
        };
    }, []);

    if (isLoading) {
        return <LoadingScreen/>
    }

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

                    <h1 className="heading-2 font-bold mt-7">
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
                            categories={categories}
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