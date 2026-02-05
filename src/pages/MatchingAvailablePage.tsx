import { useState } from 'react';
import hamburger from '@/assets/icons/common/hamburger-bar.svg';
import chat from '@/assets/icons/common/message.svg';
import Breadcrumb from '@/components/common/Breadcrumb';
import SelectProjectModal from '@/components/matching-available/SelectProjectModal';
import SelectMultipleProjectModal from '@/components/matching-available/SelectMultipleProjectModal';
import MatchingRequestConfirmModal from '@/components/matching-available/MatchingRequestConfirmModal';
import MatchingLimitModal from '@/components/matching-available/MatchingLimitModal';
import MatchingRequestModal from '@/components/recruiting-projects/MatchingRequestModal';
import MatchingSuccessModal from '@/components/recruiting-projects/MatchingSuccessModal';
import MatchingCancelModal from '@/components/recruiting-projects/MatchingCancelModal';
import MatchingBlockedModal from '@/components/recruiting-projects/MatchingBlockedModal';
import MemberProfileHeader from '@/components/recruiting-projects/MemberProfileHeader';
import MemberProfileDetail from '@/components/recruiting-projects/MemberProfileDetail';
import type { Member } from '@/types/member';

const MatchingAvailablePage = () => {
    const member: Member = {
        name: '이방토',
        role: 'Lead',
        position: 'Design',
        email: 'ellaella2@hanyang.ac.kr',
        isRecruiting: true,
        jobTitle: 'UX/UI Product Designer / UX researcher',
        field: 'UX/UI 브랜딩/제품',
        experience: '6개월',
        introduction: '디자인 프로젝트 경험이 많고 꼼꼼한 UX.UI 디자이너 입니다!\nUX리서치/ 브랜딩/ 패키지/ 그래픽 및 일러스트 모두 가능합니다.',
        coreCompetencies: [
            '사용자 경험을 기반으로 한 UX 전략 도출 및 서비스 프로토타입 설계 가능',
            'UX 리서치 및 데이터 드리븐을 통한 가설 설정, 지표 개선 경험'
        ],
        portfolioKeywords: ['#프트폴리오 집중', '#신중한 설계자'],
        designTools: ['Figma', 'Photoshop', 'Illustrator', 'Premiere Pro', 'After Effect', 'Procreate'],
        recordTools: ['Notion', 'UX Research'],
        etcTools: ['Claude', 'consecutive interpretation']
    };

    const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
    const [isSelectMultipleModalOpen, setIsSelectMultipleModalOpen] = useState(false);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isBlockedModalOpen, setIsBlockedModalOpen] = useState(false);
    const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
    
    const [matchingCount, setMatchingCount] = useState(0); // 신청 횟수
    const [isMatching, setIsMatching] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

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

    const handleMatchingButtonClick = () => {
        if (isMatching) {
            // 신청 중일 때 클릭하면 취소 모달
            setIsCancelModalOpen(true);
        } else if (matchingCount === 0) {
            // 첫 번째 신청 - 프로젝트 1개
            setIsSelectModalOpen(true);
        } else if (matchingCount === 1) {
            // 두 번째 신청 - 프로젝트 2개
            setIsSelectMultipleModalOpen(true);
        } else if (matchingCount >= 2) {
            // 세 번째 신청 - 파트 초과
            setIsLimitModalOpen(true);
        }
    };

    const handleMatchingSuccess = () => {
        setMatchingCount(matchingCount + 1);
        setIsMatching(true);
        setIsSuccessModalOpen(false);
    };

    const handleCancelConfirm = () => {
        setIsMatching(false);
        // matchingCount는 그대로 유지 (신청 횟수는 줄이지 않음)
        setIsCancelModalOpen(false);
    };

    // 액션 버튼들
    const actionButtons = (
        <>
            {/* 메시지 버튼 */}
            <div className='relative group'>
                <img 
                    src={chat} 
                    alt="Chat" 
                    className='w-[48px] h-[48px] p-[10px] cursor-pointer hover:bg-neutral-100 rounded-lg' 
                />
                <div className='absolute top-[58px] right-[-68px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none'>
                    <div className='w-[173px] bg-neutral-500 text-white px-[4px] py-[8px] rounded-lg text-[11px] flex items-center justify-center whitespace-nowrap'>
                        대화 요청으로 메세지를 나눠보세요 !
                    </div>
                    <div className='absolute top-[-5px] right-[85px] w-3 h-3 bg-neutral-500 transform rotate-45'></div>
                </div>
            </div>
            
            {/* 매칭 신청 버튼 */}
            <button 
                onClick={handleMatchingButtonClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`w-[130px] h-[48px] rounded-xl font-semibold text-[16px] transition-colors
                    ${isMatching && isHovered
                        ? 'bg-primary-300-light text-primary-500-normal hover:bg-primary-300-light'
                        : isMatching 
                            ? 'bg-primary-100-light text-primary-500-normal'
                            : 'bg-primary-400-normal text-neutral-50 hover:bg-primary-500-normal'
                    }`}
            >
                {isMatching && isHovered ? '신청 취소' : isMatching ? '매칭 신청 중' : '매칭 신청'}
            </button>
        </>
    );

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
                    <div className='mt-8 flex items-center justify-between'>
                        <h1 className="text-3xl font-bold mt-1">지금 매칭 가능한 넥터</h1>
                        <button className="mt-4 text-xl font-semibold w-[135px] h-[48px] flex items-center justify-center gap-2.5 border border-neutral-400 rounded-xl">
                            <img src={hamburger} alt="Menu" />
                            <p className='text-[14px] text-neutral-400'>목록으로 가기</p>
                        </button>
                    </div>
                </div>

                <div className="mt-9 w-[916px] bg-white rounded-lg border border-neutral-200 shadow-sm">
                    <div className='w-full pl-[46px] pt-[56px] pr-[46px] pb-[56px]'>
                        <MemberProfileHeader 
                            member={member}
                            actionButtons={actionButtons}
                        />
                    </div>
                    <div className='mt-[20px] pt-[40px] pb-[40px] px-[56px]'>
                        <MemberProfileDetail member={member} />
                    </div>
                </div>

                {/* 모달들 */}
                {/* 첫 번째 신청: 프로젝트 1개 */}
                <SelectProjectModal 
                    isOpen={isSelectModalOpen}
                    onClose={() => setIsSelectModalOpen(false)}
                    onConfirm={() => {
                        setIsSelectModalOpen(false);
                        setIsRequestModalOpen(true);
                    }}
                />

                {/* 두 번째 신청: 프로젝트 2개 */}
                <SelectMultipleProjectModal 
                    isOpen={isSelectMultipleModalOpen}
                    onClose={() => setIsSelectMultipleModalOpen(false)}
                    onConfirm={() => {
                        setIsSelectMultipleModalOpen(false);
                        setIsRequestModalOpen(true);
                    }}
                />

                {/* 파트 선택 */}
                <MatchingRequestModal 
                    isOpen={isRequestModalOpen}
                    onClose={() => setIsRequestModalOpen(false)}
                    onMatchingComplete={() => {
                        setIsRequestModalOpen(false);
                        setIsConfirmModalOpen(true);
                    }}
                    getPositionStyle={getPositionStyle}
                />

                {/* 매칭 요청 확인 */}
                <MatchingRequestConfirmModal 
                    isOpen={isConfirmModalOpen}
                    onClose={() => setIsConfirmModalOpen(false)}
                    onConfirm={() => {
                        setIsConfirmModalOpen(false);
                        setIsSuccessModalOpen(true);
                    }}
                    memberName={member.name}
                    position={member.position}
                />

                {/* 매칭 완료 */}
                <MatchingSuccessModal 
                    isOpen={isSuccessModalOpen}
                    onClose={handleMatchingSuccess}
                />

                {/* 취소 확인 */}
                <MatchingCancelModal 
                    isOpen={isCancelModalOpen}
                    onClose={() => setIsCancelModalOpen(false)}
                    onConfirm={handleCancelConfirm}
                />

                {/* 차단 모달 */}
                <MatchingBlockedModal 
                    isOpen={isBlockedModalOpen}
                    onClose={() => setIsBlockedModalOpen(false)}
                />

                {/* 파트 초과 모달 */}
                <MatchingLimitModal 
                    isOpen={isLimitModalOpen}
                    onClose={() => setIsLimitModalOpen(false)}
                    onConfirm={() => setIsLimitModalOpen(false)}
                />
            </div>
        </div>
    );
};

export default MatchingAvailablePage;