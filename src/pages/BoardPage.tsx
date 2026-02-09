import { useState, useMemo } from 'react'
import ContentHeader from '@/components/team-board/ContentHeader'
import BoardListItem from '@/components/team-board/BoardListItem'
import BoardListHeader from '@/components/team-board/BoardListHeader'
import BoardPagination from '@/components/team-board/BoardPagination'
import WritePostModal from '@/components/team-board/WritePostModal'
import { usePostList } from '@/hooks/team-board/usePostList'
import { useCreatePostMutation } from '@/hooks/team-board/useCreatePost'

const BoardPage = () => {
	// TODO: URL에서 projectId 가져오기
	const projectId = 1

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

	// 게시글 목록 API 호출 (페이지는 0부터 시작하므로 currentPage - 1)
	const { data: postListResponse, isLoading } = usePostList(projectId, {
		page: currentPage - 1, // API는 0부터 시작
	})
	const postList = postListResponse?.body

	// 게시글 생성 mutation
	const createPostMutation = useCreatePostMutation(projectId)

	const handleWriteClick = () => {
		setIsWriteModalOpen(true)
	}

	const handleSavePost = (title: string, content: string, isNotice: boolean, files: File[]) => {
		// API 호출로 게시글 저장
		createPostMutation.mutate({
			title,
			content,
			is_notice: isNotice,
			mention_user_ids: [], // TODO: 멘션 기능 추가 시 구현
		})

		// 성공 시 모달 닫기
		setIsWriteModalOpen(false)
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
	}

	/**
	 * ISO 날짜 포맷 변환: "2026-01-31T10:00:00" -> "2026.01.31"
	 */
	const formatISODateForDisplay = (isoDateString: string): string => {
		const date = new Date(isoDateString)
		const year = date.getFullYear()
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const day = String(date.getDate()).padStart(2, '0')
		return `${year}.${month}.${day}`
	}

	/**
	 * 게시글 데이터를 BoardListItem 형식으로 변환
	 */
	const boardItems = useMemo(() => {
		if (!postList?.posts || postList.posts.length === 0) {
			return []
		}

		return postList.posts.map((post) => {
			// post_type에 따른 tag 설정
			let tag: string | undefined
			if (post.post_type === 'NOTICE') {
				tag = '[공지]'
			} else if (post.post_type === 'REQUIRED') {
				tag = '[필독]'
			}

			return {
				tag,
				title: post.title,
				author: '', // API 응답에 작성자 정보가 없음
				date: formatISODateForDisplay(post.created_at),
			}
		})
	}, [postList])

	// 페이지네이션 정보 (API에서 받은 정보 사용)
	const totalPages = postList?.page_info?.total_pages || 1
	const currentItems = boardItems

	// 샘플 데이터 (로딩 중이거나 데이터가 없을 때 사용하지 않음)
	const sampleBoardItems = [
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

	return (
		<div className="flex flex-col w-full mx-auto px-6 py-[64px] gap-[30px]">
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
                    
                        {isLoading ? (
							<div className="flex items-center justify-center h-full">로딩 중...</div>
						) : currentItems.length > 0 ? (
							currentItems.map((item, index) => (
								                            <BoardListItem
	                                key={`${item.title}-${index}`}
	                                tag={item.tag}
	                                title={item.title}
	                                author={item.author}
	                                date={item.date}
	                                onClick={() => handleItemClick(item)}
	                            />
	                        ))
						) : (
							<div className="flex items-center justify-center h-full text-neutral-400">게시글이 없습니다.</div>
						)}
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
