import { MyMessage } from './MyMessage'
import { OtherMessage } from './OtherMessage'
import { FileMessage } from './FileMessage'

interface ChatRoomMessageProps {
	senderName?: string
	content?: string
	time: string
	isMine: boolean
	readCount?: number
	role?: string
	profileImage?: string
	fileId?: number
	fileAttachment?: {
		fileName: string
		fileSize: string
		fileType: 'PDF' | 'Figma' | 'Word' | 'Excel' | 'PPT' | 'Zip' | 'JPG' | 'PNG' | 'JPEG' | 'MOV' | 'MP4' | 'Etc'
	}
	onRegisterToSharedDocs?: () => void
	onDeleteFile?: () => void
}

export const ChatRoomMessage = ({
	senderName,
	content,
	time,
	isMine,
	readCount,
	role,
	profileImage,
	fileId,
	fileAttachment,
	onRegisterToSharedDocs,
	onDeleteFile,
}: ChatRoomMessageProps) => {
	// 현재 컴포넌트에서는 fileId를 직접 사용하지 않지만, 상위 컴포넌트에서 전달받아야 하므로 유지합니다.
	void fileId
	// 파일 첨부 메시지
	if (fileAttachment) {
		return (
			<FileMessage
				senderName={senderName}
				role={role}
				profileImage={profileImage}
				time={time}
				readCount={readCount}
				isMine={isMine}
				fileName={fileAttachment.fileName}
				fileSize={fileAttachment.fileSize}
				fileType={fileAttachment.fileType}
				onRegisterToSharedDocs={onRegisterToSharedDocs}
				onDelete={onDeleteFile}
			/>
		)
	}

	// 내 메시지
	if (isMine && content) {
		return <MyMessage content={content} time={time} readCount={readCount} />
	}

	// 상대방 메시지
	if (!isMine && senderName && content) {
	return (
			<OtherMessage
				senderName={senderName}
				content={content}
				time={time}
				role={role}
				profileImage={profileImage}
				readCount={readCount}
			/>
		)
	}

	return null
}
