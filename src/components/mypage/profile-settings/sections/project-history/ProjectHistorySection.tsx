import Button from '../../../../common/Button'
import ProjectCard from './ProjectCard'

export const ProjectHistorySection = () => {
	return (
		<section className='ml-5'>
			<div className='flex items-center justify-between mb-4'>
				<h2 className='title-2 font-bold text-neutral-900'>넥트 프로젝트 히스토리</h2>

				<Button color='text' size='sm'>
					+ 프로젝트 추가
				</Button>
			</div>

			{/* 프로젝트 카드 */}
			<ProjectCard
				title='트리플 UX.UI 개선 및 리브랜딩'
				description='사용 체류 시간을 늘리고 기업 비전에 맞ㄱ게 전략 및 BI 제안 / 여행의 전반에 활용 될 수 있는 UX Flow 개선 / GUI 제작'
				date='2025.10~2025.12'
			/>
		</section>
	)
}
