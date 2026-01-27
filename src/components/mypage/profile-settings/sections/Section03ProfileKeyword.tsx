import Button from '../../../common/Button'
import RefreshIcon from '@/assets/icons/mypage/refresh.svg?react'

const Section03ProfileKeyword = () => {
	return (
		<section className='my-2.5'>
			<div className='flex items-center justify-between'>
				<h2 className='title-2 font-bold text-neutral-900 ml-5'>
					프로필 분석 키워드 <span className='text-danger-700'>*</span>
				</h2>

				<Button color='text' size='sm'>
					<RefreshIcon className='w-4 h-4 mr-1' />
					불러오기
				</Button>
			</div>

			{/* 검사 결과 */}
			<div className='px-5 py-4'>
				<p className='text-[16px] leading-[180%] tracking-[-0.5px] text-primary-500-normal font-medium'>
					[섬세한 서포터형] 타입
				</p>
				<p className='text-[16px] leading-[180%] tracking-[-0.5px] text-neutral-600'>
					#포트폴리오 집중 #신중한 설계자 #비주얼 전문가
				</p>
			</div>
		</section>
	)
}

export default Section03ProfileKeyword
