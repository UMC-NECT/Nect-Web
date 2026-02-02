interface MatchingSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const MatchingSuccessModal = ({ isOpen, onClose }: MatchingSuccessModalProps) => {
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-neutral-50/70 flex items-center justify-center z-50'>
            <div className='w-[600px] h-[376px] bg-white rounded-3xl p-12 flex flex-col items-center justify-center'>
                {/* 제목 */}
                <h2 className='h-[32px] text-[20px] font-bold text-primary-500-normal text-center mb-[18px]'>
                    신청이 완료 되었습니다
                </h2>
                
                {/* 설명 */}
                <p className='mt-[12px] text-[16px] text-neutral-600 text-center mb-auto'>
                    마이페이지 매칭 현황에서 확인 가능합니다.
                </p>

                {/* 하단 버튼들 */}
                <div className='flex gap-4 justify-center w-full'>
                    <button 
                        onClick={onClose}
                        className='w-[160px] h-[48px] border border-neutral-300 rounded-2xl text-[18px] font-semibold text-neutral-900 hover:bg-neutral-50 transition-colors'
                    >
                        매칭 현황 가기
                    </button>
                    <button 
                        onClick={onClose}
                        className='w-[160px] h-[48px] rounded-2xl text-[18px] font-semibold bg-primary-400-normal text-white hover:bg-primary-500-normal transition-colors'
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MatchingSuccessModal;