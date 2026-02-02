import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form'
import BulletTextArea from './BulletTextArea'

interface IFormBulletTextArea<T extends FieldValues> {
	name: Path<T>
	control: Control<T>
	sectionTitle?: string
	hasStar?: boolean
	placeholder?: string
	className?: string
	minHeight?: string
}

const FormBulletTextArea = <T extends FieldValues>({
	name,
	control,
	sectionTitle,
	hasStar = true,
	placeholder,
	className,
	minHeight,
}: IFormBulletTextArea<T>) => {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field: { value, onChange } }) => (
				<BulletTextArea
					value={value || ''}
					onChange={onChange}
					sectionTitle={sectionTitle}
					hasStar={hasStar}
					placeholder={placeholder}
					className={className}
					minHeight={minHeight}
				/>
			)}
		/>
	)
}

export default FormBulletTextArea
