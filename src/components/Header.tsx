import { useState } from 'react';
import LogoIcon from '../assets/icons/Logo.svg';
import SearchIcon from '../assets/icons/Search.svg';
import MenuIcon from '../assets/icons/Menu.svg';
import BarIcon from '../assets/icons/Bar.svg';

const Header = () => {
    const [activeMenu, setActiveMenu] = useState('프로젝트ㆍ팀원 탐색');

    const navItems = [
        { name: '프로젝트ㆍ팀원 탐색' },
        { name: '팀 작업실' },
    ];

    const isActive = (name: string) => activeMenu === name;

    return (
        <header className="fixed top-0 left-0 right-0 w-full border-b border-gray-200 bg-white h-[68px] z-50">
            <div className="mx-auto flex h-full items-center gap-9 px-6">
                {/* 햄버거 메뉴 */}
                <button
                    className="flex h-10 w-10 items-center justify-center"
                    aria-label="메뉴"
                >
                    <img src={MenuIcon} alt="메뉴" className="h-10 w-6" />
                </button>

                {/* 로고 */}
                <div className="flex items-center cursor-pointer">
                    <img src={LogoIcon} alt="NECT" className="h-10 w-auto" />
                </div>

                {/* 네비게이션 */}
                <nav className="flex items-center gap-4">
                    {navItems.map((item, index) => (
                        <div key={item.name} className="flex items-center gap-4">
                            <button
                                onClick={() => setActiveMenu(item.name)}
                                className={`text-[18px] font-medium transition-colors ${
                                    isActive(item.name)
                                        ? 'text-black'
                                        : 'text-gray-400 hover:text-black'
                                }`}
                            >
                                {item.name}
                            </button>
                            {index < navItems.length - 1 && (
                                <img src={BarIcon} alt="" />
                            )}
                        </div>
                    ))}
                </nav>

                {/* 오른쪽 공간 */}
                <div className="flex-1" />

                {/* 검색 아이콘 */}
                <button 
                    className="flex h-10 w-10 items-center justify-center"
                    aria-label="검색"
                >
                    <img src={SearchIcon} alt="검색" className="h-10 w-10" />
                </button>
            </div>
        </header>
    );
};

export default Header;