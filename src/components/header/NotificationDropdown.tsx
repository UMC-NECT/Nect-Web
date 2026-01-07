import { useState } from 'react';
import ProfileImage from '@/assets/icons/header/Image.svg?react';
import BarIcon from '@/assets/icons/header/Bar.svg?react';

interface Notification {
    id: number;
    category: string;
    title: string;
    description: string;
    time: string;
    isRead: boolean;
}

interface NotificationDropdownProps {
    defaultTab?: 'all' | 'messages';
}

const NotificationDropdown = ({ defaultTab = 'all' }: NotificationDropdownProps) => {
    const [activeTab, setActiveTab] = useState<'all' | 'messages'>(defaultTab);

    const notifications: Notification[] = [
        {
            id: 1,
            category: 'NECT 플랫폼',
            title: 'PM 시루님이 다음에서 나를 @언급함',
            description: '"예원님 이거 수정사항 생겨서 여기에 첨리해두었어요!"',
            time: '25.11.26',
            isRead: false,
        },
        {
            id: 2,
            category: 'NECT 플랫폼',
            title: '새로운 위크 미션이 등록되었습니다.',
            description: '"Misson 2 온보딩 페이지 만들기"',
            time: '25.11.24',
            isRead: true,
        },
        {
            id: 3,
            category: '커뮤니티',
            title: '희일님이 작성하신 글에 답글이 달렸습니다.',
            description: '"지도 그 공모전 지원했었는데 출사 어떻게 준비하셨을…',
            time: '25.11.20',
            isRead: false,
        },
        {
            id: 4,
            category: '출시 프로젝트',
            title: '관심 분야의 새 프로젝트가 출시 되었어요!',
            description: '',
            time: '25.11.17',
            isRead: true,
        },
        {
            id: 5,
            category: '팀원 찾기',
            title: '세인트님이 매칭을 수락했습니다!',
            description: '',
            time: '25.11.16',
            isRead: true,
        },
        {
            id: 6,
            category: '팀원 찾기',
            title: '웬디님이 매칭을 수락했습니다!',
            description: '',
            time: '25.11.16',
            isRead: false,
        },
        {
            id: 7,
            category: '팀원 찾기',
            title: '추가 알림 1',
            description: '',
            time: '25.11.15',
            isRead: true,
        },
        {
            id: 8,
            category: '팀원 찾기',
            title: '추가 알림 2',
            description: '',
            time: '25.11.14',
            isRead: false,
        },
    ];

    const filteredNotifications = activeTab === 'all' 
        ? notifications 
        : notifications;

    return (
        <div className="absolute top-[66px] right-6 w-[336px] h-[646px] bg-white rounded-2xl border border-neutral-200 z-50 overflow-hidden shadow-[0px_6px_20px_0px_rgba(228,228,228,1)]">
            {/* 헤더 - 고정 영역 (프로필, 탭) */}
            <div className="p-4 pb-3">
                {/* 프로필 영역 */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        {/* 프로필 이미지 */}
                        <ProfileImage className="w-12 h-12 rounded-full flex-shrink-0" />
                        
                        {/* 프로필 정보 */}
                        <div>
                            <h3 className="text-[15px] font-semibold text-neutral-900 mb-1">이방토</h3>
                            <div className="flex items-center gap-1.5 text-[11px]">
                                <button className="text-primary-600-normal">디자이너</button>
                                <BarIcon className="w-[1px] h-3" />
                                <button className="text-neutral-600">포트폴리오</button>
                                <BarIcon className="w-[1px] h-3" />
                                <button className="text-neutral-600">My Page {'>'}</button>
                            </div>
                        </div>
                    </div>
                    {/* 로그아웃 버튼 */}
                    <button className="text-[11px] text-neutral-500 hover:text-neutral-600">로그아웃</button>
                </div>

                {/* 탭 영역 (최근 알림 / 새 메세지) */}
                <div className="flex border-b border-neutral-200">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`flex-1 pb-2 text-[14px] font-medium transition-colors ${
                            activeTab === 'all'
                                ? 'border-purple-500 border-b-2'
                                : 'text-neutral-500'
                        }`}
                    >
                        최근 알림
                    </button>
                    <button
                        onClick={() => setActiveTab('messages')}
                        className={`flex-1 pb-2 text-[14px] font-medium transition-colors ${
                            activeTab === 'messages'
                                ? 'border-purple-500 border-b-2'
                                : 'text-neutral-500'
                        }`}
                    >
                        새 메세지 13
                    </button>
                </div>
            </div>

            {/* 알림 리스트 - 스크롤 영역 */}
            <div className={"notification-scroll h-[500px] overflow-y-auto pl-4"}>
                {filteredNotifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={`mb-2 px-4 py-3 rounded-[6px] cursor-pointer ${
                            !notification.isRead 
                                ? 'bg-neutral-100'
                                : 'bg-neutral-000'
                        }`}
                    >
                        {/* 알림 상단 (카테고리, 시간, 읽음 표시) */}
                        <div className="flex items-start justify-between mb-1.5">
                            {/* 카테고리 */}
                            <span className="text-[11px] text-neutral-400">
                                {notification.category}
                            </span>
                            
                            {/* 시간 및 읽음 표시 */}
                            <div className="flex items-center gap-1.5">
                                <span className="text-[11px] text-neutral-400">
                                    {notification.time}
                                </span>
                                {/* 안 읽은 알림 표시 점 */}
                                {!notification.isRead && (
                                    <div className="w-1.5 h-1.5 bg-primary-500-normal rounded-full"></div>
                                )}
                            </div>
                        </div>
                        
                        {/* 알림 제목 */}
                        {notification.title && (
                            <p className="text-[13px] font-medium text-neutral-900 mb-1 leading-tight">
                                {notification.title}
                            </p>
                        )}
                        
                        {/* 알림 설명 */}
                        {notification.description && (
                            <p className="text-[12px] text-neutral-600 line-clamp-2 leading-relaxed">
                                {notification.description}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

};

export default NotificationDropdown;
