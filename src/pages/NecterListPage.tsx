import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import Breadcrumb from '@/components/common/Breadcrumb';
import ContentBox from '@/components/main/ContentBox';
import TabGroup from '@/components/main/TabGroup';
import CategoryDropdown from '@/components/main/CategoryDropdown';
import RecommendationMemberCard from '@/components/common/RecommendationMemberCard';
import { useMatchableMembers } from '@/hooks/queries/home';
import { CATEGORIES, TABS, PART_MAP } from '@/constants/filters';

const NecterListPage = () => {
    const [selectedTab, setSelectedTab] = useState('전체');
    const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);

    // API 호출 (100개 요청)
    const { data: members, isLoading, error } = useMatchableMembers(100);

    // 탭에 따라 필터링
    const filteredMembers = members?.filter(member => {
        if (selectedTab === '전체') return true;

        // part가 null이면 '기타'로 처리
        if (!member.part) {
            return selectedTab === '기타';
        }

        const memberPart = PART_MAP[member.part] || '기타';
        return memberPart === selectedTab;
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
                            { label: '넥터 찾기', path: '/necters' },
                            { label: '지금 가능한 넥터' },
                            { label: selectedCategory }
                        ]}
                    />

                    <h1 className="mt-7 text-[28px] font-bold">
                        지금 가능한 넥터
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

                    {!isLoading && !error && filteredMembers.length === 0 && (
                        <div className="mt-6 mx-5 flex justify-center items-center h-64">
                            <p className="text-neutral-500">매칭 가능한 넥터가 없습니다</p>
                        </div>
                    )}

                    {/* 넥터 카드 그리드 */}
                    {!isLoading && !error && filteredMembers.length > 0 && (
                        <div className="mt-6 mx-5 grid grid-cols-3 gap-x-[12px] gap-y-[14px]">
                            {filteredMembers.map(member => (
                                <Link 
                                    key={member.userId}
                                    to={`/matching-available/${member.userId}`}
                                >
                                    <RecommendationMemberCard 
                                        member={member}
                                        variant="list" 
                                    />
                                </Link>
                            ))}
                        </div>
                    )}
                </ContentBox>
            </div>
        </div>
    );
};

export default NecterListPage;