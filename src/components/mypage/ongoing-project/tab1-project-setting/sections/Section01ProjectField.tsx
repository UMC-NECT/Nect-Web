import { PROJECT_FIELD_OPTIONS } from '@/utils/projectField'

interface ISection01ProjectField {
	selectedField: string
	onSelectField: (value: string) => void
}

const Section01ProjectField = ({ selectedField, onSelectField }: ISection01ProjectField) => {
	return (
		<div className='flex flex-col gap-4 pl-5'>
			<h3 className='title-2 font-bold text-neutral-900'>
				프로젝트 분야 <span className='text-danger-700'>*</span>
			</h3>
			<div className='flex flex-wrap gap-2'>
				{PROJECT_FIELD_OPTIONS.map(field => {
					const isSelected = selectedField === field.value

					return (
						<button
							key={field.value}
							type='button'
							onClick={() => onSelectField(field.value)}
							className={`px-3 py-1.5 rounded-100 body-2 transition-colors ${
								isSelected
									? 'bg-primary-100-light border border-primary-400-normal text-primary-600-normal font-semibold'
									: 'bg-neutral-000 border border-neutral-200 text-neutral-600 hover:border-neutral-300'
							}`}
						>
							{field.label}
						</button>
					)
				})}
			</div>
		</div>
	)
}

export default Section01ProjectField
