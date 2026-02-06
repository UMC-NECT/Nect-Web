import { useState } from 'react'
import { useUserStore } from '@/stores/useUserStore'
import ContentHeader from '@/components/team-board/ContentHeader'
import BoardListItem from '@/components/team-board/BoardListItem'
import BoardListHeader from '@/components/team-board/BoardListHeader'
import BoardPagination from '@/components/team-board/BoardPagination'
import WritePostModal from '@/components/team-board/WritePostModal'

const BoardPage = () => {
	const { userName } = useUserStore()
	const [currentPage, setCurrentPage] = useState(1)
	const [isWriteModalOpen, setIsWriteModalOpen] = useState(false)
	const [isViewModalOpen, setIsViewModalOpen] = useState(false)
	const [selectedPost, setSelectedPost] = useState<{
		title: string
		content: string
		isNotice: boolean
		tag?: string
		author?: string
	} | null>(null)

	const handleWriteClick = () => {
		setIsWriteModalOpen(true)
	}

	const handleSavePost = (title: string, content: string, isNotice: boolean, files: File[]) => {
		console.log('게시글 저장:', { title, content, isNotice, files })
		// TODO: API 호출로 게시글 저장
	}

	const handleItemClick = (item: { tag?: string; title: string; author: string; date: string }) => {
		// 샘플 데이터로 모달 열기 (실제로는 API에서 가져온 데이터 사용)
		setSelectedPost({
			title: item.title,
			content: '프로젝트 공동 경비 사용 내역 프로젝트 공동 경비 사용 내역프로젝트 공동 경비 사용 내역\n링크 첨부해두겠습니다',
			isNotice: !!item.tag,
			tag: item.tag,
			author: item.author,
		})
		setIsViewModalOpen(true)
	}

	const handleUpdatePost = (title: string, content: string, isNotice: boolean, files: File[]) => {
		console.log('게시글 수정:', { title, content, isNotice, files })
		// TODO: API 호출로 게시글 수정
	}

	const handleDeletePost = () => {
		console.log('게시글 삭제')
		// TODO: API 호출로 게시글 삭제
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
                                onClick={() => handleItemClick(item)}
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

			{/* 글쓰기 모달 */}
			<WritePostModal
				isOpen={isWriteModalOpen}
				onClose={() => setIsWriteModalOpen(false)}
				onSave={handleSavePost}
			/>

			{/* 게시글 조회 모달 */}
			{selectedPost && (
				<WritePostModal
					mode="view"
					isOpen={isViewModalOpen}
					onClose={() => {
						setIsViewModalOpen(false)
						setSelectedPost(null)
					}}
					initialTitle={selectedPost.title}
					initialContent={selectedPost.content}
					initialIsNotice={selectedPost.isNotice}
					initialAttachments={[
						{
							id: '1',
							type: 'link',
							name: '파일 정보',
							url: 'https://www.figma.com/',
						},
						{
							id: '2',
							type: 'file',
							name: '파일 정보',
							fileName: '파일명: 파일명 한 줄까지 미리보기.png',
						},
					]}
					onUpdate={handleUpdatePost}
					onDelete={handleDeletePost}
					isOwner={false}
				/>
			)}
		</div>
	)
}

export default BoardPage
