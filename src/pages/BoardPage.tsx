import { useState } from 'react'
import ContentHeader from '@/components/team-board/ContentHeader'
import BoardListItem from '@/components/team-board/BoardListItem'
import BoardListHeader from '@/components/team-board/BoardListHeader'
import BoardPagination from '@/components/team-board/BoardPagination'

const BoardPage = () => {
	const [currentPage, setCurrentPage] = useState(1)

	const handleWriteClick = () => {
		console.log('글쓰기 클릭')
		// TODO: 글쓰기 모달 또는 페이지로 이동
	}

	const handleItemClick = (title: string) => {
		console.log('게시글 클릭:', title)
		// TODO: 게시글 상세 페이지로 이동
	}

	const handlePageChange = (page: number) => {
		setCurrentPage(page)
		// TODO: 페이지 변경 시 API 호출
	}

	// 샘플 데이터
	const boardItems = [
		{
			tag: '[공지]',
			title: '공지 내용 이거는 팀보드 공지사항이랑 별개입니다 그냥 게시판 공지',
			author: '시루',
			date: '0000.00.00',
		},
		{
			tag: '[필독]',
			title: '팀별 주간 업무 보고 양식 안내',
			author: '이방토',
			date: '2024.1.10',
		},
		{
			title: '이번주 회의는 없습니다 ! 다음주에 대면 회의로 만나요 ~',
			author: '닉네임5자',
			date: '2024.01.10',
		},
		{
			title: '회의록 (댓글에 변동사항 추가)',
			author: '시루',
			date: '2024.1.10',
		},
		{
			title: '프로젝트 공동 경비 사용 내역',
			author: '이방토',
			date: '0000.00.00',
		},
        {
			title: '프로젝트 공동 경비 사용 내역',
			author: '이방토',
			date: '0000.00.00',
		},
        {
			tag: '[공지]',
			title: '공지 내용 이거는 팀보드 공지사항이랑 별개입니다 그냥 게시판 공지',
			author: '시루',
			date: '0000.00.00',
		},
		{
			tag: '[필독]',
			title: '팀별 주간 업무 보고 양식 안내',
			author: '이방토',
			date: '2024.1.10',
		},
		{
			title: '이번주 회의는 없습니다 ! 다음주에 대면 회의로 만나요 ~',
			author: '닉네임5자',
			date: '2024.01.10',
		},
		{
			title: '회의록 (댓글에 변동사항 추가)',
			author: '시루',
			date: '2024.1.10',
		},
		{
			title: '프로젝트 공동 경비 사용 내역',
			author: '이방토',
			date: '0000.00.00',
		},
        {
			title: '프로젝트 공동 경비 사용 내역',
			author: '이방토',
			date: '0000.00.00',
		},
        {
			tag: '[공지]',
			title: '공지 내용 이거는 팀보드 공지사항이랑 별개입니다 그냥 게시판 공지',
			author: '시루',
			date: '0000.00.00',
		},
		{
			tag: '[필독]',
			title: '팀별 주간 업무 보고 양식 안내',
			author: '이방토',
			date: '2024.1.10',
		},
		{
			title: '이번주 회의는 없습니다 ! 다음주에 대면 회의로 만나요 ~',
			author: '닉네임5자',
			date: '2024.01.10',
		},
		{
			title: '회의록 (댓글에 변동사항 추가)',
			author: '시루',
			date: '2024.1.10',
		},
		{
			title: '프로젝트 공동 경비 사용 내역',
			author: '이방토',
			date: '0000.00.00',
		},
        {
			title: '프로젝트 공동 경비 사용 내역',
			author: '이방토',
			date: '0000.00.00',
		},
        {
			tag: '[공지]',
			title: '공지 내용 이거는 팀보드 공지사항이랑 별개입니다 그냥 게시판 공지',
			author: '시루',
			date: '0000.00.00',
		},
		{
			tag: '[필독]',
			title: '팀별 주간 업무 보고 양식 안내',
			author: '이방토',
			date: '2024.1.10',
		},
		{
			title: '이번주 회의는 없습니다 ! 다음주에 대면 회의로 만나요 ~',
			author: '닉네임5자',
			date: '2024.01.10',
		},
		{
			title: '회의록 (댓글에 변동사항 추가)',
			author: '시루',
			date: '2024.1.10',
		},
		{
			title: '프로젝트 공동 경비 사용 내역',
			author: '이방토',
			date: '0000.00.00',
		},
        {
			title: '프로젝트 공동 경비 사용 내역',
			author: '이방토',
			date: '0000.00.00',
		},
        {
			tag: '[공지]',
			title: '공지 내용 이거는 팀보드 공지사항이랑 별개입니다 그냥 게시판 공지',
			author: '시루',
			date: '0000.00.00',
		},
		{
			tag: '[필독]',
			title: '팀별 주간 업무 보고 양식 안내',
			author: '이방토',
			date: '2024.1.10',
		},
		{
			title: '이번주 회의는 없습니다 ! 다음주에 대면 회의로 만나요 ~',
			author: '닉네임5자',
			date: '2024.01.10',
		},
		{
			title: '회의록 (댓글에 변동사항 추가)',
			author: '시루',
			date: '2024.1.10',
		},
		{
			title: '프로젝트 공동 경비 사용 내역',
			author: '이방토',
			date: '0000.00.00',
		},
        {
			title: '프로젝트 공동 경비 사용 내역',
			author: '이방토',
			date: '0000.00.00',
		},
        {
			tag: '[공지]',
			title: '공지 내용 이거는 팀보드 공지사항이랑 별개입니다 그냥 게시판 공지',
			author: '시루',
			date: '0000.00.00',
		},
		{
			tag: '[필독]',
			title: '팀별 주간 업무 보고 양식 안내',
			author: '이방토',
			date: '2024.1.10',
		},
		{
			title: '이번주 회의는 없습니다 ! 다음주에 대면 회의로 만나요 ~',
			author: '닉네임5자',
			date: '2024.01.10',
		},
		{
			title: '회의록 (댓글에 변동사항 추가)',
			author: '시루',
			date: '2024.1.10',
		},
		{
			title: '프로젝트 공동 경비 사용 내역',
			author: '이방토',
			date: '0000.00.00',
		},
        {
			title: '프로젝트 공동 경비 사용 내역',
			author: '이방토',
			date: '0000.00.00',
		},
        {
			tag: '[공지]',
			title: '공지 내용 이거는 팀보드 공지사항이랑 별개입니다 그냥 게시판 공지',
			author: '시루',
			date: '0000.00.00',
		},
		{
			tag: '[필독]',
			title: '팀별 주간 업무 보고 양식 안내',
			author: '이방토',
			date: '2024.1.10',
		},
		{
			title: '이번주 회의는 없습니다 ! 다음주에 대면 회의로 만나요 ~',
			author: '닉네임5자',
			date: '2024.01.10',
		},
		{
			title: '회의록 (댓글에 변동사항 추가)',
			author: '시루',
			date: '2024.1.10',
		},
		{
			title: '프로젝트 공동 경비 사용 내역',
			author: '이방토',
			date: '0000.00.00',
		},
        {
			title: '프로젝트 공동 경비 사용 내역',
			author: '이방토',
			date: '0000.00.00',
		},
        {
			tag: '[공지]',
			title: '공지 내용 이거는 팀보드 공지사항이랑 별개입니다 그냥 게시판 공지',
			author: '시루',
			date: '0000.00.00',
		},
		{
			tag: '[필독]',
			title: '팀별 주간 업무 보고 양식 안내',
			author: '이방토',
			date: '2024.1.10',
		},
		{
			title: '이번주 회의는 없습니다 ! 다음주에 대면 회의로 만나요 ~',
			author: '닉네임5자',
			date: '2024.01.10',
		},
		{
			title: '회의록 (댓글에 변동사항 추가)',
			author: '시루',
			date: '2024.1.10',
		},
		{
			title: '프로젝트 공동 경비 사용 내역',
			author: '이방토',
			date: '0000.00.00',
		},
        {
			title: '프로젝트 공동 경비 사용 내역',
			author: '이방토',
			date: '0000.00.00',
		},
        {
			tag: '[공지]',
			title: '공지 내용 이거는 팀보드 공지사항이랑 별개입니다 그냥 게시판 공지',
			author: '시루',
			date: '0000.00.00',
		},
		{
			tag: '[필독]',
			title: '팀별 주간 업무 보고 양식 안내',
			author: '이방토',
			date: '2024.1.10',
		},
		{
			title: '이번주 회의는 없습니다 ! 다음주에 대면 회의로 만나요 ~',
			author: '닉네임5자',
			date: '2024.01.10',
		},
		{
			title: '회의록 (댓글에 변동사항 추가)',
			author: '시루',
			date: '2024.1.10',
		},
		{
			title: '프로젝트 공동 경비 사용 내역',
			author: '이방토',
			date: '0000.00.00',
		},
        {
			title: '프로젝트 공동 경비 사용 내역',
			author: '이방토',
			date: '0000.00.00',
		},
	]

	// 페이지네이션 계산 (한 페이지당 10개)
	const itemsPerPage = 10
	const totalPages = Math.ceil(boardItems.length / itemsPerPage)
	const startIndex = (currentPage - 1) * itemsPerPage
	const endIndex = startIndex + itemsPerPage
	const currentItems = boardItems.slice(startIndex, endIndex)

	return (
		<div className="flex flex-col w-full mx-auto px-6 py-8 gap-[30px]">
			<ContentHeader
				title="게시판"
				description="팀 전용 게시판입니다. 공지사항, 회의록, 업무 보고 등을 공유할 수 있습니다."
				buttonText="글쓰기"
				onButtonClick={handleWriteClick}
			/>

			{/* 게시판 리스트 컨테이너 */}
			<div className="w-[1224px] h-[596px] bg-neutral-000 rounded-xl border border-neutral-200 shadow-drop-neutral-2 flex flex-col overflow-hidden">
				
                <div className="flex flex-col justify-between h-full">
                    {/* 리스트 아이템들 */}
                    <div className="flex flex-col">
                        {/* 헤더 */}
                        <BoardListHeader />
                    
                        {currentItems.map((item, index) => (
                            <BoardListItem
                                key={index}
                                tag={item.tag}
                                title={item.title}
                                author={item.author}
                                date={item.date}
                                onClick={() => handleItemClick(item.title)}
                            />
                        ))}
                    </div>

                    {/* 페이지네이션 */}
                    {totalPages > 1 && (
                        <div className="flex gap-2.5 items-center justify-center pb-[26px]">
                            <BoardPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
			    </div>
            </div>
			
		</div>
	)
}

export default BoardPage
