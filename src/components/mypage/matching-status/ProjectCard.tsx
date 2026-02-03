import { cn } from '@/utils/cn'

interface ProjectCardProps {
	/** 프로젝트 이름 */
	projectName: string
	/** 프로젝트 카테고리 (예: "금융 · 핀테크") */
	category: string
	/** 프로젝트 설명 */
	description: string
	/** 현재 팀원 수 */
	currentMembers: number
	/** 전체 팀원 수 */
	totalMembers: number
	/** 클릭 핸들러 */
	onClick?: () => void
	/** 추가 클래스명 */
	className?: string
}

const ProjectCard = ({ projectName, category, description, currentMembers, totalMembers, onClick, className }: ProjectCardProps) => {
	return (
		<div
			className={cn(
				'bg-neutral-000 border-[1.5px] border-neutral-200 border-solid flex flex-col items-start overflow-clip px-[22px] py-4 relative rounded-12 w-[478px] h-[124px] cursor-pointer',
				onClick && 'hover:border-primary-400-normal transition-colors',
				className
			)}
			onClick={onClick}
		>
			<div className="flex flex-col gap-3 items-start relative shrink-0 w-full">
				{/* 상단: 프로젝트 이름 + 카테고리 */}
				<div className="flex items-start justify-between relative shrink-0 w-full">
					<div className="flex flex-1 flex-col gap-1.5 items-start min-h-0 min-w-0 relative">
						{/* 프로젝트 이름 | 카테고리 */}
						<div className="flex gap-1.5 h-[26px] items-center relative shrink-0 w-full">
							<p className="body-1 font-semibold text-neutral-900 whitespace-nowrap leading-[1.5]">
								<span className="font-bold">{projectName}</span>
							</p>
							<div className="bg-neutral-300 h-3 rounded-[6px] shrink-0 w-0.5" />
							<p className="body-2 font-semibold text-neutral-500 whitespace-nowrap leading-[1.4]">{category}</p>
						</div>
						{/* 프로젝트 설명 */}
						<p className="body-2 font-medium text-neutral-600 overflow-hidden relative shrink-0 text-ellipsis w-full whitespace-nowrap leading-[1.5]">
							{description}
						</p>
					</div>
				</div>

				{/* 하단: 팀원 수 */}
				<div className="flex items-center justify-between relative shrink-0 w-full">
					<p className="body-1 font-medium text-neutral-700 overflow-hidden relative shrink-0 text-ellipsis leading-[1.5]">
						<span className="text-neutral-500">팀원</span>
						<span>{` ${currentMembers}`}</span>
						<span>/</span>
						<span>{totalMembers}</span>
					</p>
				</div>
			</div>
		</div>
	)
}

export default ProjectCard
