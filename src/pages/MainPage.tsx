import Slider from '@/components/main/Slider';
import CategoryFilter from '@/components/main/CategoryFilter';
import RecommendedProjects from '@/components/main/RecommendedProjects';
import UrgentProjects from '@/components/main/UrgentProjects';
import RecommendationSection from '@/components/main/RecommendationSection';
import AboutNect from '@/components/main/AboutNect';
import Statistics from '@/components/main/Statistics';
import ProjectShowcase from '@/components/main/ProjectShowcase';
import NewsSection from '@/components/main/NewsSection';

const MainPage = () => {
    return (
        <div className="mt-[162px]">
            {/* 슬라이더 */}
            <section className="w-full mb-16">
                <Slider />
            </section>

            {/* 분야별 창작자 탐색 섹션 */}
            <section className="w-[1200px] mx-auto mb-16">
                <CategoryFilter />
            </section>
            
            {/* 프로젝트 추천 섹션 - 2단 레이아웃 */}
            <section className="w-[1200px] mx-auto mb-16 flex gap-10">
                <div className="w-[600px]">
                    <RecommendedProjects />
                </div>
                <div className="w-[600px]">
                    <UrgentProjects />
                </div>
            </section>
            
            {/* 추천 섹션 */}
            <section className="mb-16">
                <RecommendationSection />
            </section>
            
            {/* NECT 가이드 섹션 - 2단 레이아웃 */}
            <section className="w-[1200px] mx-auto mb-16 grid grid-cols-2 gap-6">
                <AboutNect />
            </section>
            
            {/* 통계 섹션 */}
            <section className="mb-16">
                <Statistics />
            </section>
            
            {/* 프로젝트 쇼케이스 - 회색 배경, 전체 너비 */}
            <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mb-16">
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