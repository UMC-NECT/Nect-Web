import { useState } from 'react'
import SegmentButton from './SegmentButton'

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
		<div className='flex items-center'>
			<div className='relative flex items-center gap-1 p-1 bg-neutral-50 rounded-[14px] shadow-inner-neutral-2'>
				{segments.map(segment => (
					<SegmentButton
						key={segment}
						title={segment}
						isActive={segment === activeSegment}
						onClick={() => handleSegmentClick(segment)}
					/>
				))}
				<div className='absolute inset-0 pointer-events-none rounded-[14px] shadow-inner-neutral-2' />
			</div>
		</div>
	)
}

export default SegmentsBar