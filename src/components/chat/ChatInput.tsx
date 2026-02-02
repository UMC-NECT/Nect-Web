import { useState } from 'react'
import AttachmentIcon from '@/assets/icons/sidebar/attachment.svg?react'

interface ChatInputProps {
	onSend?: (message: string) => void
	onAttach?: () => void
	placeholder?: string
}

const ChatInput = ({ onSend, onAttach, placeholder = '메세지를 입력하세요' }: ChatInputProps) => {
	const [message, setMessage] = useState('')
	const isActive = message.trim().length > 0

	const handleSend = () => {
		if (isActive && onSend) {
			onSend(message)
			setMessage('')
		}
	}

	const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSend()
		}
	}

	return (
		<div className="w-full bg-white px-3 py-1.5 flex flex-col gap-2">
			<div className="flex flex-col gap-2">
				{/* 텍스트 입력 영역 */}
				<textarea
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					onKeyPress={handleKeyPress}
					placeholder={placeholder}
					className="w-full min-h-[54px] resize-none outline-none text-neutral-900 label font-medium tracking-[-0.26px] placeholder:text-neutral-400"
					rows={1}
					style={{
						lineHeight: '1.4',
					}}
				/>

				{/* 하단 버튼 영역 */}
				<div className="flex items-center justify-between">
					{/* 문서 첨부 버튼 */}
					<button
						onClick={onAttach}
						className="w-4 h-4 flex items-center justify-center group"
					>
						<AttachmentIcon className="w-4 h-4 text-neutral-300 group-hover:text-neutral-700 transition-colors" />
					</button>

					{/* 보내기 버튼 */}
					<button
						onClick={handleSend}
						className={`px-[13px] py-1.5 rounded-md flex items-center justify-center ${
							isActive
								? 'bg-primary-400-normal cursor-pointer'
								: 'bg-primary-200-light cursor-pointer'
						}`}
					>
						<span className="text-white body-2 font-regular leading-normal">
							보내기
						</span>
					</button>
				</div>
			</div>
		</div>
	)
}

export default ChatInput
