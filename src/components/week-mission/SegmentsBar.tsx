import { useState } from 'react'
import SegmentButton from './SegmentButton'
import MoreIcon from '@/assets/icons/week-mission/more-vertical.svg?react'

interface SegmentsBarProps {
	segments: string[]
	defaultValue?: string
	onChange?: (value: string) => void
	editable?: boolean
}

const SegmentsBar = ({ segments, defaultValue, onChange, editable }: SegmentsBarProps) => {
	const [activeSegment, setActiveSegment] = useState<string>(defaultValue || segments[0] || '')

	const handleSegmentClick = (segment: string) => {
		setActiveSegment(segment)
		onChange?.(segment)
	}

	return (
		<div className="flex items-center">
			<div className="relative flex items-center gap-1 p-1 bg-neutral-100 rounded-[14px]">
				{segments.map((segment) => (
					<SegmentButton
						key={segment}
						title={segment}
						isActive={segment === activeSegment}
						onClick={() => handleSegmentClick(segment)}
					/>
				))}
				{editable && (
					<button type="button" className="p-1">
						<MoreIcon />
					</button>
				)}
				<div className="absolute inset-0 pointer-events-none rounded-[14px] shadow-[inset_-1px_2.5px_4px_0px_rgba(228,228,228,0.2)]" />
			</div>
		</div>
	)
}

export default SegmentsBar