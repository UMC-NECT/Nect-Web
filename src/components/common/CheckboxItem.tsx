interface ICheckboxItem {
	label: string
	checked: boolean
	onChange: () => void
}

const CheckboxItem = ({ label, checked, onChange }: ICheckboxItem) => (
	<label className='flex items-center gap-1.5 px-3 py-3.5 cursor-pointer hover:bg-neutral-100 duration-200 ease-in-out '>
		<input
			type='checkbox'
			className='w-5 h-5 appearance-none rounded border-0 cursor-pointer
				checked:bg-primary-500-normal checked:border-primary-500-normal
				bg-neutral-200
				relative
				after:content-["✓"] after:absolute after:text-white 
				after:text-sm after:left-1/2 after:top-1/2 
				after:-translate-x-1/2 after:-translate-y-1/2'
			checked={checked}
			onChange={onChange}
		/>
		<span className='text-[#666666] body-2'>{label}</span>
	</label>
)

export default CheckboxItem
