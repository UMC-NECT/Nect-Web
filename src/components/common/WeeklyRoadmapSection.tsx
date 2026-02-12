import { useLayoutEffect, useRef, useState } from 'react'

import WeeklyRoadmapItem from '@/components/analyze-report/WeeklyRoadmapItem'
import type { WeeklyRoadmapRoleTask } from '@/types/api/analysis'

type RoadmapItem = {
	week: string
	title: string
	role_tasks: WeeklyRoadmapRoleTask[]
}

interface WeeklyRoadmapSectionProps {
	roadmapItems: RoadmapItem[]
}

const ACCORDION_DURATION_MS = 300

const WeeklyRoadmapSection = ({ roadmapItems }: WeeklyRoadmapSectionProps) => {
	const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(() => new Set())
	const roadmapSectionRef = useRef<HTMLDivElement>(null)
	const lastChipRef = useRef<HTMLDivElement>(null)
	const [lineHeight, setLineHeight] = useState(0)

	const toggleWeek = (index: number) => {
		setExpandedWeeks(prev => {
			const next = new Set(prev)
			if (next.has(index)) next.delete(index)
			else next.add(index)
			return next
		})
	}

	useLayoutEffect(() => {
		const container = roadmapSectionRef.current
		if (!container || roadmapItems.length === 0) return

		const measure = () => {
			const lastChip = lastChipRef.current
			if (!lastChip) return
			const containerTop = container.getBoundingClientRect().top
			const chipRect = lastChip.getBoundingClientRect()
			const lastChipCenter = chipRect.top - containerTop + 30
			setLineHeight(Math.max(0, lastChipCenter - 30))
		}

		measure()
		const ro = new ResizeObserver(measure)
		ro.observe(container)

		const start = performance.now()
		let rafId: number
		const tick = () => {
			measure()
			if (performance.now() - start < ACCORDION_DURATION_MS) {
				rafId = requestAnimationFrame(tick)
			}
		}
		rafId = requestAnimationFrame(tick)

		return () => {
			cancelAnimationFrame(rafId)
			ro.disconnect()
		}
	}, [expandedWeeks, roadmapItems.length])

	return (
		<div ref={roadmapSectionRef} className='relative flex flex-col gap-[18px]'>
				<div
					className='absolute w-[2px] border-l-2 border-dashed border-primary-300-light'
					style={{
						left: 29,
						top: 30,
						height: lineHeight || (roadmapItems.length - 1) * 78,
					}}
				/>
				{roadmapItems.map((item, index) => {
					const isExpanded = expandedWeeks.has(index)
					const isLast = index === roadmapItems.length - 1
					return (
						<div key={index} className='flex gap-5 items-start w-full'>
							<div
								ref={isLast ? lastChipRef : undefined}
								className='shrink-0 w-[60px] h-[60px] flex items-center justify-center'
							>
								<div className='w-[60px] h-[32px] body-1 font-medium text-center bg-primary-500-normal text-white rounded-6 flex items-center justify-center px-2.5 py-1 shadow-drop-neutral-2 z-10'>
									<span className='mr-0.5 whitespace-nowrap'>{item.week}</span>
									<span className='whitespace-nowrap'>주차</span>
								</div>
							</div>
							<div className='flex-1 min-w-0'>
								<WeeklyRoadmapItem
									title={item.title}
									role_tasks={item.role_tasks}
									isExpanded={isExpanded}
									onToggle={() => toggleWeek(index)}
								/>
							</div>
						</div>
					)
				})}
		</div>
	)
}

export default WeeklyRoadmapSection
