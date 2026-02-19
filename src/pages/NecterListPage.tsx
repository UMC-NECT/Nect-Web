import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router';
import Breadcrumb from '@/components/common/Breadcrumb';
import ContentBox from '@/components/main/ContentBox';
import TabGroup from '@/components/main/TabGroup';
import CategoryDropdown from '@/components/main/CategoryDropdown';
import RecommendationMemberCard from '@/components/common/RecommendationMemberCard';
import { useMatchableMembers } from '@/hooks/queries/home';
import { useOnboardingEnums } from '@/hooks/auth/useOnboardingEnums';
import { TABS, PART_MAP } from '@/constants/filters';
import LoadingScreen from '@/components/splash/LoadingScreen';

const NecterListPage = () => {
    const [selectedTab, setSelectedTab] = useState('전체');
    const { data: members, isLoading, error } = useMatchableMembers(50);
    const { interestFields } = useOnboardingEnums();

    // enum 기준 카테고리 목록 (라벨 ↔ value 정확 매칭)
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

    // 탭 + 카테고리(interestField) 필터링
    const filteredMembers = useMemo(() => {
        if (!members) return []
        return members.filter(member => {
            if (selectedTab !== '전체') {
                if (!member.part) {
                    if (selectedTab !== '기타') return false
                } else {
                    const memberPart = PART_MAP[member.part] || '기타'
                    if (memberPart !== selectedTab) return false
                }
            }
            if (selectedCategory === '전체') return true
            if (selectedCategory === '기타') {
                if (categoryEnumValue) return member.interestField === categoryEnumValue
                return !member.interestField
            }
            return member.interestField === categoryEnumValue
        })
    }, [members, selectedTab, selectedCategory, categoryEnumValue])

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
                            { label: '넥터 찾기', path: '/necters' },
                            { label: '지금 가능한 넥터' },
                            { label: selectedCategory }
                        ]}
                    />

                    <h1 className="heading-2 font-bold mt-7">
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