import XIcon from '@/assets/icons/common/X.svg?react'

interface ITagButton {
	text: string
	onClick: () => void
}

const TagButton = ({ text, onClick }: ITagButton) => {
	return (
		<>
			<div
				className='body-1 flex justify-center items-center gap-2 px-4 py-1.5 text-neutral-700 bg-neutral-100 border border-neutral-200 rounded-100 w-fit h-fit hover:bg-neutral-200 hover:border-neutral-300 cursor-pointer duration-200 ease-in-out'
				onClick={onClick}
			>
				<span>{text}</span>
				<XIcon className='w-2 h-2' />
			</div>
		</>
	)
}

export default TagButton
