import type { UserSkillType } from '@/types/api/mypage'

interface ISection05Skills {
	skills: UserSkillType[]
}

const Section05Skills = ({ skills }: ISection05Skills) => {
	// 선택된 스킬이 있는 카테고리만 필터링
	const categoriesWithSelectedSkills = (skills ?? []).filter(category =>
		category.skills?.some(skill => skill.isSelected)
	)

	return (
		<section className='my-2.5 ml-5'>
			<div className='flex items-center justify-between mb-4'>
				<h2 className='title-2 font-bold text-neutral-900'>
					보유스킬 <span className='text-danger-700'>*</span>
				</h2>
			</div>

			<div className='flex flex-col gap-5'>
				{categoriesWithSelectedSkills.map(category => (
					<div key={category.category} className='flex items-center gap-3'>
						{/* 카테고리 */}
						<span className='body-1 text-neutral-600 w-16 shrink-0'>{category.categoryLabel}</span>

						{/* 태그 */}
						<div className='flex flex-wrap gap-1.5'>
							{category.skills
								.filter(skill => skill.isSelected)
								.map(skill => (
									<span
										key={skill.skill}
										className='body-1 bg-neutral-000 text-neutral-700 border border-[#EEEEEE] px-4 py-1.5 rounded-100'
									>
										{skill.skillLabel}
									</span>
								))}
						</div>
					</div>
				))}
			</div>
		</section>
	)
}

export default Section05Skills
