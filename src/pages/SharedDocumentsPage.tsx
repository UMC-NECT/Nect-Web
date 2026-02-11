import { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import ContentHeader from '@/components/team-board/ContentHeader'
import SharedDocumentItem from '@/components/team-board/SharedDocumentItem'
import FileItem from '@/components/mission-modal/FileItem'
import SortDropdown, { type SortOption } from '@/components/team-board/SortDropdown'
import { useSharedDocumentList } from '@/hooks/team-board/useSharedDocumentList'
import { useDeleteSharedDocumentMutation } from '@/hooks/team-board/useDeleteSharedDocument'
import { useUpdateSharedDocumentNameMutation } from '@/hooks/team-board/useUpdateSharedDocumentName'
import { useUploadSharedDocumentFileMutation } from '@/hooks/team-board/useUploadSharedDocumentFile'
import { useCreateSharedDocumentLinkMutation } from '@/hooks/team-board/useCreateSharedDocumentLink'
import { downloadSharedDocumentFile } from '@/api/team-board/boards'
import { getProjectUsers } from '@/api/project-users/projectUsers'
import type { FileItem as FileItemData } from '@/stores/mission-modal/missionModalStore'
import type { SortOption as APISortOption } from '@/types/api/team-board/sharedDocuments'
import LinkIcon from '@/assets/icons/team-board/link.svg?react'
import PlusIcon from '@/assets/icons/common/plus.svg?react'

const SharedDocumentsPage = () => {
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
						navigate(`/shared-documents/${response.body[0].projectId}`, { replace: true })
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

	const [currentPage] = useState(1)
	const [isUploading, setIsUploading] = useState(false)
	const [selectedFileId, setSelectedFileId] = useState<number | null>(null)
	const [editingFileId, setEditingFileId] = useState<number | null>(null)
	const [sortOrder, setSortOrder] = useState<SortOption>('latest')
	const [documentType] = useState<'FILE' | 'LINK' | undefined>(undefined)
	const [isDragOver, setIsDragOver] = useState(false)

	// SortOption을 API SortOption으로 변환
	const apiSortOption: APISortOption = useMemo(() => {
		switch (sortOrder) {
			case 'latest':
				return 'RECENT'
			case 'oldest':
				return 'OLDEST'
			case 'name':
				return 'NAME'
			case 'fileType':
				return 'FORMAT'
			default:
				return 'RECENT'
		}
	}, [sortOrder])

	// 공유 문서함 목록 API 호출 (페이지는 0부터 시작하므로 currentPage - 1)
	const { data: documentListResponse, isLoading } = useSharedDocumentList(projectId || 0, {
		page: currentPage - 1, // API는 0부터 시작
		size: 20,
		type: documentType,
		sort: apiSortOption,
	})
	const documentList = documentListResponse?.body

	// 공유 문서 삭제 mutation
	const deleteDocumentMutation = useDeleteSharedDocumentMutation(projectId || 0)

	// 공유 문서 이름 변경 mutation
	const updateDocumentNameMutation = useUpdateSharedDocumentNameMutation(projectId || 0)

	// 공유 문서 파일 업로드 mutation
	const uploadFileMutation = useUploadSharedDocumentFileMutation(projectId || 0)

	// 공유 문서 링크 생성 mutation
	const createLinkMutation = useCreateSharedDocumentLinkMutation(projectId || 0)

	const handleUploadClick = () => {
		// FileItem 편집 모드 활성화
		setIsUploading(true)
	}

	/**
	 * API 응답 데이터를 FileItemData 형식으로 변환
	 */
	const files = useMemo(() => {
		if (!documentList?.documents || documentList.documents.length === 0) {
			return []
		}

		// 고정된 문서를 먼저, 그 다음 일반 문서 순으로 정렬
		const sortedDocuments = [...documentList.documents].sort((a, b) => {
			if (a.is_pinned && !b.is_pinned) return -1
			if (!a.is_pinned && b.is_pinned) return 1
			return 0
		})

		return sortedDocuments.map((doc) => {
			if (doc.document_type === 'LINK') {
				return {
					id: doc.document_id,
					type: 'link' as const,
					name: doc.title,
					url: doc.link_url || undefined,
				}
			} else {
				return {
					id: doc.document_id,
					type: 'file' as const,
					name: doc.title,
					fileName: doc.file_name || undefined,
					url: doc.file_url || undefined,
				}
			}
		})
	}, [documentList])

	const handleFileAdd = async (data: Omit<FileItemData, 'id'>, file?: File) => {
		if (!projectId) return

		try {
			if (data.type === 'file' && file) {
				// 파일 업로드
				await uploadFileMutation.mutateAsync(file)
			} else if (data.type === 'link' && data.url) {
				// 링크 생성 API 호출
				await createLinkMutation.mutateAsync({
					title: data.name,
					link_url: data.url,
				})
			}
			setIsUploading(false)
		} catch (error) {
			console.error('문서 추가 실패:', error)
			// TODO: 에러 처리 (토스트 메시지 등)
		}
	}

	const handleFileDelete = (id: number) => {
		deleteDocumentMutation.mutate(id, {
			onSuccess: () => {
				// 삭제 성공 시 선택 해제
				if (selectedFileId === id) {
					setSelectedFileId(null)
				}
			},
			onError: (error) => {
				console.error('문서 삭제 실패:', error)
				// TODO: 에러 처리 (토스트 메시지 등)
			},
		})
	}

	const handleFileDownload = async (file: FileItemData) => {
		if (!projectId || !file.id) return

		try {
			await downloadSharedDocumentFile(projectId, file.id, file.fileName)
		} catch (error) {
			console.error('파일 다운로드 실패:', error)
			// TODO: 에러 처리 (토스트 메시지 등)
		}
	}

	const handleFileClick = (file: FileItemData) => {
		setSelectedFileId(file.id)
		if (file.url) {
			const url = file.url.startsWith('http://') || file.url.startsWith('https://') ? file.url : `https://${file.url}`
			window.open(url, '_blank')
		}
	}

	const handleRename = (id: number) => {
		setEditingFileId(id)
	}

	const handleSaveName = (id: number, newName: string) => {
		updateDocumentNameMutation.mutate(
			{
				documentId: id,
				nameData: {
					title: newName,
					name: null,
				},
			},
			{
				onSuccess: () => {
					setEditingFileId(null)
				},
				onError: (error) => {
					console.error('문서 이름 변경 실패:', error)
					// TODO: 에러 처리 (토스트 메시지 등)
				},
			},
		)
	}

	const handleCancelRename = () => {
		setEditingFileId(null)
	}

	// 드래그 앤 드롭 핸들러
	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragOver(true)
	}

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragOver(false)
	}

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragOver(false)

		const files = e.dataTransfer.files
		if (files.length > 0) {
			const file = files[0]
			// FileItem 편집 모드 활성화하고 파일 업로드
			setIsUploading(true)
			// FileItem이 드롭된 파일을 처리할 수 있도록 약간의 지연 후 업로드
			// FileItem 컴포넌트는 내부적으로 드래그 앤 드롭을 처리하므로,
			// 여기서는 편집 모드만 활성화하고 FileItem이 파일을 받도록 함
			// 실제로는 FileItem에 직접 파일을 전달할 수 없으므로,
			// 드롭된 파일을 즉시 업로드하는 방식으로 처리
			handleFileAdd(
				{
					type: 'file',
					name: file.name.replace(/\.[^/.]+$/, ''), // 확장자 제거
					fileName: file.name,
				},
				file
			)
		}
	}

	return (
		<div className="flex flex-col w-full mx-auto px-[72px] pt-[64px] gap-[30px]">
			<ContentHeader
				title="공유 문서함"
				description="프로젝트 자료를 한곳에 모으는 공유 문서 클라우드"
				buttonText="업로드"
				onButtonClick={handleUploadClick}
			/>

			{/* 공유 문서함 컨테이너 */}
			<div className="w-[1226px] h-[568px] bg-neutral-000 rounded-xl border border-neutral-200 shadow-drop-neutral-2 flex flex-col overflow-hidden">
				{/* 헤더: 정렬 드롭다운 */}
				<div className="bg-status-info-cool-gray-light px-5 py-2.5 rounded-t-xl">
					<SortDropdown currentSort={sortOrder} onSortChange={setSortOrder} />
				</div>

				{/* 파일 목록 영역 */}
				<div
					className={`px-5 py-[18px] flex-1 overflow-y-auto ${isDragOver ? 'bg-primary-50' : ''}`}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
				>
					{isLoading ? (
						<div className="flex items-center justify-center h-full">로딩 중...</div>
					) : files.length === 0 && !isUploading ? (
						// 빈 상태: 업로드 플레이스홀더
						<div className="bg-neutral-50 border border-neutral-100 rounded-md flex gap-2.5 h-[46px] items-center pl-2 pr-2.5 py-1.5 w-[284px]">
							<div className="relative shrink-0 w-7 h-7">
								<div className="absolute bg-neutral-50 inset-0 rounded-[6.222px] shadow-inner-neutral-2" />
								<div className="absolute inset-[17.86%] flex items-center justify-center">
									<LinkIcon className="w-[18px] h-[18px] text-neutral-300" />
								</div>
							</div>
							<div className="flex flex-1 flex-col items-start leading-0 min-w-0">
								<div className="caption-1 font-semibold text-neutral-300 w-full whitespace-nowrap">
									<span className="leading-[1.4] overflow-hidden">제목</span>
								</div>
								<div className="text-[9px] leading-[1.4] text-neutral-400 w-full">
									<span className="whitespace-pre-wrap">링크 붙여넣기 및 파일 드래그</span>
								</div>
							</div>
							<div className="flex items-center justify-center shrink-0 w-4 h-4">
								<PlusIcon className="w-4 h-4 text-neutral-400 rotate-45" />
							</div>
						</div>
					) : (
						<div className="flex flex-wrap gap-4 items-start">
							{/* 파일 목록 */}
							{files.map((file) => (
								<SharedDocumentItem
									key={file.id}
									data={file}
									isSelected={selectedFileId === file.id}
									isEditing={editingFileId === file.id}
									onClick={() => handleFileClick(file)}
									onDelete={() => handleFileDelete(file.id)}
									onDownload={file.type === 'file' ? () => handleFileDownload(file) : undefined}
									onRename={() => handleRename(file.id)}
									onSave={(name) => handleSaveName(file.id, name)}
									onCancel={handleCancelRename}
								/>
							))}

							{/* 파일 추가 입력 */}
							{isUploading && (
								<div className="w-[284px]">
									<FileItem
										isEditing
										onSave={handleFileAdd}
										onCancel={() => setIsUploading(false)}
									/>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default SharedDocumentsPage
