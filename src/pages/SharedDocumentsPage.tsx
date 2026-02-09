import { useState, useMemo } from 'react'
import ContentHeader from '@/components/team-board/ContentHeader'
import SharedDocumentItem from '@/components/team-board/SharedDocumentItem'
import FileItem from '@/components/mission-modal/FileItem'
import SortDropdown, { type SortOption } from '@/components/team-board/SortDropdown'
import { useSharedDocumentList } from '@/hooks/team-board/useSharedDocumentList'
import { useDeleteSharedDocumentMutation } from '@/hooks/team-board/useDeleteSharedDocument'
import { useUpdateSharedDocumentNameMutation } from '@/hooks/team-board/useUpdateSharedDocumentName'
import type { FileItem as FileItemData } from '@/stores/mission-modal/missionModalStore'
import type { SortOption as APISortOption } from '@/types/api/team-board/sharedDocuments'
import LinkIcon from '@/assets/icons/team-board/link.svg?react'
import PlusIcon from '@/assets/icons/common/plus.svg?react'

const SharedDocumentsPage = () => {
	// TODO: URL에서 projectId 가져오기
	const projectId = 1

	const [currentPage] = useState(1)
	const [isUploading, setIsUploading] = useState(false)
	const [selectedFileId, setSelectedFileId] = useState<number | null>(null)
	const [editingFileId, setEditingFileId] = useState<number | null>(null)
	const [sortOrder, setSortOrder] = useState<SortOption>('latest')
	const [documentType] = useState<'FILE' | 'LINK' | undefined>(undefined)

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
	const { data: documentListResponse, isLoading } = useSharedDocumentList(projectId, {
		page: currentPage - 1, // API는 0부터 시작
		size: 20,
		type: documentType,
		sort: apiSortOption,
	})
	const documentList = documentListResponse?.body

	// 공유 문서 삭제 mutation
	const deleteDocumentMutation = useDeleteSharedDocumentMutation(projectId)
	
	// 공유 문서 이름 변경 mutation
	const updateDocumentNameMutation = useUpdateSharedDocumentNameMutation(projectId)

	const handleUploadClick = () => {
		// TODO: 파일 업로드 모달 또는 파일 선택 다이얼로그 열기
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

	const handleFileAdd = () => {
		// TODO: API 호출로 파일 추가
		setIsUploading(false)
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

	const handleFileDownload = (file: FileItemData) => {
		if (file.url && file.fileName) {
			const link = document.createElement('a')
			link.href = file.url
			link.download = file.fileName
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
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

	return (
		<div className="flex flex-col w-full mx-auto px-6 py-[64px] gap-[30px]">
			<ContentHeader
				title="공유 문서함"
				description="~~~하는 프로젝트 공유 문서 클라우드"
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
				<div className="px-5 py-[18px] flex-1 overflow-y-auto">
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
