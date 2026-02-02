import { useState } from 'react';
import hamburger from '@/assets/icons/common/hamburger-bar.svg';
import chat from '@/assets/icons/common/message.svg';
import Breadcrumb from '@/components/common/Breadcrumb';
import ProjectInfoTab from '@/components/recruiting-projects/ProjectInfoTab';
import TeamMembersTab from '@/components/recruiting-projects/TeamMembersTab';
import MatchingRequestModal from '@/components/recruiting-projects/MatchingRequestModal';
import MatchingCancelModal from '@/components/recruiting-projects/MatchingCancelModal';
import MatchingBlockedModal from '@/components/recruiting-projects/MatchingBlockedModal';

const RecruitingProjectsPage = () => {
    const [activeTab, setActiveTab] = useState<'info' | 'members'>('info');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isBlockedModalOpen, setIsBlockedModalOpen] = useState(false);
    const [isMatching, setIsMatching] = useState(false);
    const [isCancelled, setIsCancelled] = useState(false); // 취소된 상태 추가
    const [isHovered, setIsHovered] = useState(false);

    // 포지션 색상 매핑
    const getPositionStyle = (position: string) => {
        const positionName = position.toLowerCase();

        const styles: Record<string, string> = {
            'pm': 'bg-tag-purple',
            'design': 'bg-tag-pink',
            'frontend': 'bg-tag-green',
            'backend': 'bg-tag-blue',
            'develop': 'bg-tag-blue',
            'server': 'bg-tag-orange',
            'data': 'bg-tag-yellow',
        };

        return styles[positionName] || 'bg-tag-yellow';
    };

    const handleMatchingComplete = () => {
        setIsMatching(true);
        setIsModalOpen(false);
    };

    const handleMatchingButtonClick = () => {
        if (isMatching) {
            setIsCancelModalOpen(true);
        } else if (isCancelled) {
            setIsBlockedModalOpen(true);
        } else {
            setIsModalOpen(true);
        }
    };

    const handleCancelConfirm = () => {
        setIsMatching(false);
        setIsCancelled(true);
        setIsCancelModalOpen(false);
    };

    return (
        <div className="relative bg-neutral-50 w-screen -ml-[calc((100vw-100%)/2)] -mr-[calc((100vw-100%)/2)] min-h-screen px-8 py-8 pb-[120px]">
            <div className="max-w-[1200px] mx-auto flex flex-col items-center">

                <div className="w-[916px]">
                    <div className="mt-[36px]">
                    <Breadcrumb 
                        items={[
                            { label: '홈', path: '/' },
                            { label: '모집 중인 프로젝트', path: '/recruiting-projects' },
                            { label: '넥트(NECT)' }
                        ]} 
                    />
                </div>
                    <div className=' mt-8 flex items-center justify-between'>
                        <h1 className="text-3xl font-bold mt-1">모집 중인 프로젝트</h1>
                    <button className="mt-4 text-xl font-semibold w-[135px] h-[48px] flex items-center justify-center gap-2.5 border border-neutral-400 rounded-md">
                        <img src={hamburger} alt="Menu" />
                        <p className='text-[14px] text-neutral-400'>목록으로 가기</p>
                    </button>
                    </div>
                </div>

                <div className="mt-9 w-[916px] bg-white rounded-lg border border-neutral-200 shadow-sm">
                    <div className='w-full pl-[46px] pt-[56px] pr-[46px]'>
                        <div className='flex justify-between w-full'>
                            <h2 className="font-bold text-[28px]">넥트(NECT)</h2>
                            <div className='flex gap-[10px] h-[48px] items-center'>
                                {/* 메시지 버튼 */}
                                <div className='relative group'>
                                    <img 
                                        src={chat} 
                                        alt="Chat" 
                                        className='w-[48px] h-[48px] p-[10px] cursor-pointer hover:bg-neutral-100 rounded-lg' 
                                    />
                                    {/* 호버시 툴팁 */}
                                    <div className='absolute top-[58px] right-[-68px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none'>
                                        <div className='w-[173px] bg-neutral-500 text-white px-[4px] py-[8px] rounded-lg text-[11px] flex items-center justify-center whitespace-nowrap'>
                                            대화 요청으로 메세지를 나눠보세요 !
                                        </div>
                                        {/* 화살표 */}
                                        <div className='absolute top-[-5px] right-[85px] w-3 h-3 bg-neutral-500 transform rotate-45'></div>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={handleMatchingButtonClick}
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                    className={`w-[130px] h-[48px] rounded-lg font-semibold text-[16px] transition-colors
                                        ${isMatching && isHovered
                                            ? 'bg-primary-300-light text-primary-500-normal hover:bg-primary-300-light'
                                            : isMatching 
                                                ? 'bg-primary-100-light text-primary-500-normal'
                                                : 'bg-primary-400-normal text-neutral-50 hover:bg-primary-500-normal'
                                        }`}
                                >
                                    {isMatching && isHovered ? '신청 취소' : isMatching ? '매칭 신청 중' : '매칭 신청'}
                                </button>

                                {/* 모달들 */}
                                <MatchingRequestModal 
                                    isOpen={isModalOpen}
                                    onClose={() => setIsModalOpen(false)}
                                    onMatchingComplete={handleMatchingComplete}
                                    getPositionStyle={getPositionStyle}
                                />

                                <MatchingCancelModal 
                                    isOpen={isCancelModalOpen}
                                    onClose={() => setIsCancelModalOpen(false)}
                                    onConfirm={handleCancelConfirm}
                                />

                                <MatchingBlockedModal 
                                    isOpen={isBlockedModalOpen}
                                    onClose={() => setIsBlockedModalOpen(false)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 탭 */}
                    <div className='mt-[28px] w-full'>
                        <div className='flex w-[240px] h-[50px] border-b border-neutral-200 ml-[46px]'>
                            <button
                                onClick={() => setActiveTab('info')}
                                className={`w-[120px] py-3 font-semibold text-[16px] border-b-3 transition-colors ${
                                    activeTab === 'info'
                                        ? 'border-primary-500-normal text-primary-500-normal'
                                        : 'border-transparent text-neutral-400 hover:text-neutral-600'
                                }`}
                            >
                                프로젝트 정보
                            </button>
                            <button
                                onClick={() => setActiveTab('members')}
                                className={`w-[120px] py-3 font-semibold text-[16px] border-b-3 transition-colors ${
                                    activeTab === 'members'
                                        ? 'border-primary-500-normal text-primary-500-normal'
                                        : 'border-transparent text-neutral-400 hover:text-neutral-600'
                                }`}
                            >
                                팀원 정보
                            </button>
                        </div>
                    </div>

                    {/* 탭 컨텐츠 */}
                    <div className='px-[46px] py-[40px] pb-[56px]'>
                        {activeTab === 'info' && <ProjectInfoTab getPositionStyle={getPositionStyle} />}
                        {activeTab === 'members' && <TeamMembersTab getPositionStyle={getPositionStyle} />}
                    </div>
                </div>
                </div>
            </div>
    );
};

export default RecruitingProjectsPage;