import { Outlet } from 'react-router'
import { MyPageSidebar } from '@/components/mypage/MyPageSidebar'

const MyPage = () => {
	return (
		<div className='max-w-full flex min-h-screen bg-neutral-50 pt-9 px-38'>
			{/* 좌측 - 사이드바(고정) */}
			<MyPageSidebar />

			{/* 우측 - 컨텐츠 */}
			<main className='flex-1 min-w-0'>
				<Outlet />
			</main>
		</div>
	)
}

export default MyPage
