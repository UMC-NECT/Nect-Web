import logo from '@/assets/icons/common/nect-logo.svg'
import { useNavigate } from 'react-router'
import { useState } from 'react'
import CheckItem from '@/components/analyze-report/CheckItem'
import WeeklyRoadmapItem from '@/components/analyze-report/WeeklyRoadmapItem'
import { weeklyRoadmapData, checkPointsData } from '@/constants/analyzeReportData'

const AnalyzeReportPage = () => {
    const navigate = useNavigate()
    const [expandedWeek, setExpandedWeek] = useState<number | null>(null)

    const toggleWeek = (index: number) => {
        setExpandedWeek(expandedWeek === index ? null : index)
    }

    return (
        <div className="flex flex-col items-center justify-start min-h-screen pt-[100px]">
            <div className="flex flex-col items-center px-4 mb-4">
                <img src={logo} alt="NECT Logo" className="w-[226px] h-[40px] mb-[26px]" />
                <h1 className="text-[32px] font-bold text-neutral-900 text-center">프로젝트 아이디어 분석 리포트</h1>
            </div>

            <div className='relative bg-bg-gray rounded-[100px] z-10 w-screen -ml-[calc((100vw-100%)/2)] -mr-[calc((100vw-100%)/2)] min-h-screen py-8 mt-[52px]'>
                <div className="mt-[80px] flex flex-col justify-center items-center">
                    <h2 className='font-semibold text-[14px] text-primary-600-normal'>NECT Analyze Report</h2>
                    <p className="font-bold text-[28px] mt-4 mb-2">시루님의 프로젝트 [커넥트]</p>
                    <p className="text-[20px] text-neutral-900 text-center">
                        아이디어 분석과 팀원 매칭부터 협업 보드까지, 사이드 프로젝트 웹사이트 개발 아이디어를 가지고 계시군요 !
                    </p>
                </div>
                
                <div className='mt-[52px] w-[940px] mx-auto'>
                    {/* 01 프로젝트 기본 정보를 추천드려요 */}
                    <div className='mb-22 flex gap-6'>
                        <h2 className='font-bold text-[28px] flex-shrink-0'>01</h2>
                        <div className='flex-1'>
                            <p className='font-bold text-[24px] text-primary-600-normal mb-8 mt-1'>
                                프로젝트 기본 정보를 추천드려요!
                            </p>
                            
                            <div className='mt-6 mb-4'>
                                <h3 className='font-semibold text-[18px] mb-3'>주요 프로젝트 이름</h3>
                                <div className='flex flex-col gap-2 bg-white rounded-lg p-6 mb-4'>
                                    <span className='py-1 text-primary-600-normal text-[18px] font-semibold'>넥트(Nect), 커넥트, 넥트장</span>
                                    <p className='text-[16px] text-neutral-800 mb-2'>
                                        연결되는 이미지를 강화하는 것이 좋습니다 !
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className='font-semibold text-[18px] mb-3'>예상 기간</h3>
                                <p className='bg-white rounded-lg p-6 text-[16px] text-neutral-800'>
                                    프로젝트 [넥트]의 완성을 위해 최소 8주의 기간이 필요해요.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 02 원활한 진행을 위한 팀 구성은? */}
                    <div className='mb-22 flex gap-6'>
                        <h2 className='font-bold text-[28px] flex-shrink-0'>02</h2>
                        <div className='flex-1'>
                            <p className='font-bold text-[24px] text-primary-600-normal mb-8'>
                                원활한 진행을 위한 팀 구성은?
                            </p>
                            
                            <div className='bg-white rounded-lg p-6'>
                                <h3 className='font-semibold text-[18px] mb-4'>
                                    최소 4파트, 총 6명의 팀원이 필요해요!
                                </h3>
                                <div className='flex flex-wrap gap-2 h-[24px] text-neutral-700'>
                                    <span className='px-3 py-1 bg-tag-purple rounded-md text-[14px]'>PM(1)</span>
                                    <span className='px-3 py-1 bg-tag-pink rounded-md text-[14px]'>Design(1)</span>
                                    <span className='px-3 py-1 bg-tag-green rounded-md text-[14px]'>Frontend(2)</span>
                                    <span className='px-3 py-1 bg-tag-blue rounded-md text-[14px]'>Backend(2)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 03 프로젝트 보완할 점을 발견했어요! */}
                    <div className='mb-22 flex gap-6'>
                        <h2 className='font-bold text-[28px] flex-shrink-0'>03</h2>
                        <div className='flex-1'>
                            <p className='font-bold text-[24px] text-primary-600-normal mb-8 mt-1'>
                                프로젝트 보완할 점을 발견했어요!
                            </p>
                            
                            <div className='space-y-4'>
                                {checkPointsData.map((point, index) => (
                                    <CheckItem
                                        key={index}
                                        checkNumber={index + 1}
                                        title={point.title}
                                        description={point.description}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 04 주차별 로드맵 생성 */}
                    <div className='mb-16 flex gap-6'>
                        <h2 className='font-bold text-[28px] flex-shrink-0'>04</h2>
                        <div className='flex-1'>
                            <p className='font-bold text-[24px] text-primary-600-normal mb-8 mt-1'>
                                주차별 로드맵을 생성했어요!
                            </p>
                            
                            <div className='flex'>
                                {/* 왼쪽 라인 */}
                                <div className='flex flex-col items-center mr-5 mt-3'>
                                    {weeklyRoadmapData.map((item, index) => (
                                        <div key={index} className='flex flex-col items-center'>
                                            <div className='w-[60px] h-[40px] bg-primary-500-normal text-white rounded-md flex items-center justify-center text-[16px] font-semibold'>
                                                {item.week}
                                            </div>
                                            {index < weeklyRoadmapData.length - 1 && (
                                                <div 
                                                    className='w-[2px] border-l-2 border-dashed border-primary-300-light transition-all duration-300'
                                                    style={{
                                                        height: expandedWeek === index ? '200px' : '37.5px'
                                                    }}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* 오른쪽 컨텐츠 */}
                                <div className='flex-1 space-y-[18px]'>
                                    {weeklyRoadmapData.map((item, index) => (
                                        <div key={index}>
                                            <WeeklyRoadmapItem
                                                title={item.title}
                                                details={item.details}
                                                isExpanded={expandedWeek === index}
                                                onToggle={() => toggleWeek(index)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 버튼들 */}
                    <div className='flex justify-center gap-4 mt-16 mb-8'>
                        <button 
                            onClick={() => navigate('/idea-analyze')}
                            className='w-[200px] h-[56px] border-2 border-gray-300 text-gray-700 font-semibold text-[16px] rounded-2xl hover:bg-gray-50 transition-colors'
                        >
                            아이디어 수정하기
                        </button>
                        <button 
                            className='w-[200px] h-[56px] bg-primary-400-normal text-white font-semibold text-[16px] rounded-2xl hover:bg-primary-500-normal transition-colors'
                        >
                            프로젝트 생성하기
                        </button>
                    </div>
                </div>
            </div>
            
            {/* 홈으로 이동 */}
            <div className='flex justify-center mb-80'>
                <button 
                    onClick={() => navigate('/')}
                    className='text-gray-600 text-[14px] underline underline-offset-4 m-[44px] cursor-pointer'
                >
                    홈으로 이동
                </button>
            </div>
        </div>
    );
};

export default AnalyzeReportPage;