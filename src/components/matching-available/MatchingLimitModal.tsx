interface MatchingLimitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const MatchingLimitModal = ({ isOpen, onClose, onConfirm }: MatchingLimitModalProps) => {
    if (!isOpen) return null;

    return (
        <div 
            className='fixed inset-0 bg-neutral-50/70 flex items-center justify-center z-50'
            onClick={onClose}
        >
            <div 
                className='w-[600px] h-[376px] bg-white rounded-3xl p-12 flex flex-col border border-neutral-200'
                onClick={(e) => e.stopPropagation()}
            >
                {/* 제목 */}
                <h2 className='text-[20px] font-bold text-primary-500-normal text-center mb-[18px]'>
                    해당 파트의 매칭 요청 인원을 초과하였습니다!
                </h2>
                
                {/* 설명 */}
                <p className='text-[16px] text-neutral-600 text-center mb-6'>
                    24시간 동안 같은 파트로는 최대 3명까지만 신청 가능합니다.
                </p>

                {/* 안내 박스 */}
                <div className='bg-neutral-100 p-6 mb-8'>
                    <p className='text-[14px] text-neutral-600 leading-relaxed text-center'>
                        해당 넥터와의 매칭을 원한다면,<br />
                        진행 중인 기존 매칭을 종료 후 신청할 수 있습니다.
                    </p>
                </div>

                {/* 버튼 */}
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
                        매칭 현황 가기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MatchingLimitModal;
