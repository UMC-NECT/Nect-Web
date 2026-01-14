import FigmaIcon from '@/assets/icons/app/figma.svg?react'

interface LinkChipProps {
	app: string
}

const LinkChip = ({ app }: LinkChipProps) => {
	// app 이름에 따라 아이콘 선택 (대소문자 무시)
	const getAppIcon = (appName: string) => {
		const normalizedApp = appName.toLowerCase().trim()

		// Figma 아이콘
		if (normalizedApp.includes('figma')) {
			return <FigmaIcon className='block max-w-none size-full' />
		}
	}

	return (
		<div className='bg-neutral-000 border border-neutral-200 border-solid flex gap-[6px] items-center justify-center leading-0 px-[7px] py-[4px] relative rounded-10'>
			{/* 아이콘 영역 */}
			<div className='grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0'>
				<div className='[grid-area:1/1] bg-[#141515] ml-0 mt-0 rounded-[3.556px] size-[16px]' />
				<div className='[grid-area:1/1] h-[13.331px] ml-[3.56px] mt-[1.78px] relative w-[8.889px] flex items-center justify-center'>
					{getAppIcon(app)}
				</div>
			</div>
			{/* 텍스트 */}
			<div className='flex flex-col font-medium justify-center not-italic relative shrink-0 body-3 text-neutral-900 text-center whitespace-nowrap'>
				<p className='leading-normal whitespace-pre'>{app}</p>
			</div>
		</div>
	)
}

export default LinkChip