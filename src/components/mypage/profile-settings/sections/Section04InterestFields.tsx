import RoundChipButton from '../../../common/RoundChipButton'
import { INTEREST_FIELDS } from '@/constants/mypage'

interface ISection04InterestFields {
	selectedFields: string[]
	onToggleField: (field: string) => void
}

const Section04InterestFields = ({ selectedFields, onToggleField }: ISection04InterestFields) => {
	return (
		<section className=' ml-5'>
			<h2 className='title-2 font-bold text-neutral-900 mb-4'>
				관심 분야 <span className='text-danger-700'>*</span>
			</h2>

			<div className='flex flex-wrap gap-3'>
				{INTEREST_FIELDS.map(field => (
					<RoundChipButton
						key={field}
						text={field}
						isChecked={selectedFields.includes(field)}
						onClick={() => onToggleField(field)}
						className='w-auto'
					/>
				))}
			</div>
		</section>
	)
}

export default Section04InterestFields
