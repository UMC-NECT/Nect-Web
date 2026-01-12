import Accordion from '@/components/common/Accordion'
import CheckboxItem from '@/components/common/CheckboxItem'
import DividerLine from '@/components/common/DividerLine'
import Input from '@/components/common/Input'
import TagButton from '@/components/common/TagButton'
import { useState } from 'react'

const skillsTitle = ['디자인', '개발', '기획', '마케팅', '기타']
const skillsDetail: Record<string, string[]> = {
	디자인: [
		'Figma',
		'Protopie',
		'Adobe Photoshop',
		'Adobe Illustrator',
		'Adobe Indesign',
		'Adobe XD',
		'Final Cut Pro',
		'Adobe Premiere Pro',
		'Adobe After Effect',
		'Adobe Firefly',
		'Mdjourney',
		'Nano Banana',
		'DALL.E',
		'Blender',
		'Cinema 4d',
		'VFX',
		'MAYA',
		'ZBrush',
		'Sketch up',
		'Auto CAD',
		'3D Max',
		'Rhino',
		'Keyshot',
		'Procreate',
		'Enscape',
	],
	개발: [
		'Java',
		'HTML/CSS',
		'JavaScript',
		'TypeScript',
		'Python',
		'React',
		'Spring',
		'Spring Boot',
		'Node.js',
		'Vue.js',
		'Next.js',
		'Docker',
		'AWS',
		'MySQL',
		'GO',
		'C#',
		'Swift',
		'Android Studio',
		'Kotlin',
		'Flutter',
		'React Native',
		'PostgreSQL',
		'C++',
		'JSP',
		'Git',
		'GitHub',
		'Kubernetes',
	],
	기획: ['Notion', 'Ux Research', 'Slack', 'Jira', 'Confluence', 'Balsamiq', 'Miro', 'Google Analytics', 'Amplitude', 'Excel'],
	마케팅: [
		'Google Tag Manager',
		'AppsFlyer',
		'Meta Ads Manager',
		'Google Ads',
		'Kakao Moment',
		'Canve',
		'Braze',
		'Solapi',
		'Mailchimp',
	],
	기타: [
		'Chat GPT',
		'Trados',
		'Live Streaming',
		'Google Gemini',
		'Memsource',
		'VMD',
		'Claude',
		'Consecutive Interpretation',
		'3D Rendering',
		'Google Workspace',
		'Pro Tools',
		'Safety Management',
		'Canva',
		'Logic Pro',
		'Power BI',
		'Miricanvas',
		'Ableton Live',
		'CRM Setup',
		'Channel Talk',
		'iZotope RX',
		'CapCut',
		'DaVinci Resolve',
		'Vrew',
		'Storyboarding',
		'DeepL',
		'Drone Piloting',
	],
}

const Step3 = () => {
	const [selectedSkill, setSelectedSkill] = useState<string[]>([]) // 선택한 스킬들
	const [inputValue, setInputValue] = useState('') // 직접 입력한 필드

	// 스킬 선택 (왼쪽꺼)
	const handleSelectSkill = (skill: string) => {
		const newFields = selectedSkill.includes(skill) ? selectedSkill.filter(f => f !== skill) : [...selectedSkill, skill]

		setSelectedSkill(newFields)
	}

	// 직접 입력한 스킬 추가 (엔터누르면 추가됨)
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && inputValue.trim() && !e.nativeEvent.isComposing) {
			e.preventDefault()
			if (!selectedSkill.includes(inputValue.trim())) {
				setSelectedSkill([...selectedSkill, inputValue.trim()])
			}
			setInputValue('')
		}
	}

	// 카테고리별로 선택된 스킬을 그룹화
	const groupedSkills = skillsTitle.reduce(
		(acc, title) => {
			const categorySkills = skillsDetail[title]?.filter(skill => selectedSkill.includes(skill)) || []

			// "기타" 카테고리에 직접 입력한 스킬 추가
			if (title === '기타') {
				const customSkills = selectedSkill.filter(skill => {
					return !Object.values(skillsDetail).flat().includes(skill)
				})
				const allSkills = [...categorySkills, ...customSkills]
				if (allSkills.length > 0) {
					acc[title] = allSkills
				}
			} else if (categorySkills.length > 0) {
				acc[title] = categorySkills
			}
			return acc
		},
		{} as Record<string, string[]>
	)

	return (
		<div className='flex flex-col justify-center items-center'>
			{/* 제목 */}
			<div className='flex flex-col justify-center items-center gap-3.25 mb-17.5'>
				<div className='heading-3 text-neutral-900'>
					활용 가능한 <span className='text-primary-500-normal'>대표 스킬</span>을 등록해주세요
				</div>
				<div className='title-2 text-neutral-500'>추후 프로필에서 변경 가능해요</div>
			</div>

			{/* 컨텐츠 */}
			<div className='sm:w-150 md:w-250 lg:w-350 flex justify-center items-start ml-24'>
				{/* 왼쪽 */}
				<div className='max-w-85.75 sm:w-50 md:w-60 lg:w-80 flex flex-col gap-1.5'>
					{skillsTitle.map(title => (
						<Accordion
							key={title}
							title={title}
							children={
								<>
									{skillsDetail[title]?.map(skill => (
										<CheckboxItem
											key={skill}
											label={skill}
											checked={selectedSkill.includes(skill)}
											onChange={handleSelectSkill}
										/>
									))}
								</>
							}
						/>
					))}

					{/* 직접입력 */}
					<Input
						placeholder='직접입력 후 Enter'
						className='body-1 placeholder:body-1 placeholder:text-neutral-300 px-5 py-3.25'
						value={inputValue}
						onChange={e => setInputValue(e.target.value)}
						onKeyDown={handleKeyDown}
					/>
				</div>

				{/* 구분선 */}
				<DividerLine />

				{/* 오른쪽 */}
				<div className='w-109.5 sm:w-60 md:w-90 lg:w-100 h-84.25 flex flex-col justify-between'>
					<div className='overflow-y-auto flex flex-col gap-5'>
						{Object.keys(groupedSkills).length === 0 ? (
							<div className='body-1 text-neutral-400'></div>
						) : (
							Object.entries(groupedSkills).map(([category, skills]) => (
								<div key={category} className='flex flex-col gap-3'>
									<div className='body-1 font-semibold text-neutral-800'>{category}</div>
									<div className='flex flex-wrap gap-2'>
										{skills.map(skill => (
											<TagButton key={skill} text={skill} onClick={() => handleSelectSkill(skill)} />
										))}
									</div>
								</div>
							))
						)}
					</div>

					{/* 선택한 항목 개수 */}
					<div className='body-3 text-end text-status-success'>{selectedSkill.length}/20</div>
				</div>
			</div>
		</div>
	)
}

export default Step3
