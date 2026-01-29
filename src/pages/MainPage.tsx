import Slider from '@/components/main/Slider';
import CategoryFilter from '@/components/main/CategoryFilter';
import RecommendationProject from '@/components/main/RecommendationProject';
import RecommendationMember from '@/components/main/RecommendationMember';
import UrgentProjects from '@/components/main/UrgentProjects';
import AvailableNecters from '@/components/main/AvailableNecters';
import AboutNect from '@/components/main/AboutNect';
import Statistics from '@/components/main/Statistics';
import ProjectShowcase from '@/components/main/ProjectShowcase';
import NewsSection from '@/components/main/NewsSection';

const MainPage = () => {
    return (
        <div className="mt-[64px]">
            {/* 슬라이더 */}
            <section className="w-full mb-16">
                <Slider />
            </section>

            {/* 분야별 창작자 탐색 섹션 */}
            <section className="w-[1128px] mx-auto mb-[112px]">
                <CategoryFilter />
            </section>
            
            {/* 지금 매칭 가능한 넥터, 모집 중인 프로젝트 - 2단 레이아웃 */}
            <section className="w-[1128px] mx-auto mb-16 flex gap-10">
                <div className="w-[552px]">
                    <AvailableNecters />
                </div>
                <div className="w-[552px]">
                    <UrgentProjects />
                </div>
            </section>
            
            {/* 나와 연관된 추천 프로젝트 */}
            <section className="w-[1233px] mx-auto mt-[112px]">
                <RecommendationProject />
            </section>

            {/* 나와 연관된 추천 팀원 */}
            <section className="w[1233px] mx-auto mt-[50px]">
                <RecommendationMember />
            </section>
            
            {/* NECT 가이드 섹션 - 2단 레이아웃 */}
            <section className="w-[1128px] mx-auto mb-24 grid grid-cols-2 gap-6">
                <AboutNect />
            </section>
            
            {/* 통계 섹션 */}
            <section className="mb-20">
                <Statistics />
            </section>
            
            {/* 프로젝트 쇼케이스 - 회색 배경, 전체 너비 */}
            <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
                <div className="mx-auto">
                    <ProjectShowcase />
                </div>
            </section>
            
            {/* 소식 섹션 */}
            <section className="mb-16">
                <NewsSection />
            </section>
        </div>
    );
};

export default MainPage;