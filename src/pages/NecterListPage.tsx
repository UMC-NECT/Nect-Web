import { useState, useEffect } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import ContentBox from '@/components/main/ContentBox';
import TabGroup from '@/components/main/TabGroup';
import CategoryDropdown from '@/components/main/CategoryDropdown';
import RecommendationMemberCard from '@/components/common/RecommendationMemberCard';
import BackgroundImage from '@/assets/icons/common/projectBackground.svg';
import CharacterImage from '@/assets/icons/main/profile.svg';
import { useMatchableMembers } from '@/hooks/queries/home';

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

const NecterListPage = () => {
    const [selectedTab, setSelectedTab] = useState('디자이너');
    const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
    
    // API 호출 (100개 요청)
    const { data: members, isLoading, error } = useMatchableMembers(100);

    useEffect(() => {
        document.body.style.backgroundColor = '#FAFAFA';
        
        return () => {
            document.body.style.backgroundColor = '';
        };
    }, []);

    return (
        <div className="py-16">
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

                    {!isLoading && !error && members && members.length === 0 && (
                        <div className="mt-6 mx-5 flex justify-center items-center h-64">
                            <p className="text-neutral-500">매칭 가능한 넥터가 없습니다</p>
                        </div>
                    )}

                    {/* 넥터 카드 그리드 */}
                    {!isLoading && !error && members && members.length > 0 && (
                        <div className="mt-6 mx-5 grid grid-cols-3 gap-x-[12px] gap-y-[14px]">
                            {members.map(member => (
                                <RecommendationMemberCard 
                                    key={member.userId}
                                    member={{
                                        id: member.userId,
                                        background: BackgroundImage,
                                        character: member.imageUrl || CharacterImage,
                                        category: member.status,
                                        name: member.name,
                                        position: member.part,
                                        description: member.introduction,
                                    }} 
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

export default NecterListPage;