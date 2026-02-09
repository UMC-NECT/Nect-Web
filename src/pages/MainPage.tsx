import Slider from '@/components/main/Slider';
import RecommendationProject from '@/components/main/RecommendationProject';
import RecommendationMember from '@/components/main/RecommendationMember';
import UrgentProjects from '@/components/main/UrgentProjects';
import AvailableNecters from '@/components/main/AvailableNecters';
import AboutNect from '@/components/main/AboutNect';
import Statistics from '@/components/main/Statistics';
import ProjectShowcase from '@/components/main/ProjectShowcase';
import NewsSection from '@/components/main/NewsSection';
import CallToAction from '@/components/main/CallToAction';
import Footer from '@/components/common/Footer'
import { LOCAL_STORAGE_KEY } from '@/constants/key';
import { useEffect, useState } from 'react';

const MainPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(
        !!localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
    );

    useEffect(() => {
        // 1초마다 로그인 상태 체크
        const interval = setInterval(() => {
            const currentLoginState = !!localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN);
            setIsLoggedIn(currentLoginState);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative">
            {/* 배경 레이어 - 뷰포트 전체 너비 */}
            <div className="fixed top-[64px] left-0 right-0 bottom-0 bg-bg-gray -z-10" />

            <div className="relative mt-16.5 z-0">
                {/* 슬라이더 */}
                <section className="w-full mb-12">
                    <Slider />
                </section>

                {/* 지금 매칭 가능한 넥터, 모집 중인 프로젝트 */}
                <section className="w-282 mt-24 mx-auto mb-28 flex gap-10">
                    <div className="w-138">
                        <AvailableNecters />
                    </div>
                    <div className="w-138">
                        <UrgentProjects />
                    </div>
                </section>

                {/* 나와 연관된 추천 프로젝트 */}
                <section className="">
                    <RecommendationProject />
                </section>

                {/* 나와 연관된 추천 팀원 */}
                <section>
                    <RecommendationMember />
                </section>

                {/* NECT 가이드 섹션 - 흰색 배경 전체 너비 */}
                <section className="relative bg-white py-16 z-10 w-screen -ml-[calc((100vw-100%)/2)]">
                    <div className="w-282 mx-auto grid grid-cols-2 gap-6">
                        <AboutNect />
                    </div>
                </section>

                {/* 통계 섹션 - 흰색 배경 전체 너비 */}
                <section className="relative bg-white py-[30px] z-10 w-screen -ml-[calc((100vw-100%)/2)]">
                    <div className="w-[1128px] mx-auto">
                        <Statistics />
                    </div>
                </section>

                {/* 프로젝트 쇼케이스 */}
                <section className="relative z-10 w-screen -ml-[calc((100vw-100%)/2)]">
                    <div className="h-[948px]">
                    <ProjectShowcase />
                    </div>
                </section>

                {/* 소식 섹션 */}
                <section className="w-[1233px] h-[736px] mx-auto pt-[116px]">
                    <NewsSection />
                </section>

                {/* CTA 섹션 - 비로그인 시에만 표시 */}
                {!isLoggedIn && (
                    <section className="relative bg-white z-10 w-screen -ml-[calc((100vw-100%)/2)] border-b border-b-neutral-200">
                        <div className="w-[1233px] mx-auto">
                            <CallToAction />
                        </div>
                    </section>
                )}

                {/* footer - 흰색 배경 */}
                <section className="relative bg-white z-10 w-screen -ml-[calc((100vw-100%)/2)]">
                    <div className='relative w-full bg-white z-10'>
                        <Footer />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default MainPage;