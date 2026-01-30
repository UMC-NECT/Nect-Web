import type { Skill } from '@/stores/profileAnalysisStore'

const SkillSection = ({ skillName, skillList }: Skill) => {
	return (
		<div className='flex w-full items-center gap-3'>
			<p className='title-3 font-semibold text-neutral-900 shrink-0 w-16'>{skillName}</p>
			<div className='flex flex-wrap gap-1.5'>
				{skillList.map(skill => (
					<span
						key={skill}
						className='px-4 py-1.5 bg-white border border-[#eeeeee] rounded-100 body-1 font-medium text-neutral-700'
					>
						{skill}
					</span>
				))}
			</div>
		</div>
	)
}

export default SkillSection