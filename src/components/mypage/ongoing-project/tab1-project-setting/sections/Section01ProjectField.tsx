import { INTEREST_FIELDS } from '@/constants/mypage'

interface ISection01ProjectField {
	selectedFields: string[]
	onToggleField: (field: string) => void
}

const Section01ProjectField = ({ selectedFields, onToggleField }: ISection01ProjectField) => {
	const fieldOptions = [...INTEREST_FIELDS.filter(f => f !== '기타'), '직접 작성']

	return (
		<div className='flex flex-col gap-4 pl-5'>
			<h3 className='title-2 font-bold text-neutral-900'>
				프로젝트 분야 <span className='text-danger-700'>*</span>
			</h3>
			<div className='flex flex-wrap gap-2'>
				{fieldOptions.map(field => {
					const isSelected = selectedFields.includes(field)
					const isDirectInput = field === '직접 작성'

					return (
						<button
							key={field}
							type='button'
							onClick={() => !isDirectInput && onToggleField(field)}
							className={`px-3 py-1.5 rounded-100 body-2 transition-colors ${
								isSelected
									? 'bg-primary-100-light border border-primary-400-normal text-primary-600-normal font-semibold'
									: isDirectInput
										? 'bg-neutral-100 border border-neutral-200 text-neutral-400 cursor-default'
										: 'bg-neutral-000 border border-neutral-200 text-neutral-600 hover:border-neutral-300'
							}`}
						>
							{field}
						</button>
					)
				})}
			</div>
		</div>
	)
}

export default Section01ProjectField
