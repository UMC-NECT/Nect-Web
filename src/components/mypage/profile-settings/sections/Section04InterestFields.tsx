import { Controller, type Control } from 'react-hook-form'
import RoundChipButton from '../../../common/RoundChipButton'
import { INTEREST_FIELDS } from '@/constants/mypage'
import type { ProfileFormDataType } from '@/utils/schemas/profileSchema'

interface ISection04InterestFields {
	control: Control<ProfileFormDataType>
}

const Section04InterestFields = ({ control }: ISection04InterestFields) => {
	return (
		<section className=' ml-5'>
			<h2 className='title-2 font-bold text-neutral-900 mb-4'>
				관심 분야 <span className='text-danger-700'>*</span>
			</h2>

			<Controller
				name='interestFields'
				control={control}
				render={({ field }) => (
					<div>
						<div className='flex flex-wrap gap-3'>
							{INTEREST_FIELDS.map(fieldName => {
								const isChecked = field.value.includes(fieldName)
								const toggleField = () => {
									const newFields = isChecked
										? field.value.filter(f => f !== fieldName)
										: [...field.value, fieldName]
									field.onChange(newFields)
								}

								return (
									<RoundChipButton
										key={fieldName}
										text={fieldName}
										isChecked={isChecked}
										onClick={toggleField}
										className='w-auto'
									/>
								)
							})}
						</div>
					</div>
				)}
			/>
		</section>
	)
}

export default Section04InterestFields
