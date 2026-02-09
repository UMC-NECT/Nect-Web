import type { GrowGuide } from '@/stores/profileAnalysisStore'

const GrowGuideSection = ({ tipText, title, description }: GrowGuide) => {

	return (
		<div className='flex flex-col gap-3 py-6'>
			{/* Tip 라벨 */}
			<p className=' flex items-center gap-2 body-1 text-neutral-700 font-semibold'>
				<span>Tip</span> <span className='text-primary-600-normal'>{tipText}</span>
			</p>

			<div className='flex flex-col w-full bg-white rounded-12 py-5 px-[22px] gap-3'>
				{/* 제목 */}
				<p className='title-3 font-semibold text-neutral-900'>{title}</p>

				{/* 설명 */}
				<p className='body-2 text-neutral-800 font-medium whitespace-pre-line'>{description}</p>
			</div>
		</div>
	)
}

export default GrowGuideSection