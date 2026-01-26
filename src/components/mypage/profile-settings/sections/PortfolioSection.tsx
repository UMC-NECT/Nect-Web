import Button from '../../../common/Button'
import ClipIcon from '@/assets/icons/mypage/clip.svg?react'

export const PortfolioSection = () => {
	return (
		<section className='ml-5'>
			<div className='flex items-center justify-between mb-1.5'>
				<h2 className='title-2 font-bold text-neutral-900'>포트폴리오 링크 및 파일</h2>

				<Button color='text' size='sm'>
					+ 항목 추가
				</Button>
			</div>

			<div className='flex gap-2.5 items-start px-5 py-4'>
				<ClipIcon className='w-4.5 h-4.5 mt-1' />
				<div>
					<p className='body-1 text-neutral-300'>제목</p>
					<p className='body-1 text-neutral-300'>링크 붙여넣기 및 파일 드래그</p>
				</div>
			</div>
		</section>
	)
}
