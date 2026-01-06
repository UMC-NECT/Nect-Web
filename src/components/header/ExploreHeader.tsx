import { useState, useEffect } from 'react';
import LogoIcon from '@/assets/icons/header/Logo.svg?react';
import BarIcon from '@/assets/icons/header/Bar.svg?react';
import MessageIcon from '@/assets/icons/common/Message.svg?react';
import NotificationIcon from '@/assets/icons/common/Notification.svg?react';
import ProfileIcon from '@/assets/icons/header/Profile.svg?react';
import PortfolioIcon from '@/assets/icons/header/Portfolio.svg?react';
import NotificationDropdown from './NotificationDropdown';

interface ExploreHeaderProps {
    onNavigate: () => void;
}

const ExploreHeader = ({ onNavigate }: ExploreHeaderProps) => {
    const [activeSubMenu, setActiveSubMenu] = useState('프로젝트 찾기');
    const [showNotifications, setShowNotifications] = useState(false);
    const [showMessages, setShowMessages] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // 읽지 않은 알림 개수 (더미 데이터)
    const unreadNotifications = 3;

    const subMenuItems = [
        { name: '홈' },
        { name: '프로젝트 찾기' },
        { name: '팀원 찾기' },
        { name: '출시 프로젝트' },
        { name: '커뮤니티' },
        { name: '포트폴리오 보기' },
    ];

    // 스크롤 이벤트 핸들러
    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > 66 && currentScrollY > lastScrollY) {
                // 아래로 스크롤 중이고, 66px 이상 내려갔을 때
                setIsScrolled(true);
            } else if (currentScrollY < lastScrollY) {
                // 위로 스크롤 중일 때
                setIsScrolled(false);
            }

            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-[0px_4px_20px_0px_rgba(25,25,25,0.02)] transition-transform duration-300"
            style={{ transform: isScrolled ? 'translateY(-66px)' : 'translateY(0)' }}
        >
            {/* 상단 헤더 */}
            <div className="h-[66px] px-[92px]">
                <div className="mx-auto flex h-full items-center gap-9 px-6 relative">

                    {/* 로고 */}
                    <div className="flex items-center cursor-pointer">
                        <LogoIcon className="h-10 w-auto" />
                    </div>

                    {/* 네비게이션 */}
                    <nav className="flex items-center gap-4">
                        <button className="text-[18px] font-medium text-neutral-900 transition-colors">
                            프로젝트ㆍ팀원 탐색
                        </button>
                        <BarIcon />
                        <button 
                            onClick={onNavigate}
                            className="text-[18px] font-medium text-neutral-400 hover:text-neutral-900 transition-colors"
                        >
                            팀 작업실
                        </button>
                    </nav>

                    {/* 오른쪽 공간 */}
                    <div className="flex-1" />

                    {/* 오른쪽 아이콘들 */}
                    <div className="flex items-center gap-4">
                        <button 
                            className="flex h-10 w-10 items-center justify-center relative"
                            aria-label="알림"
                            onClick={() => {
                                setShowNotifications(!showNotifications);
                                setShowMessages(false);
                            }}
                        >
                            <NotificationIcon className="h-6 w-6 text-neutral-700" />
                            {unreadNotifications > 0 && (
                                <div className="absolute top-2 right-2 w-[3.2px] h-[3.2px] bg-semantic-600 rounded-full"></div>
                            )}
                        </button>

                        <button 
                            className="flex h-10 w-10 items-center justify-center relative"
                            aria-label="채팅"
                            onClick={() => {
                                setShowMessages(!showMessages);
                                setShowNotifications(false);
                            }}
                        >
                            <MessageIcon className="h-6 w-6 text-neutral-700" />
                        </button>

                        <button 
                            className="flex h-10 w-10 items-center justify-center"
                            aria-label="프로필"
                        >
                            <ProfileIcon className="h-6 w-6 text-neutral-700" />
                        </button>
                    </div>

                    {/* 알림/메시지 드롭다운 */}
                    {showNotifications && <NotificationDropdown defaultTab="all" />}
                    {showMessages && <NotificationDropdown defaultTab="messages" />}
                </div>
            </div>

            {/* 하단 서브메뉴 */}
            <div className="h-[66px] px-[92px]">
                <div className="mx-auto flex h-full items-center px-6">
                    {/* 왼쪽 메뉴 영역 */}
                    <div className="w-[690px] flex items-center">
                        {subMenuItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => setActiveSubMenu(item.name)}
                                className={`px-4 py-2 text-[16px] font-medium rounded-xl transition-colors ${
                                    activeSubMenu === item.name
                                        ? 'text-neutral-900 bg-neutral-100'
                                        : 'text-neutral-700 hover:bg-neutral-50'
                                }`}
                            >
                                {item.name}
                            </button>
                        ))}
                    </div>

                    {/* 오른쪽 공간 */}
                    <div className="flex-1" />

                    {/* 오른쪽 버튼들 */}
                    <div className="flex items-center gap-3">
                        <button className="px-4 py-2 text-[16px] font-semibold text-primary-800-dark bg-primary-50-light border border-primary-200-light hover:bg-primary-150-light hover:border-primary-150-light rounded-xl transition-colors">
                            AI 프로젝트 등록
                        </button>
                        <button className="px-4 py-2 text-[16px] font-semibold text-primary-800-dark bg-primary-50-light border border-primary-200-light hover:bg-primary-150-light hover:border-primary-150-light rounded-xl transition-colors flex items-center gap-2">
                            <PortfolioIcon className="h-[14px] w-[14px] text-primary-800-dark" />
                            My 포트폴리오
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default ExploreHeader;