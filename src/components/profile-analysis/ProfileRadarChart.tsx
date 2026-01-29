import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts'

interface ProfileRadarChartProps {
	data: {
		subject: string
		value: number
	}[]
	className?: string
}

const ProfileRadarChart = ({ data, className }: ProfileRadarChartProps) => {
	return (
		<div className={className}>
			<ResponsiveContainer width='100%' height='100%' className='focus:outline-none'>
				<RadarChart cx='50%' cy='50%' outerRadius='70%' data={data} className='focus:outline-none'>
					<PolarGrid
						stroke='#959595'
						strokeWidth={1}
						gridType='polygon'
						strokeDasharray={2}
					/>
					<PolarAngleAxis
						dataKey='subject'
						tick={{
							fill: '#111',
							fontSize: 18,
							fontWeight: 600,
						}}
						tickLine={false}
					/>
					<Radar
						name='협업 스타일'
						dataKey='value'
						stroke='#660fd8'
						strokeWidth={1}
						fill='rgba(232, 216, 252, 0.5)'
						dot={{
							r: 4,
							fill: '#660fd8',
							strokeWidth: 0,
						}}
						activeDot={false}
						isAnimationActive={false}
					/>
				</RadarChart>
			</ResponsiveContainer>
		</div>
	)
}

export default ProfileRadarChart
