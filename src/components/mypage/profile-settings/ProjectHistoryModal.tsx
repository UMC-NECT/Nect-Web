import { useProjectHistoryModal } from '@/stores/useProjectHistoryModal'

const ProjectHistoryModal = () => {
	const MENUS = ['사진 변경', '사진 제거', '프로젝트 제거'] as const
	type MenuType = (typeof MENUS)[number]

	const { close } = useProjectHistoryModal()

	const handleMenuClick = (menuName: MenuType) => {
		// 임시 기능
		if (menuName === '사진 변경') {
			alert('사진 변경 기능')
		} else if (menuName === '사진 제거') {
			alert('사진 제거 기능')
		} else if (menuName === '프로젝트 제거') {
			alert('프로젝트 제거 기능')
		}

		close()
	}

	return (
		<div className='w-34.5 bg-neutral-000 shadow-drop-neutral-1 rounded-10 overflow-hidden'>
			{MENUS.map(menu => (
				<div
					key={menu}
					className='text-[13px] leading-[150%] tracking-[-2%] text-neutral-700 pl-5 py-2 hover:bg-neutral-100 overflow-hidden cursor-pointer'
					onClick={() => handleMenuClick(menu)}
				>
					{menu}
				</div>
			))}
		</div>
	)
}

export default ProjectHistoryModal
