interface ISection01Introduction {
	value: string
	onChange: (value: string) => void
}

const Section01Introduction = ({ value, onChange }: ISection01Introduction) => {
	return (
		<section className='my-2.5'>
			<h2 className='title-2 font-bold text-neutral-900 mb-2 ml-5'>
				자기소개 <span className='text-danger-700'>*</span>
			</h2>

			<textarea
				className='w-full h-22.5 px-5 py-4 text-[16px] leading-[180%] tracking-[-0.5px] resize-none focus:outline-none placeholder:text-[16px] placeholder:text-neutral-300 hover:bg-neutral-50 duration-200 ease-in-out rounded-12'
				placeholder={`가장 먼저 읽게 되는 글입니다.\n프로필 카드에 보여질 간단한 자기소개를 작성해주세요 (2문장)`}
				value={value}
				onChange={e => onChange(e.target.value)}
			/>
		</section>
	)
}

export default Section01Introduction
