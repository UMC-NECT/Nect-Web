import { useState } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import ContentBox from '@/components/main/ContentBox';
import TabGroup from '@/components/main/TabGroup';
import CategoryDropdown from '@/components/main/CategoryDropdown';
import RecommendationMemberCard from '@/components/common/RecommendationMemberCard';
import BackgroundImage from '@/assets/icons/common/projectBackground.svg';  // 배경 이미지
import CharacterImage from '@/assets/icons/main/profile.svg'; // 캐릭터 이미지

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

// 테스트용 넥터 데이터
const mockNecter = {
    id: 1,
    background: BackgroundImage,
    character: CharacterImage,
    category: '매칭가능',
    name: '김넥터',
    position: 'Product Designer',
    description: '안녕하세요. UI/UX 디자이너 김넥터입니다. 사용자 중심의 디자인을 추구합니다.',
};

const mockNecters = Array.from({ length: 13 }, (_, index) => ({
    ...mockNecter,
    id: index + 1
}));

const NecterListPage = () => {
    const [selectedTab, setSelectedTab] = useState('디자이너');
    const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);

    return (
        <div className="relative">
            {/* 전체 배경 - 화면 전체 너비 */}
            <div className="absolute inset-0 bg-neutral-50 w-screen left-1/2 -translate-x-1/2 h-[2100px]" />
            
            {/* 컨텐츠 */}
            <div className="relative py-16 pb-32">
                <div className="my-9 w-[912px] h-[86px] mx-auto">
                    <div className='ml-7'>
                        <Breadcrumb 
                            items={[
                                { label: '홈', path: '/' },
                                { label: '넥터 찾기', path: '/necters' },
                                { label: '지금 가능한 넥터' },
                                { label: selectedCategory }
                            ]}
                        />
                        
                        <h1 className="mt-7 text-[40px] font-bold">
                            지금 가능한 넥터
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

                        {/* 넥터 카드 그리드 */}
                        <div className="mt-6 mx-5 grid grid-cols-3 gap-x-[12px] gap-y-[14px] pb-12">
                            {mockNecters.map(necter => (
                                <RecommendationMemberCard 
                                    key={necter.id}
                                    member={necter} 
                                    variant="list" 
                                />
                            ))}
                        </div>
                    </ContentBox>
                </div>
            </div>
        </div>
    );
};

export default NecterListPage;