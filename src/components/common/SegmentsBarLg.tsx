import { useState } from 'react'

interface SegmentButtonLgProps {
	title: string
	isActive?: boolean
	onClick?: () => void
}

const SegmentButtonLg = ({ title, isActive = false, onClick }: SegmentButtonLgProps) => {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`inline-flex items-center justify-center h-[34px] px-5 py-1 body-1 transition-all w-[162px] rounded-12 ${
				isActive
					? 'bg-neutral-000 text-neutral-900 font-semibold shadow-drop-primary-2'
					: 'text-status-info-cool-gray-deep font-medium'
			}`}
		>
			{title}
		</button>
	)
}

interface SegmentsBarLgProps {
	segments: string[]
	defaultValue?: string
	onChange?: (value: string) => void
}

const SegmentsBarLg = ({ segments, defaultValue, onChange }: SegmentsBarLgProps) => {
	const [activeSegment, setActiveSegment] = useState<string>(defaultValue || segments[0] || '')

	const handleSegmentClick = (segment: string) => {
		setActiveSegment(segment)
		onChange?.(segment)
	}

	return (
		<div className='flex items-center'>
			<div className='relative flex items-center gap-1 p-1 bg-neutral-100 rounded-[14px] shadow-inner-neutral-2'>
				{segments.map(segment => (
					<SegmentButtonLg
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

export default SegmentsBarLg
