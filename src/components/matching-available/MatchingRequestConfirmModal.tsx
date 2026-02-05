interface MatchingRequestConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    memberName: string;
    position: string;
}

const MatchingRequestConfirmModal = ({ isOpen, onClose, onConfirm, memberName, position }: MatchingRequestConfirmModalProps) => {
    if (!isOpen) return null;

    return (
        <div 
            className='fixed inset-0 bg-neutral-50/70 flex items-center justify-center z-50'
            onClick={onClose}
        >
            <div 
                className='w-[600px] h-[376px] bg-white rounded-3xl px-[47px] py-[56px] flex flex-col border border-neutral-200'
                onClick={(e) => e.stopPropagation()}
            >
                {/* 제목 */}
                <div className='text-center mb-6'>
                    <h2 className='text-[20px] font-bold mb-3'>
                        <span className='text-primary-500-normal'>{memberName}</span>님에게 {position} 파트 <br />
                        매칭 요청을 진행할까요?
                    </h2>
                </div>
                
                {/* 설명 */}
                <p className='text-[16px] text-neutral-600 text-center mb-[105px]'>
                    24시간 동안의 매칭 요청은 파트 당 3명까지 가능합니다.
                </p>

                {/* 버튼 */}
                <div className='flex gap-4 justify-center'>
                    <button
                        onClick={onClose}
                        className='w-[160px] h-[48px] border-[1.5px] border-neutral-200 rounded-xl text-[18px] font-semibold text-neutral-900 hover:bg-neutral-50 transition-colors'
                    >
                        이전
                    </button>
                    <button
                        onClick={onConfirm}
                        className='w-[160px] h-[48px] rounded-xl text-[18px] font-semibold bg-primary-400-normal text-white hover:bg-primary-500-normal transition-colors'
                    >
                        매칭 요청
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MatchingRequestConfirmModal;
