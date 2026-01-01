import Accordion from '@/components/common/Accordion'
import BackButton from '@/components/common/BackButton'
import Button from '@/components/common/Button'
import CheckboxItem from '@/components/common/CheckboxItem'
import ChipButton from '@/components/common/ChipButton'
import Input from '@/components/common/Input'
import ProgressBar from '@/components/common/ProgressBar'
import { useState } from 'react'

const chipButtonList = ['UX', '그래픽', 'UI']
const accordionList = ['Photoshop', 'Illustrator', 'Indesign', 'XD', 'aaa', 'bbb', 'ccc']

const MainPage = () => {
	const [selectedChips, setSelectedChips] = useState<string[]>([])
	const [selectedSkills, setSelectedSkills] = useState<string[]>([])

	const handleToggle = (text: string) => {
		setSelectedChips(prev => {
			if (prev.includes(text)) {
				return prev.filter(item => item != text)
			}
			return [...prev, text]
		})
	}

	const toggleSkill = (skill: string) => {
		setSelectedSkills(prev => (prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]))
	}

	return (
		<div>
			<h1 className='heading-1 text-semantic-500 bg-semantic-200 p-4 rounded-100 shadow-brand'>MainPage</h1>

			{/* 공용 컴포넌트 테스트 렌더링용 */}
			<div className='flex flex-col gap-2 mt-10'>
				<Input placeholder='닉네임' success='성공메시지' />
				<Input placeholder='닉네임' error='에러메시지' />
				<Button size='lg' disabled>
					다음
				</Button>

				<Button size='sm'>다다음</Button>
				<Button>다다음</Button>
				<Button size='lg'>다다음</Button>
				<Button fullWidth>다다다음</Button>

				<ProgressBar />
				<BackButton />

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

				<Accordion title='Adobe'>
					<div className='flex flex-col'>
						{accordionList.map(skill => (
							<CheckboxItem
								key={skill}
								label={skill}
								checked={selectedSkills.includes(skill)}
								onChange={() => toggleSkill(skill)}
							/>
						))}
					</div>
				</Accordion>
				<Accordion title='Adobe' defaultOpen={true}>
					<div className='flex flex-col'>
						{accordionList.map(skill => (
							<CheckboxItem
								key={skill}
								label={skill}
								checked={selectedSkills.includes(skill)}
								onChange={() => toggleSkill(skill)}
							/>
						))}
					</div>
				</Accordion>
			</div>
		</div>
	)
}

export default MainPage
