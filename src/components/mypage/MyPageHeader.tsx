import type { ReactNode } from 'react'
import { useLocation } from 'react-router'
import { MYPAGE_MENU } from '@/constants/mypage'

interface MyPageHeaderProps {
	action?: ReactNode
}

export const MyPageHeader = ({ action }: MyPageHeaderProps) => {
	const location = useLocation()
	const currentPath = location.pathname

	// 현재 경로에 맞는 메뉴 아이템 찾기
	const findCurrentMenuItem = () => {
		for (const section of MYPAGE_MENU) {
			for (const item of section.items) {
				if (currentPath === item.path) {
					return {
						sectionTitle: section.title,
						itemLabel: item.label,
					}
				}
			}
		}
		// 디폴트: 내 프로필 설정 (my-page/profile)
		return {
			sectionTitle: MYPAGE_MENU[0].title,
			itemLabel: MYPAGE_MENU[0].items[0].label,
		}
	}

	const { sectionTitle, itemLabel } = findCurrentMenuItem()

	return (
		<div className='mb-9 w-full flex justify-between items-end'>
			{/* 브레드크럼 + 타이틀 */}
			<div>
				{/* 브레드크럼 */}
				<nav className='body-2 text-neutral-400 mb-7'>
					<span>마이 페이지</span>
					<span className='mx-2'>{'>'}</span>
					<span>{sectionTitle}</span>
					<span className='mx-2'>{'>'}</span>
					<span>{itemLabel}</span>
				</nav>

				{/* 타이틀 */}
				<div className='flex items-center justify-between'>
					<h1 className='heading-2 font-bold text-neutral-900'>{itemLabel}</h1>
				</div>
			</div>

			{/* 액션 버튼 */}
			<div>{action}</div>
		</div>
	)
}
