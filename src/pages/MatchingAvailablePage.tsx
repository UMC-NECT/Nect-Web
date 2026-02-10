import { useState } from 'react';
import { useParams } from 'react-router';
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
import { useMemberDetail } from '@/hooks/queries/member/useMemberDetail';

const MatchingAvailablePage = () => {
    const { userId } = useParams<{ userId: string }>();
    const { data: memberData, isLoading, error } = useMemberDetail(Number(userId));

    const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
    const [isSelectMultipleModalOpen, setIsSelectMultipleModalOpen] = useState(false);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isBlockedModalOpen, setIsBlockedModalOpen] = useState(false);
    const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
    
    const [matchingCount, setMatchingCount] = useState(0);
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
            setIsCancelModalOpen(true);
        } else if (matchingCount === 0) {
            setIsSelectModalOpen(true);
        } else if (matchingCount === 1) {
            setIsSelectMultipleModalOpen(true);
        } else if (matchingCount >= 2) {
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
        setIsCancelModalOpen(false);
    };

    // 디버깅용 로그 추가
    console.log('userId:', userId);
    console.log('memberData:', memberData);
    console.log('isLoading:', isLoading);
    console.log('error:', error);

    // 로딩 상태
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-neutral-500">로딩 중...</p>
            </div>
        );
    }

    // 에러 상태
    if (error) {
        console.error('API Error:', error);
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-500">멤버 정보를 불러올 수 없습니다</p>
                    <p className="text-sm text-neutral-500 mt-2">에러: {error.message}</p>
                </div>
            </div>
        );
    }

    // 데이터 없음
    if (!memberData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-red-500">멤버 데이터가 없습니다</p>
            </div>
        );
    }

    // API 데이터를 기존 Member 타입으로 변환
    const member = {
        name: memberData.name,
        role: 'Lead',
        position: memberData.role,
        email: memberData.email,
        isRecruiting: memberData.userStatus === 'JOB_SEEKING',
        jobTitle: memberData.interestedJob || '',
        field: memberData.interestedField || '',
        experience: memberData.careerDuration || '',
        introduction: memberData.bio || '',
        coreCompetencies: memberData.coreCompetencies?.split('\n') || [],
        portfolioKeywords: memberData.tags || [],
        designTools: (memberData.skills || [])
            .find(s => s.category === 'DESIGN')
            ?.skills.filter(skill => skill.isSelected).map(skill => skill.skillLabel) || [],
        recordTools: [],
        etcTools: [],
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
                        <h1 className="text-[28px] font-bold mt-1">지금 매칭 가능한 넥터</h1>
                        <button className="mt-4 text-xl font-semibold w-[135px] h-[48px] flex items-center justify-center gap-2.5 bg-neutral-100 border border-neutral-200 rounded-xl">
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
                        <MemberProfileDetail memberData={memberData} />
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