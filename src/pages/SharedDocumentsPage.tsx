import { useState } from 'react'
import ContentHeader from '@/components/team-board/ContentHeader'
import SharedDocumentItem from '@/components/team-board/SharedDocumentItem'
import FileItem from '@/components/mission-modal/FileItem'
import SortDropdown, { type SortOption } from '@/components/team-board/SortDropdown'
import type { FileItem as FileItemData } from '@/stores/mission-modal/missionModalStore'
import LinkIcon from '@/assets/icons/team-board/link.svg?react'
import PlusIcon from '@/assets/icons/common/plus.svg?react'

const SharedDocumentsPage = () => {
	// 샘플 데이터 (테스트용)
	const sampleFiles: FileItemData[] = [
		{
			id: 1,
			type: 'file',
			name: 'PM_프로젝트 기획서',
			fileName: 'PM_프로젝트 기획서.pdf',
			url: '#',
		},
		{
			id: 2,
			type: 'file',
			name: '파일 정보',
			fileName: '파일명 한 줄까지 미리보기.docx',
			url: '#',
		},
		{
			id: 3,
			type: 'file',
			name: '파일 정보',
			fileName: '파일명 한 줄까지 미리보기.png',
			url: '#',
		},
		{
			id: 4,
			type: 'file',
			name: '파일 정보',
			fileName: '파일명 한 줄까지 미리보기.ppt',
			url: '#',
		},
		{
			id: 5,
			type: 'file',
			name: '파일 정보',
			fileName: '파일명 한 줄까지 미리보기.mp4',
			url: '#',
		},
		{
			id: 6,
			type: 'file',
			name: '파일 정보',
			fileName: '파일명 한 줄까지 미리보기.xlsx',
			url: '#',
		},
		{
			id: 7,
			type: 'link',
			name: '링크 일 경우',
			url: 'www.figma.com',
		},
		{
			id: 8,
			type: 'file',
			name: '파일 정보',
			fileName: '파일명 한 줄까지 미리보기.zip',
			url: '#',
		},
	]

	const [files, setFiles] = useState<FileItemData[]>(sampleFiles)
	const [isUploading, setIsUploading] = useState(false)
	const [selectedFileId, setSelectedFileId] = useState<number | null>(null)
	const [sortOrder, setSortOrder] = useState<SortOption>('latest')

	const handleUploadClick = () => {
		// TODO: 파일 업로드 모달 또는 파일 선택 다이얼로그 열기
		setIsUploading(true)
	}

	const handleFileAdd = (fileData: Omit<FileItemData, 'id'>) => {
		const newFile: FileItemData = {
			id: Date.now(),
			...fileData,
		}
		setFiles([...files, newFile])
		setIsUploading(false)
	}

	const handleFileDelete = (id: number) => {
		setFiles(files.filter((file) => file.id !== id))
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
		// TODO: 이름 바꾸기 기능 구현
		console.log('이름 바꾸기:', id)
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
					{files.length === 0 && !isUploading ? (
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
									onClick={() => handleFileClick(file)}
									onDelete={() => handleFileDelete(file.id)}
									onDownload={file.type === 'file' ? () => handleFileDownload(file) : undefined}
									onRename={() => handleRename(file.id)}
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
