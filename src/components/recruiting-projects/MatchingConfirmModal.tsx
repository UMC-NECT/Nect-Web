interface MatchingConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    selectedPart: string;
    getPositionStyle: (position: string) => string;
}

const MatchingConfirmModal = ({ isOpen, onClose, onConfirm, selectedPart }: MatchingConfirmModalProps) => {
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-neutral-50/70 flex items-center justify-center z-50'>
            <div className='w-[600px] h-[376px] bg-white rounded-3xl p-12 flex flex-col border-neutral-200'>
                {/* 제목 */}
                <h2 className='text-[20px] font-semibold text-center mb-[18px]'>
                    <span className='text-primary-600-normal'>
                        {selectedPart}
                    </span>
                    {' '}매칭을 요청 할까요?
                </h2>
                
                {/* 설명 */}
                <p className='text-[16px] text-neutral-600 text-center mb-4'>
                    유의사항을 확인해주세요.
                </p>

                {/* 안내 박스 */}
                <div className='bg-neutral-100 rounded-md w-[506px] p-5 mb-auto'>
                    <p className='text-[14px] text-neutral-600 leading-relaxed'>
                        프로젝트 매칭 신청은 <span className='text-neutral-900'>24시간 동안 1인 1회</span>로 제한됩니다.<br />
                        매칭 결과는 24시간 내에 나오며, 매칭 대기 중엔 다른 프로젝트에 신청할 수 없습니다.
                    </p>
                </div>

                {/* 하단 버튼들 */}
                <div className='flex gap-3 justify-center'>
                    <button 
                        onClick={onClose}
                        className='w-[160px] h-[48px] border border-neutral-200 rounded-xl text-[18px] text-neutral-900 hover:bg-neutral-50 transition-colors'
                    >
                        이전
                    </button>
                    <button 
                        onClick={onConfirm}
                        className='w-[160px] h-[48px] rounded-2xl text-[18px] font-semibold bg-primary-400-normal text-white hover:bg-primary-500-normal transition-colors'
                    >
                        매칭 신청
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MatchingConfirmModal;