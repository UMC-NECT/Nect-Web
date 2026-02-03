interface MatchingCancelModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const MatchingCancelModal = ({ isOpen, onClose, onConfirm }: MatchingCancelModalProps) => {
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-neutral-50/70 flex items-center justify-center z-50'>
            <div className='w-[600px] h-[376px] bg-white rounded-3xl p-12 flex flex-col border-neutral-200'>
                {/* 제목 */}
                <h2 className='text-[28px] font-bold text-center mb-[18px]'>
                    매칭 신청을 취소 하시겠습니까?
                </h2>
                
                {/* 설명 */}
                <p className='text-[16px] text-neutral-600 text-center mb-auto'>
                    취소 후 24시간 동안 해당 프로젝트에<br />
                    매칭 신청이 제한됩니다.
                </p>

                {/* 하단 버튼들 */}
                <div className='flex gap-3 justify-center'>
                    <button 
                        onClick={onClose}
                        className='w-[160px] h-[48px] border border-neutral-200 rounded-2xl text-[18px] font-semibold text-neutral-900 hover:bg-neutral-50 transition-colors'
                    >
                        돌아가기
                    </button>
                    <button 
                        onClick={onConfirm}
                        className='w-[160px] h-[48px] rounded-2xl text-[18px] font-semibold bg-primary-400-normal text-white hover:bg-primary-500-normal transition-colors'
                    >
                        매칭 취소
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MatchingCancelModal;
