import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import axios from 'axios';
import hamburger from '@/assets/icons/common/hamburger-bar.svg';
import chat from '@/assets/icons/common/message.svg';
import Breadcrumb from '@/components/common/Breadcrumb';
import ProjectInfoTab from '@/components/recruiting-projects/ProjectInfoTab';
import TeamMembersTab from '@/components/recruiting-projects/TeamMembersTab';
import MatchingRequestModal from '@/components/recruiting-projects/MatchingRequestModal';
import MatchingRequestConfirmModal from '@/components/matching-available/MatchingRequestConfirmModal';
import MatchingSuccessModal from '@/components/recruiting-projects/MatchingSuccessModal';
import MatchingCancelModal from '@/components/recruiting-projects/MatchingCancelModal';
import MatchingBlockedModal from '@/components/recruiting-projects/MatchingBlockedModal';
import { useProjectDetail, useProjectRecruitments } from '@/hooks/queries/project';
import { useMatchingUserToProjectMutation, useMatchingsSentQuery, useMatchingCancelMutation } from '@/hooks/mypage/useMatchingApi';

const RecruitingProjectsPage = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const { data: projectData, isLoading, error } = useProjectDetail(Number(projectId));
    const { data: recruitments } = useProjectRecruitments(Number(projectId));
    const matchingMutation = useMatchingUserToProjectMutation();
    const { data: sentMatchings } = useMatchingsSentQuery('project', 'pending');
    const cancelMutation = useMatchingCancelMutation();

    const [activeTab, setActiveTab] = useState<'info' | 'members'>('info');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isBlockedModalOpen, setIsBlockedModalOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [selectedField, setSelectedField] = useState<string>('');

    // 보낸 매칭 요청에서 현재 프로젝트에 대한 매칭 정보 계산
    const currentProjectMatching = useMemo(() => {
        if (sentMatchings?.body?.projectMatchings && projectId) {
            return sentMatchings.body.projectMatchings.find(
                (matching) => matching.projectId === Number(projectId)
            );
        }
        return undefined;
    }, [sentMatchings, projectId]);

    const isMatching = !!currentProjectMatching;
    
    // localStorage에서 matchingId 가져오기
    const getStoredMatchingId = () => {
        const stored = localStorage.getItem(`matching_${projectId}`);
        return stored ? Number(stored) : null;
    };
    
    const currentMatchingId = currentProjectMatching?.matchingId || getStoredMatchingId();

    // 포지션 색상 매핑
    const getPositionStyle = (position: string) => {
        const positionName = position.toLowerCase();

        const styles: Record<string, string> = {
            'pm': 'bg-roletag-purple',
            'design': 'bg-roletag-pink',
            'frontend': 'bg-roletag-green',
            'backend': 'bg-roletag-blue',
            'develop': 'bg-roletag-blue',
            'server': 'bg-roletag-orange',
            'data': 'bg-roletag-yellow',
        };

        return styles[positionName] || 'bg-tag-yellow';
    };

    const handleMatchingButtonClick = () => {
        if (isMatching) {
            setIsCancelModalOpen(true);
        } else {
            setIsModalOpen(true);
        }
    };

    const handleCancelConfirm = () => {
        if (currentMatchingId) {
            cancelMutation.mutate(String(currentMatchingId), {
                onSuccess: () => {
                    // localStorage에서 삭제
                    if (projectId) {
                        localStorage.removeItem(`matching_${projectId}`);
                    }
                    setIsCancelModalOpen(false);
                },
                onError: (error) => {
                    console.error('매칭 취소 실패:', error);
                    setIsCancelModalOpen(false);
                }
            });
        }
    };

    const isBadRequest =
        axios.isAxiosError(error) &&
        (error.response?.data as { status?: { statusCode?: string } })?.status?.statusCode === 'C001';

    // 로딩 상태
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-neutral-500">로딩 중...</p>
            </div>
        );
    }

    // 에러 상태
    if (isBadRequest) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-neutral-500">프로젝트 정보를 찾을 수 없습니다</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-red-500">프로젝트 정보를 불러올 수 없습니다</p>
            </div>
        );
    }

    // 데이터 없음
    if (!projectData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-neutral-500">프로젝트 데이터가 없습니다</p>
            </div>
        );
    }

    return (
        <div className="relative bg-neutral-50 w-screen -ml-[calc((100vw-100%)/2)] -mr-[calc((100vw-100%)/2)] min-h-screen px-8 py-8 pb-[120px]">
            <div className="max-w-[1200px] mx-auto flex flex-col items-center">

                <div className="w-[916px]">
                    <div className="mt-[36px]">
                        <Breadcrumb 
                            items={[
                                { label: '홈', path: '/' },
                                { label: '모집 중인 프로젝트', path: '/projectList' },
                                { label: projectData.defaultInfo.project_title }
                            ]} 
                        />
                    </div>
                    <div className=' mt-8 flex items-center justify-between'>
                        <h1 className="text-[28px] font-bold mt-1">모집 중인 프로젝트</h1>
                        <Link 
                            to="/projectList"
                            className="mt-4 text-xl font-semibold w-[135px] h-[48px] flex items-center justify-center gap-2.5 bg-neutral-100 border border-neutral-200 rounded-xl"
                        >
                            <img src={hamburger} alt="Menu" />
                            <p className='text-[14px] text-neutral-400'>목록으로 가기</p>
                        </Link>
                    </div>
                </div>

                <div className="mt-9 w-[916px] bg-white rounded-lg border border-neutral-200 shadow-sm">
                    <div className='w-full pl-[46px] pt-[56px] pr-[46px]'>
                        <div className='flex justify-between w-full'>
                            <h2 className="font-bold text-[28px]">{projectData.defaultInfo.project_title}</h2>
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
                        {activeTab === 'info' && <ProjectInfoTab projectData={projectData} projectId={Number(projectId)} getPositionStyle={getPositionStyle} />}
                        {activeTab === 'members' && <TeamMembersTab projectData={projectData} getPositionStyle={getPositionStyle} projectId={Number(projectId)} />}
                    </div>
                </div>

                {/* 모달들 생략 (기존과 동일) */}
                <MatchingRequestModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onMatchingComplete={(field: string) => {
                        setSelectedField(field);
                        setIsModalOpen(false);
                        setIsConfirmModalOpen(true);
                    }}
                    getPositionStyle={getPositionStyle}
                    recruitments={recruitments || []}
                />

                <MatchingRequestConfirmModal 
                    isOpen={isConfirmModalOpen}
                    onClose={() => setIsConfirmModalOpen(false)}
                    onConfirm={() => {
                        if (projectId && selectedField) {
                            matchingMutation.mutate(
                                { projectId, body: { field: selectedField } },
                                {
                                    onSuccess: (response) => {
                                        // matchingId를 localStorage에 저장
                                        if (response?.body?.id && projectId) {
                                            localStorage.setItem(`matching_${projectId}`, String(response.body.id));
                                        }
                                        setIsConfirmModalOpen(false);
                                        setIsSuccessModalOpen(true);
                                    },
                                    onError: (error) => {
                                        console.error('매칭 요청 실패:', error);
                                        setIsConfirmModalOpen(false);
                                    }
                                }
                            );
                        }
                    }}
                    memberName={projectData?.defaultInfo?.project_title || '프로젝트'}
                    position={selectedField}
                />

                <MatchingSuccessModal 
                    isOpen={isSuccessModalOpen}
                    onClose={() => {
                        setIsSuccessModalOpen(false);
                    }}
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
    );
};

export default RecruitingProjectsPage;
