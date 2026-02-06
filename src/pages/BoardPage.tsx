import ContentHeader from '@/components/team-board/ContentHeader'

const BoardPage = () => {
	const handleWriteClick = () => {
		console.log('글쓰기 클릭')
		// TODO: 글쓰기 모달 또는 페이지로 이동
	}

	return (
		<div className="flex flex-col w-full max-w-[1440px] mx-auto px-6 py-8 gap-7">
			<ContentHeader
				title="게시판"
				description="팀 전용 게시판입니다. 공지사항, 회의록, 업무 보고 등을 공유할 수 있습니다."
				buttonText="글쓰기"
				onButtonClick={handleWriteClick}
			/>
		</div>
	)
}

export default BoardPage
