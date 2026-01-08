import { useRef, useState } from 'react'
import Input from './Input'
import { useOutsideClick } from '@/hooks/useOutsideClick'

interface IDropdown {
	options: string[]
	value: string
	placeholder: string
	onSelect: (value: string) => void
}

const Dropdown = ({ options, value, placeholder, onSelect }: IDropdown) => {
	const [isOpen, setIsOpen] = useState<boolean>(false)

	// 드롭다운 외부 클릭시, 자동으로 닫히도록
	const dropdownRef = useRef<HTMLDivElement>(null)
	useOutsideClick(dropdownRef, () => setIsOpen(false))

	// 항목 선택했을때 핸들러
	const handleSelect = (option: string) => {
		onSelect(option)
		setIsOpen(false)
	}

	return (
		<div className='relative' ref={dropdownRef}>
			<Input
				placeholder={placeholder || ''}
				readOnly
				value={value || ''}
				className='cursor-pointer caret-transparent'
				onClick={() => setIsOpen(prev => !prev)}
			/>

			{isOpen && (
				<ul className='absolute z-10 w-full '>
					{options.map(option => (
						<li
							key={option}
							className='body-1 text-neutral-400 bg-neutral-50 border border-neutral-200 rounded-10 px-5 py-2.5 cursor-pointer hover:bg-neutral-300 hover:text-neutral-700 duration-200 ease-in-out'
							onClick={() => handleSelect(option)}
						>
							{option}
						</li>
					))}
				</ul>
			)}
		</div>
	)
}

export default Dropdown
