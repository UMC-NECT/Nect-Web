interface SkillsSectionProps {
	skills: Record<string, string[]>
}

export const SkillsSection = ({ skills }: SkillsSectionProps) => {
	return (
		<section className='my-2.5 ml-5'>
			<div className='flex items-center justify-between mb-4'>
				<h2 className='title-2 font-bold text-neutral-900'>
					보유스킬 <span className='text-danger-700'>*</span>
				</h2>
			</div>

			<div className='flex flex-col gap-5'>
				{Object.entries(skills).map(([category, skillList]) => (
					<div key={category} className='flex items-center gap-3'>
						{/* 카테고리 */}
						<span className='body-1 text-neutral-600 w-16 shrink-0'>{category}</span>

						{/* 태그 */}
						<div className='flex flex-wrap gap-1.5'>
							{skillList.map(skill => (
								<span
									key={skill}
									className='body-1 bg-neutral-000 text-neutral-700 border border-[#EEEEEE] px-4 py-1.5 rounded-100'
								>
									{skill}
								</span>
							))}
						</div>
					</div>
				))}
			</div>
		</section>
	)
}
