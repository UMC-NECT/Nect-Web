import { useState } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import ContentBox from '@/components/main/ContentBox';
import TabGroup from '@/components/main/TabGroup';
import CategoryDropdown from '@/components/main/CategoryDropdown';
import RecommendationProjectCard from '@/components/common/RecommendationProjectCard'; 
import PlaceholderImage from '@/assets/icons/common/projectBackground.svg'; 

const CATEGORIES = [
    'IT · 웹/모바일 서비스',
    '출판 · 콘텐츠 제작',
    '예술 · 전시 · 미디어아트',
    '헬스케어 · 피트니스',
    '교육 · 에듀테크',
    '금융 · 핀테크',
    '게임 · 엔터테인먼트',
    '기타'
];

const TABS = ['기획자', '디자이너', '개발자', '마케터', '기타'];

// 테스트용 프로젝트 데이터
const mockProject = {
    id: 1,
    image: PlaceholderImage,
    status: '모집 중',
    title: 'Triple Renewal',
    subtitle: '작성자',
    part: 'Part',
    dDay: 'D-22',
    description: '프로젝트 설명 (2줄까지 보여짐) 프로젝트 설명 (2줄까지 보여짐)... 프로젝트 설명 (2줄까지 보여짐) 프로젝트 설명 (2줄까지 보여짐)',
    tags: ['Design (1)', 'Frontend (2)', 'Backend (1)'],
    members: '5/10'
};

const mockProjects = Array.from({ length: 16 }, (_, index) => ({
    ...mockProject,
    id: index + 1
}));

const ProjectListPage = () => {
    const [selectedTab, setSelectedTab] = useState('디자이너');
    const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);

    return (
        <>
            {/* Body 배경색 설정 (전체 페이지) + neutral-50 컬러 */}
            <style>{`body { background-color: #FAFAFA; }`}</style>
            
            <div className="py-16">
                <div className="my-9 w-[912px] h-[86px] mx-auto">
                    <div className='ml-7'>
                        <Breadcrumb 
                            items={[
                                { label: '홈', path: '/' },
                                { label: '프로젝트 찾기', path: '/projects' },
                                { label: '모집 중인 프로젝트', path: '/projects' },
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
                            tabs={TABS}
                            activeTab={selectedTab}
                            onTabChange={setSelectedTab}
                        />

                        {/* 드롭다운 영역 */}
                        <div className="mt-[44px] mx-5">
                            <CategoryDropdown 
                                categories={CATEGORIES}
                                selectedCategory={selectedCategory}
                                onCategoryChange={setSelectedCategory}
                            />
                        </div>

                        {/* 프로젝트 카드 그리드 */}
                        <div className="mt-6 mx-5 grid grid-cols-2 gap-x-[12px] gap-y-[14px]">
                            {mockProjects.map(project => (
                                <RecommendationProjectCard 
                                    key={project.id}
                                    project={project} 
                                    variant="list" 
                                />
                            ))}
                        </div>
                    </ContentBox>
                </div>
            </div>
        </>
    );
};

export default ProjectListPage;