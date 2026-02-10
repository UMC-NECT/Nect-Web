import { useState } from 'react'
import CheckboxIcon from '@/assets/icons/team-board/checkbox.svg?react'
import TargetIcon from '@/assets/icons/team-board/target.svg?react'

interface RadarChartData {
	label: string
	score: number
	maxScore: number
	color: string
	roleColor: string
	angle: number // 각도 (0~360)
}

interface RadarChartProps {
	data: RadarChartData[]
	totalScore: number
	className?: string
}

const RadarChart = ({ data, totalScore, className = '' }: RadarChartProps) => {
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
	const size = 320 // SVG 크기
	const center = size / 2
	const radius = 140 // 최대 반지름
	const levels = 10 // 그리드 레벨 수
	const centerRadius = 20 // 중앙 원 반지름

	// score / maxScore 비율을 기반으로 레벨 수를 안전하게 계산
	// - maxScore가 0이거나 undefined인 경우 0 레벨
	// - NaN / Infinity 방지
	const getScoreLevel = (score: number, maxScore: number) => {
		if (!maxScore || maxScore <= 0) return 0

		const ratio = score / maxScore
		if (!Number.isFinite(ratio) || ratio <= 0) return 0

		const rawLevel = Math.round(ratio * levels)
		// 0 ~ levels 사이로 클램핑
		return Math.max(0, Math.min(levels, rawLevel))
	}

	// CSS 변수를 실제 색상 값으로 변환
	const getActualColor = (color: string) => {
		const colorMap: Record<string, string> = {
			'var(--color-roletag-purple)': '#E8D8FC',
			'var(--color-roletag-pink)': '#FFE0F1',
			'var(--color-roletag-orange)': '#FFE0E0',
			'var(--color-roletag-blue)': '#E5EBFF',
			'var(--color-roletag-green)': '#E4F5EC',
			'var(--color-roletag-yellow)': '#FFF4DB',
		}
		return colorMap[color] || color
	}

	// 색상에 대응하는 deep 색상 반환 (실제 색상 값)
	const getDeepColor = (color: string) => {
		const colorMap: Record<string, string> = {
			'var(--color-roletag-purple)': '#C494FF',
			'var(--color-roletag-pink)': '#FF94CC',
			'var(--color-roletag-orange)': '#FF9494',
			'var(--color-roletag-blue)': '#94AAFF',
			'var(--color-roletag-green)': '#8CDB92',
			'var(--color-roletag-yellow)': '#F8C08B',
		}
		return colorMap[color] || color
	}

	// 각도에 따른 좌표 계산 (12시 방향이 0도)
	const getPoint = (angle: number, r: number) => {
		const rad = ((angle - 90) * Math.PI) / 180 // 12시 방향이 0도
		return {
			x: center + r * Math.cos(rad),
			y: center + r * Math.sin(rad),
		}
	}


	// 태그 위치 계산 (세그먼트 중앙 각도에서 외부로 배치)
	const getTagPosition = (angle: number, distance: number) => {
		const point = getPoint(angle, radius + distance)
		return {
			x: point.x,
			y: point.y,
		}
	}

	return (
		<div className={`relative ${className}`}>
			<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
				{/* 그림자 필터 정의 (shadow-drop-neutral-4) */}
				<defs>
					<filter id="bgShadow" x="-50%" y="-50%" width="200%" height="200%">
						<feGaussianBlur in="SourceAlpha" stdDeviation="3" />
						<feOffset dx="0" dy="0" result="offsetblur" />
						<feFlood floodColor="#191919" floodOpacity="0.2" />
						<feComposite in2="offsetblur" operator="in" />
						<feMerge>
							<feMergeNode />
							<feMergeNode in="SourceGraphic" />
						</feMerge>
					</filter>
				</defs>

				{/* 배경 원 */}
				<circle cx={center} cy={center} r={radius} fill="#F7F7FA" filter="url(#bgShadow)" />

				{/* 그리드 원들 (기본 회색) - 색칠되지 않은 영역용 */}
				{Array.from({ length: levels }).map((_, level) => {
					// 중앙 원 바깥부터 시작: centerRadius부터 radius까지
					const availableRadius = radius - centerRadius
					const r = centerRadius + ((level + 1) / levels) * availableRadius
					const isOutermost = level === levels - 1
					return (
						<circle
							key={level}
							cx={center}
							cy={center}
							r={r}
							fill="none"
							stroke={isOutermost ? 'white' : '#DADAE8'}
							strokeWidth={isOutermost ? '3' : '1'}
							strokeDasharray={isOutermost ? 'none' : '2 2'}
						/>
					)
				})}

				{/* 1. 각 세그먼트 영역 (레벨별로 점수에 맞게 색칠) - 가장 아래 */}
				{data.map((item, index) => {
					const prevIndex = index === 0 ? data.length - 1 : index - 1
					const prevAngle = data[prevIndex].angle
					const currentAngle = item.angle
					
					// 각도 차이 계산
					const angleDiff = currentAngle - prevAngle
					const normalizedAngleDiff = angleDiff < 0 ? angleDiff + 360 : angleDiff
					const largeArc = normalizedAngleDiff > 180 ? 1 : 0

					// 점수에 해당하는 레벨 수 계산 (안전하게 처리)
					const scoreLevel = getScoreLevel(item.score, item.maxScore)
					const availableRadius = radius - centerRadius

					return (
						<g key={index}>
							{/* 각 레벨별로 색칠 */}
							{Array.from({ length: scoreLevel }).map((_, level) => {
								const levelRadius = centerRadius + ((level + 1) / levels) * availableRadius
								const prevLevelRadius = centerRadius + (level / levels) * availableRadius
								
								const prevInnerPoint = getPoint(prevAngle, prevLevelRadius)
								const prevOuterPoint = getPoint(prevAngle, levelRadius)
								const currentInnerPoint = getPoint(currentAngle, prevLevelRadius)
								const currentOuterPoint = getPoint(currentAngle, levelRadius)

								const levelPath = `
									M ${prevInnerPoint.x} ${prevInnerPoint.y}
									L ${prevOuterPoint.x} ${prevOuterPoint.y}
									A ${levelRadius} ${levelRadius} 0 ${largeArc} 1 ${currentOuterPoint.x} ${currentOuterPoint.y}
									L ${currentInnerPoint.x} ${currentInnerPoint.y}
									A ${prevLevelRadius} ${prevLevelRadius} 0 ${largeArc} 0 ${prevInnerPoint.x} ${prevInnerPoint.y}
									Z
								`

								return (
									<path
										key={level}
										d={levelPath}
										fill={getActualColor(item.color)}
										fillOpacity="0.7"
									/>
								)
							})}
						</g>
					)
				})}

				{/* 2. 점선들 - 중간 */}
				{/* 세그먼트별 원형 점선 (색칠된 영역에 해당하는 호만 deep 색상으로 덮어쓰기) */}
				{data.map((item, itemIndex) => {
					const prevIndex = itemIndex === 0 ? data.length - 1 : itemIndex - 1
					const prevAngle = data[prevIndex].angle
					const currentAngle = item.angle
					
					// 각도 차이 계산
					const angleDiff = currentAngle - prevAngle
					const normalizedAngleDiff = angleDiff < 0 ? angleDiff + 360 : angleDiff
					const largeArc = normalizedAngleDiff > 180 ? 1 : 0
					
					// 점수에 해당하는 레벨 수 계산
					const availableRadius = radius - centerRadius
					const scoreLevel = getScoreLevel(item.score, item.maxScore)
					const deepColor = getDeepColor(item.color)
					
					return (
						<g key={`segment-arcs-${itemIndex}`}>
							{/* 각 레벨별로 색칠된 영역에 해당하는 호 그리기 (기존 점선 위에 덮어쓰기) */}
							{Array.from({ length: scoreLevel }).map((_, level) => {
								const r = centerRadius + ((level + 1) / levels) * availableRadius
								
								const prevPoint = getPoint(prevAngle, r)
								const currentPoint = getPoint(currentAngle, r)
								
								const arcPath = `
									M ${prevPoint.x} ${prevPoint.y}
									A ${r} ${r} 0 ${largeArc} 1 ${currentPoint.x} ${currentPoint.y}
								`
								
								return (
									<path
										key={level}
										d={arcPath}
										fill="none"
										stroke={deepColor}
										strokeWidth="1"
										strokeDasharray="2 2"
									/>
								)
							})}
						</g>
					)
				})}

				{/* 방사형 선들 (점선) - 각 세그먼트 색에 맞게 */}
				{data.map((item, index) => {
					const point = getPoint(item.angle, radius)
					// 점수에 해당하는 반지름 계산
					const availableRadius = radius - centerRadius
					const scoreLevel = getScoreLevel(item.score, item.maxScore)
					const actualRadius = centerRadius + (scoreLevel / levels) * availableRadius
					const scorePoint = getPoint(item.angle, actualRadius)
					
					return (
						<g key={index}>
							{/* 색칠된 영역 안의 점선 (deep 색상) */}
							<line
								x1={center}
								y1={center}
								x2={scorePoint.x}
								y2={scorePoint.y}
								stroke={getDeepColor(item.color)}
								strokeWidth="1"
								strokeDasharray="2 2"
							/>
							{/* 색칠된 영역 밖의 점선 (기본 회색) */}
							<line
								x1={scorePoint.x}
								y1={scorePoint.y}
								x2={point.x}
								y2={point.y}
								stroke="#DADAE8"
								strokeWidth="1"
								strokeDasharray="2 2"
							/>
						</g>
					)
				})}

				{/* 3. 세그먼트 경계선 (3px 흰색) - 가장 위 */}
				{data.map((item, index) => {
					const prevIndex = index === 0 ? data.length - 1 : index - 1
					const prevAngle = data[prevIndex].angle
					const currentAngle = item.angle
					
					// 각도 차이 계산
					const angleDiff = currentAngle - prevAngle
					const normalizedAngleDiff = angleDiff < 0 ? angleDiff + 360 : angleDiff
					const largeArc = normalizedAngleDiff > 180 ? 1 : 0
					
					// 점수에 해당하는 반지름 계산 (안전하게 처리)
					const availableRadius = radius - centerRadius
					const scoreLevel = getScoreLevel(item.score, item.maxScore)
					const actualRadius = centerRadius + (scoreLevel / levels) * availableRadius
					
					// 중심에서 원의 가장자리까지의 선 (항상 끝까지)
					const prevOuterPoint = getPoint(prevAngle, radius)
					
					// 점수에 해당하는 호
					const prevScorePoint = getPoint(prevAngle, actualRadius)
					const currentScorePoint = getPoint(currentAngle, actualRadius)
					const arcPath = `
						M ${prevScorePoint.x} ${prevScorePoint.y}
						A ${actualRadius} ${actualRadius} 0 ${largeArc} 1 ${currentScorePoint.x} ${currentScorePoint.y}
					`
					
					return (
						<g key={`border-${index}`}>
							{/* 중심에서 원의 가장자리까지의 경계선 (항상 끝까지) */}
							<line
								x1={center}
								y1={center}
								x2={prevOuterPoint.x}
								y2={prevOuterPoint.y}
								stroke="white"
								strokeWidth="3"
							/>
							{/* 점수에 해당하는 호 경계선 */}
							<path
								d={arcPath}
								fill="none"
								stroke="white"
								strokeWidth="3"
							/>
						</g>
					)
				})}

				{/* 호버 감지용 invisible 영역 (각 세그먼트 전체 영역) */}
				{data.map((item, index) => {
					const prevIndex = index === 0 ? data.length - 1 : index - 1
					const prevAngle = data[prevIndex].angle
					const currentAngle = item.angle
					
					// 각도 차이 계산
					const angleDiff = currentAngle - prevAngle
					const normalizedAngleDiff = angleDiff < 0 ? angleDiff + 360 : angleDiff
					const largeArc = normalizedAngleDiff > 180 ? 1 : 0
					
					// 세그먼트 전체 영역 경로 (중앙 원부터 외곽까지)
					const prevInnerPoint = getPoint(prevAngle, centerRadius)
					const prevOuterPoint = getPoint(prevAngle, radius)
					const currentInnerPoint = getPoint(currentAngle, centerRadius)
					const currentOuterPoint = getPoint(currentAngle, radius)
					
					const segmentPath = `
						M ${prevInnerPoint.x} ${prevInnerPoint.y}
						L ${prevOuterPoint.x} ${prevOuterPoint.y}
						A ${radius} ${radius} 0 ${largeArc} 1 ${currentOuterPoint.x} ${currentOuterPoint.y}
						L ${currentInnerPoint.x} ${currentInnerPoint.y}
						A ${centerRadius} ${centerRadius} 0 ${largeArc} 0 ${prevInnerPoint.x} ${prevInnerPoint.y}
						Z
					`
					
					return (
						<path
							key={`hover-area-${index}`}
							d={segmentPath}
							fill="transparent"
							stroke="none"
							onMouseEnter={() => setHoveredIndex(index)}
							onMouseLeave={() => setHoveredIndex(null)}
							style={{ cursor: 'pointer' }}
						/>
					)
				})}


				{/* 중앙 원과 내용 (세로 배치, 가로 중앙 정렬) */}
				<g transform={`translate(${center}, ${center})`}>
					{/* 중앙 원 */}
					<circle cx={0} cy={0} r={centerRadius} fill="white" stroke="white" strokeWidth="3" />
					
					{/* 중앙 아이콘과 점수 (세로 배치, 가로 중앙 정렬) */}
					<foreignObject x="-20" y="-20" width="40" height="40">
						<div className="flex flex-col items-center justify-center w-full h-full">
							{/* 중앙 아이콘 */}
							<TargetIcon className="w-3 h-3 text-primary-500-normal" />
							{/* 중앙 점수 */}
							<span className="text-neutral-900 body-3 font-bold">{totalScore}</span>
						</div>
					</foreignObject>
				</g>
			</svg>

			{/* 태그들 */}
			{data.map((item, index) => {
				// 세그먼트의 중앙 각도 계산 (이전 각도와 현재 각도의 중간)
				const prevIndex = index === 0 ? data.length - 1 : index - 1
				const prevAngle = data[prevIndex].angle
				const currentAngle = item.angle
				
				// 각도 차이 계산 및 정규화
				let angleDiff = currentAngle - prevAngle
				if (angleDiff < 0) angleDiff += 360
				if (angleDiff > 180) angleDiff -= 360
				
				// 세그먼트 중앙 각도
				const centerAngle = prevAngle + angleDiff / 2
				const normalizedCenterAngle = centerAngle < 0 ? centerAngle + 360 : centerAngle >= 360 ? centerAngle - 360 : centerAngle
				
				// 태그는 세그먼트 중앙 각도에서 외부로 배치
				const tagPos = getTagPosition(normalizedCenterAngle, 10)
				const scorePos = getTagPosition(normalizedCenterAngle, -50)

				return (
					<div
						key={index}
						onMouseEnter={() => setHoveredIndex(index)}
						onMouseLeave={() => setHoveredIndex(null)}
						style={{ cursor: 'pointer' }}
					>
						{/* 역할 태그 */}
						<div
							className="absolute px-2 py-0.5 rounded-md shadow-drop-neutral-2"
							style={{
								left: `${tagPos.x}px`,
								top: `${tagPos.y}px`,
								backgroundColor: getActualColor(item.roleColor),
								transform: 'translate(-50%, -50%)',
							}}
						>
							<span className="text-neutral-700 body-1 font-medium">{item.label}</span>
						</div>

						{/* 점수 */}
						<div
							className="absolute text-center transition-opacity duration-200 flex items-center gap-1 justify-center"
							style={{
								left: `${scorePos.x}px`,
								top: `${scorePos.y}px`,
								transform: 'translate(-50%, -50%)',
								opacity: hoveredIndex === index ? 1 : 0.1,
							}}
						>
							<CheckboxIcon className="w-4 h-4 text-neutral-500" />
							<span className="text-neutral-500 body-2 font-medium">
								{item.score}/{item.maxScore}
							</span>
						</div>
					</div>
				)
			})}
		</div>
	)
}

export default RadarChart
