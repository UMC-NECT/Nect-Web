import logo from '@/assets/icons/common/nect-logo.svg';

const Footer = () => {
    const companyInfo = [
        '(주)NECT  |  대표이사 이복기',
        '서울특별시 송파구 올림픽로 300, 롯데월드타워 35층  |  전화번호: 02-539-7118',
        '사업자등록번호: 299-86-00021  |  통신판매번호: 2020-서울송파-3147  |  유료직업소개사업자등록번호: (국내) 제2020-3240259-14-5-00018호'
    ];

    const links = [
        '채용서비스 문의',
        '원티드스페이스 문의',
        '원티드긱스 문의',
        '프리온보딩 관리',
        '취업지원시스템 문의',
        'IR 문의'
    ];

    return (
        <footer className="w-full bg-white pl-13 mb-50">
            <div className="w-[1128px] mx-auto py-12">
                {/* 로고 */}
                <img src={logo} alt="NECT Logo" className="w-[113px] h-[20px] mb-6" />
                
                {/* 회사 정보 */}
                <div className="mt-10">
                    {companyInfo.map((info, index) => (
                        <p key={index} className="text-neutral-600 text-sm mb-1">
                            {info}
                        </p>
                    ))}
                </div>

                {/* 링크 */}
                <div className="mt-10 flex gap-4 text-md text-neutral-700">
                    {links.map((link, index) => (
                        <a 
                            key={index}
                            href="#" 
                        >
                            {link}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
};

export default Footer;