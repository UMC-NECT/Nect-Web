import { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import ContentHeader from '@/components/team-board/ContentHeader'
import BoardListItem from '@/components/team-board/BoardListItem'
import BoardListHeader from '@/components/team-board/BoardListHeader'
import BoardPagination from '@/components/team-board/BoardPagination'
import WritePostModal from '@/components/team-board/WritePostModal'
import { usePostList } from '@/hooks/team-board/usePostList'
import { useCreatePostMutation } from '@/hooks/team-board/useCreatePost'
import { usePostDetail } from '@/hooks/team-board/usePostDetail'
import { useUpdatePostMutation } from '@/hooks/team-board/useUpdatePost'
import { useDeletePostMutation } from '@/hooks/team-board/useDeletePost'
import { useGetProfileQuery } from '@/hooks/auth/useUsersApi'
import { uploadPostFile } from '@/api/team-board/boards'
import { getProjectUsers } from '@/api/project-users/projectUsers'
import type { PostAttachment } from '@/components/team-board/WritePostModalContent'

const BoardPage = () => {
	const { projectId: projectIdParam } = useParams<{ projectId?: string }>()
	const navigate = useNavigate()

	// 프로젝트 목록 조회 및 projectId 설정
	useEffect(() => {
		const fetchProjects = async () => {
			try {
				const response = await getProjectUsers()
				if (response.body) {
					// URL에 projectId가 없으면 첫 번째 프로젝트로 리다이렉트
					if (!projectIdParam && response.body.length > 0) {
						navigate(`/board/${response.body[0].projectId}`, { replace: true })
						return
					}
				}
			} catch (error) {
				console.error('프로젝트 목록 조회 실패:', error)
			}
		}
		fetchProjects()
	}, [projectIdParam, navigate])

	// URL에서 projectId 가져오기
	const projectId = projectIdParam ? parseInt(projectIdParam, 10) : null
	const queryClient = useQueryClient()

	const [currentPage, setCurrentPage] = useState(1)
	const [isWriteModalOpen, setIsWriteModalOpen] = useState(false)
	const [isViewModalOpen, setIsViewModalOpen] = useState(false)
	const [selectedPostId, setSelectedPostId] = useState<number | null>(null)

	// 게시글 목록 API 호출 (페이지는 0부터 시작하므로 currentPage - 1)
	const { data: postListResponse, isLoading } = usePostList(projectId || 0, {
		page: currentPage - 1, // API는 0부터 시작
	})
	const postList = postListResponse?.body

	// 게시글 생성 mutation
	const createPostMutation = useCreatePostMutation(projectId || 0)

	// 게시글 상세 조회
	const { data: postDetailResponse } = usePostDetail(projectId || 0, selectedPostId)
	const postDetail = postDetailResponse?.body

	// 게시글 수정 mutation
	const updatePostMutation = useUpdatePostMutation(projectId || 0, selectedPostId || 0)

	// 게시글 삭제 mutation
	const deletePostMutation = useDeletePostMutation(projectId || 0)

	// 현재 사용자 프로필 정보
	const { data: profileData } = useGetProfileQuery()
	const currentUserId = profileData?.body?.userId

	// 작성자 여부 확인
	const isOwner = useMemo(() => {
		if (!postDetail?.author || !currentUserId) return false
		return postDetail.author.user_id === currentUserId
	}, [postDetail?.author, currentUserId])

	const handleWriteClick = () => {
		setIsWriteModalOpen(true)
	}

	const handleSavePost = (title: string, content: string, isNotice: boolean, files: File[]) => {
		// API 호출로 게시글 저장
		createPostMutation.mutate(
			{
				title,
				content,
				is_notice: isNotice,
				mention_user_ids: [], // TODO: 멘션 기능 추가 시 구현
			},
			{
				onSuccess: async (response) => {
					// 게시글 생성 성공 후 파일 업로드
					const postId = response.body?.post_id
					if (postId && files.length > 0 && projectId) {
						try {
							// 모든 파일을 순차적으로 업로드
							for (const file of files) {
								await uploadPostFile(projectId, postId, file)
							}
						} catch (error) {
							console.error('파일 업로드 실패:', error)
							// TODO: 에러 처리 (토스트 메시지 등)
						}
					}

					// 성공 시 모달 닫기
					setIsWriteModalOpen(false)
				},
			}
		)
	}

	const handleItemClick = (item: { postId: number; tag?: string; title: string; author: string; date: string }) => {
		// 게시글 상세 조회
		setSelectedPostId(item.postId)
		setIsViewModalOpen(true)
	}

	const handleUpdatePost = (title: string, content: string, isNotice: boolean, files: File[]) => {
		if (!selectedPostId) return

		// API 호출로 게시글 수정
		updatePostMutation.mutate(
			{
				title,
				content,
				is_notice: isNotice,
				mention_user_ids: [], // TODO: 멘션 기능 추가 시 구현
			},
			{
				onSuccess: async () => {
					// 게시글 수정 성공 후 새로 추가된 파일이 있으면 업로드
					if (files.length > 0 && projectId) {
						try {
							// 모든 파일을 순차적으로 업로드
							for (const file of files) {
								await uploadPostFile(projectId, selectedPostId, file)
							}
							// 파일 업로드 후 게시글 상세 정보 갱신
							if (selectedPostId) {
								queryClient.invalidateQueries({
									queryKey: ['postDetail', projectId, selectedPostId],
								})
							}
						} catch (error) {
							console.error('파일 업로드 실패:', error)
							// TODO: 에러 처리 (토스트 메시지 등)
						}
					}
					// 모달은 열려있게 유지 (모달을 닫지 않음)
					// useUpdatePostMutation의 onSuccess에서 이미 invalidateQueries를 호출하므로
					// 여기서는 추가 refetch가 필요 없음
				},
				onError: (error) => {
					console.error('게시글 수정 실패:', error)
					// TODO: 에러 처리 (토스트 메시지 등)
				},
			}
		)
	}

	const handleDeletePost = () => {
		if (!selectedPostId || !projectId) return

		deletePostMutation.mutate(selectedPostId, {
			onSuccess: () => {
				// 삭제 성공 시 모달 닫기 및 선택 해제
				setIsViewModalOpen(false)
				setSelectedPostId(null)
			},
			onError: (error) => {
				console.error('게시글 삭제 실패:', error)
				// TODO: 에러 처리 (토스트 메시지 등)
			},
		})
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
				postId: post.post_id,
				tag,
				title: post.title,
				author: post.author?.nickname || post.author?.user_name || '',
				date: formatISODateForDisplay(post.created_at),
			}
		})
	}, [postList])

	// 페이지네이션 정보 (API에서 받은 정보 사용)
	const totalPages = postList?.page_info?.total_pages || 1
	const currentItems = boardItems

	return (
		<div className="flex flex-col w-full mx-auto px-[72px] py-[64px] gap-[30px]">
			<ContentHeader
				title="게시판"
				description="팀 전용 게시판입니다. 공지사항, 회의록, 업무 보고 등을 공유할 수 있습니다."
				buttonText="글쓰기"
				onButtonClick={handleWriteClick}
			/>

			{/* 게시판 리스트 컨테이너 */}
			<div className="w-[1224px] h-[596px] bg-neutral-000 rounded-xl border border-neutral-200 shadow-drop-neutral-2 flex flex-col overflow-hidden">
				{isLoading ? (
					<div className="flex items-center justify-center h-full text-neutral-500">게시글 로딩 중...</div>
				) : currentItems.length === 0 ? (
					<div className="flex items-center justify-center h-full text-neutral-500">게시글이 없습니다.</div>
				) : (
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
				)}
            </div>

			{/* 글쓰기 모달 */}
			<WritePostModal
				isOpen={isWriteModalOpen}
				onClose={() => setIsWriteModalOpen(false)}
				onSave={handleSavePost}
			/>

			{/* 게시글 조회 모달 */}
			{selectedPostId && postDetail && projectId && (
				<WritePostModal
					mode="view"
					isOpen={isViewModalOpen}
					projectId={projectId}
					postId={selectedPostId}
					onClose={() => {
						setIsViewModalOpen(false)
						setSelectedPostId(null)
					}}
					initialTitle={postDetail.title}
					initialContent={postDetail.content}
					initialIsNotice={postDetail.post_type === 'NOTICE'}
					initialAttachments={postDetail.attachments.map((attachment): PostAttachment => {
						if (attachment.document_type === 'LINK') {
							return {
								id: String(attachment.document_id),
							type: 'link',
								name: attachment.title,
								url: attachment.link_url || undefined,
							}
						} else {
							return {
								id: String(attachment.document_id),
							type: 'file',
								name: attachment.title,
								fileName: attachment.file_name || undefined,
								url: attachment.download_url || undefined,
							}
						}
					})}
					onUpdate={handleUpdatePost}
					onDelete={handleDeletePost}
					isOwner={isOwner}
				/>
			)}
		</div>
	)
}

export default BoardPage
