import RadarChart from '@/components/team-board/RadarChart'

interface RadarChartCardProps {
	title: string
	totalScore: number
	maxScore: number
	data: Parameters<typeof RadarChart>[0]['data']
	className?: string
}

const RadarChartCard = ({ title, totalScore, maxScore, data, className = '' }: RadarChartCardProps) => {
	return (
		<div
			className={`w-[392px] h-[448px] p-5 bg-neutral-000 rounded-xl outline-1 -outline-offset-1 outline-neutral-100 flex flex-col justify-between ${className}`}
		>
			{/* 상단 타이틀 영역 - 다른 카드와 동일 스타일 */}
			<div className='self-stretch text-neutral-900 title-2 font-bold line-clamp-1 mb-2'>{title}</div>

			{/* 차트 영역 */}
			<div className='flex-1 flex items-center justify-center'>
				<RadarChart totalScore={totalScore} data={data} className='w-[320px]' />
			</div>

			{/* 하단 Total 점수 영역 */}
			<div className='mt-4 flex justify-end'>
				<div className='inline-flex items-end gap-2.5'>
					<span className='text-neutral-900 title-2 font-bold'>Total</span>
					<div className='flex items-end gap-1'>
						<span className='text-primary-500-normal heading-1 font-bold' style={{ lineHeight: 1 }}
            >{totalScore}</span>
						<span className='text-neutral-500 body-1 font-semibold leading-none'>/ {maxScore}</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default RadarChartCard