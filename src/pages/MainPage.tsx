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
import CallToAction from '@/components/main/CallToAction';
import Footer from '@/components/main/Footer'

const MainPage = () => {
    return (
        <div className="relative">
            {/* 배경 레이어 - 뷰포트 전체 너비 */}
            <div className="fixed top-[64px] left-0 right-0 bottom-0 bg-bg-gray -z-10" />
            
            <div className="relative mt-[64px] z-0">
                {/* 슬라이더 - 흰색 배경 */}
                <section className="w-full mb-16">
                    <Slider />
                </section>

                {/* 분야별 창작자 탐색 섹션 */}
                <section className="w-[1128px] mx-auto mb-[112px]">
                    <CategoryFilter />
                </section>
                
                {/* 지금 매칭 가능한 넥터, 모집 중인 프로젝트 */}
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
                <section className="w-[1233px] mx-auto mt-[50px]">
                    <RecommendationMember />
                </section>
                
                {/* NECT 가이드 섹션 - 흰색 배경 전체 너비 */}
                <section className="relative bg-white py-16 z-10 w-screen -ml-[calc((100vw-100%)/2)]">
                    <div className="w-[1128px] mx-auto grid grid-cols-2 gap-6">
                        <AboutNect />
                    </div>
                </section>

                {/* 통계 섹션 - 흰색 배경 전체 너비 */}
                <section className="relative bg-white py-20 z-10 w-screen -ml-[calc((100vw-100%)/2)]">
                    <div className="w-[1128px] mx-auto">
                        <Statistics />
                    </div>
                </section>
                
                {/* 프로젝트 쇼케이스 */}
                <section className="relative z-10 w-screen -ml-[calc((100vw-100%)/2)]">
                    <div className="h-[1064px]">
                    <ProjectShowcase />
                    </div>
                </section>
                
                {/* 소식 섹션 */}
                <section className="w-[1233px] mx-auto mt-[122px]">
                    <NewsSection />
                </section>

                {/* CTA 섹션 */}
                <section className="relative bg-white py-20 z-10 w-screen -ml-[calc((100vw-100%)/2)]">
                    <div className="w-[1233px] mx-auto mt-[96px]">
                    <CallToAction />
                    </div>
                </section>

                {/* footer - 흰색 배경 */}
                <section className="relative bg-white py-20 z-10 w-screen -ml-[calc((100vw-100%)/2)]">
                    <div className='relative w-full mt-[260px] bg-white z-10'>
                        <Footer />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default MainPage;