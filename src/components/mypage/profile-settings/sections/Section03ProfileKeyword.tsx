import Button from '../../../common/Button'
import RefreshIcon from '@/assets/icons/mypage/refresh.svg?react'

interface ISection03ProfileKeyword {
	hasProfileKeyword: boolean
	onRefresh: () => void
	/** /api/v1/mypage/profile 응답 body.profileType */
	profileType?: string
	/** /api/v1/mypage/profile 응답 body.tags */
	tags?: string[]
}

const Section03ProfileKeyword = ({
	hasProfileKeyword,
	onRefresh,
	profileType = '',
	tags = [],
}: ISection03ProfileKeyword) => {
	const hasContent = hasProfileKeyword || !!profileType || tags.length > 0

	return (
		<section className='my-2.5'>
			<div className='flex items-center justify-between'>
				<h2 className='title-2 font-bold text-neutral-900 ml-5'>
					프로필 분석 키워드 <span className='text-danger-700'>*</span>
				</h2>

				<Button color='text' size='sm' onClick={onRefresh} className='group'>
					<RefreshIcon className='w-4 h-4 mr-1 text-neutral-400 group-hover:text-neutral-500' />
					불러오기
				</Button>
			</div>

			{/* 검사 결과 */}
			<div className='px-5 py-4'>
				{hasContent ? (
					<>
						{profileType && (
							<p className='font-semibold text-[16px] leading-[180%] text-primary-500-normal'>
								[{profileType}] 타입
							</p>
						)}
						{tags.length > 0 && (
							<p className='font-medium text-[16px] leading-[180%] text-neutral-600'>
								{tags.map(tag => (tag.startsWith('#') ? tag : `#${tag}`)).join(' ')}
							</p>
						)}
					</>
				) : (
					<div className='text-neutral-300 text-[16px]'>나의 프로필 분석 시 채워집니다.</div>
				)}
			</div>
		</section>
	)
}

export default Section03ProfileKeyword
