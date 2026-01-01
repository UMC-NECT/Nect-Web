import Button from '@/components/common/Button'
import ChipButton from '@/components/common/ChipButton'
import Input from '@/components/common/Input'
import { useState } from 'react'

const chipButtonList = ['UX', '그래픽', 'UI']

const MainPage = () => {
	const [selectedChips, setSelectedChips] = useState<string[]>([])

	const handleToggle = (text: string) => {
		setSelectedChips(prev => {
			if (prev.includes(text)) {
				return prev.filter(item => item != text)
			}
			return [...prev, text]
		})
	}

	return (
		<div>
			<h1 className='heading-1 text-semantic-500 bg-semantic-200 p-4 rounded-100 shadow-brand'>MainPage</h1>

			{/* 공용 컴포넌트 테스트 렌더링용 */}
			<div className='flex flex-col gap-10 mt-10'>
				<Input placeholder='닉네임' success='성공메시지' />
				<Input placeholder='닉네임' error='에러메시지' />
				<Input placeholder='닉네임' className='w-full' />
				<Button size='lg' disabled>
					다음
				</Button>

				<Button size='sm'>다다음</Button>
				<Button>다다음</Button>
				<Button size='lg'>다다음</Button>
				<Button fullWidth>다다다음</Button>

				<div className='grid grid-cols-2 gap-x-2.5 gap-y-3 w-100'>
					{chipButtonList.map((text, index) => (
						<ChipButton
							key={index}
							text={text}
							onClick={() => handleToggle(text)}
							isChecked={selectedChips.includes(text)}
						/>
					))}
				</div>
			</div>
		</div>
	)
}

export default MainPage
