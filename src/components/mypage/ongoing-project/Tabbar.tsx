import type { TabType } from '@/types/mypage/ongoindProject'

interface ITabbar {
	currentTab: string
	onClick: (tabName: TabType) => void
}

const Tabbar = ({ currentTab, onClick }: ITabbar) => {
	return (
		<div className='flex items-center mb-7'>
			<button type='button' onClick={() => onClick('프로젝트 설정')} className='flex flex-col gap-3 w-30 pt-2.5'>
				<span
					className={`title-3 font-semibold text-center ${
						currentTab === '프로젝트 설정'
							? 'text-primary-500-normal'
							: 'text-neutral-400 hover:text-neutral-500 duration-150 ease-in-out'
					}`}
				>
					프로젝트 설정
				</span>
				<div className={`h-0.75 w-full ${currentTab === '프로젝트 설정' ? 'bg-primary-400-normal' : 'bg-neutral-400'}`} />
			</button>

			<button type='button' onClick={() => onClick('팀원 관리')} className='flex flex-col gap-3 w-30 pt-2.5'>
				<span
					className={`title-3 font-semibold text-center ${
						currentTab === '팀원 관리'
							? 'text-primary-500-normal'
							: 'text-neutral-400 hover:text-neutral-500 duration-150 ease-in-out'
					}`}
				>
					팀원 관리
				</span>
				<div className={`h-0.75 w-full ${currentTab === '팀원 관리' ? 'bg-primary-400-normal' : 'bg-neutral-400'}`} />
			</button>
		</div>
	)
}

export default Tabbar
