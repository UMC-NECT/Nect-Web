import { cn } from "@/utils/cn"
import logo from '@/assets/icons/common/nect-logo.svg';
import BarIcon from '@/assets/icons/common/Bar.svg?react';

type FooterProps = {
    type: 'Default' | 'Mini'
    margin: '196' | '234' | '152' | '144'
    className?: string
}

const Footer = ({ type, margin, className }: FooterProps) => {
    const marginClassName: Record<string, string> = {
        196: 'px-[196px] pt-[144px] pb-[72px]',
        234: 'px-[234px] pt-[144px] pb-[72px]',
        152: 'px-[152px] pt-[144px] pb-[72px]',
        144: 'px-[144px] pt-[216px] pb-[72px]',
    }

    const companyInfo = {
        line1: ['(주)넥트', '대표 강승희'],
        line2: ['서울특별시 유엠시 유엠대로 486', '전화번호: 02-123-4567'],
        line3: ['사업자등록번호: 123-45-67890', '이메일: seungheekang31@gmail.com'],
        line4: '© 2026. 넥트 (NECT) Co. All rights reserved.'
    };

	return (
		<>
            {type === 'Default' && (
                <footer className={cn('w-full', marginClassName[margin], className)}>
                <div className="w-282 mx-auto gap-[50px]">
                {/* 로고 */}
                <img src={logo} alt="NECT Logo" className="w-28.25 h-5 mb-[50px]" />

                {/* 회사 정보 */}
                <div className="mt-10 space-y-2 text-[14px]">
                    {/* 첫 번째 줄 */}
                    <div className="flex items-center gap-2 text-neutral-400 text-body2">
                        <span>{companyInfo.line1[0]}</span>
                        <BarIcon className="w-px h-3" />
                        <span>{companyInfo.line1[1]}</span>
                    </div>

                    {/* 두 번째 줄 */}
                    <div className="flex items-center gap-2 text-neutral-400 text-body2">
                        <span>{companyInfo.line2[0]}</span>
                        <BarIcon className="w-px h-3" />
                        <span>{companyInfo.line2[1]}</span>
                    </div>

                    {/* 세 번째 줄 */}
                    <div className="flex items-center gap-2 text-neutral-400 text-body2">
                        <span>{companyInfo.line3[0]}</span>
                        <BarIcon className="w-px h-3" />
                        <span>{companyInfo.line3[1]}</span>
                    </div>

                    {/* 네 번째 줄 */}
                    <p className="text-neutral-400 text-body2">{companyInfo.line4}</p>
                </div>
            </div>
                </footer>
            )}
            {type === 'Mini' && (
                <footer className={cn('w-full pt-[144px] pb-[72px]')}>
                    <div className='flex items-center justify-center gap-8 text-neutral-400 body-2 font-medium'>
                        <p className=''>
                            © 2026. 넥트 (NECT) Co. All rights reserved.
                        </p>
                        <div className='flex gap-4'>
                            <p>이용약관</p>
                            <p>개인정보처리방침</p>
                        </div>
                    </div>
                </footer>
            )}
        </>
	)
}

export default Footer