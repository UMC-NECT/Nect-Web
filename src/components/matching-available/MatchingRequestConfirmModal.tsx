interface MatchingRequestConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    memberName: string;
    position: string;
}

const MatchingRequestConfirmModal = ({ isOpen, onClose, onConfirm, position }: MatchingRequestConfirmModalProps) => {
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
                <div className='text-center'>
                    <h2 className='text-[20px] font-bold mb-[18px]'>
                        <span className='text-primary-500-normal'>{position}</span> 매칭을 요청 할까요?
                    </h2>
                </div>
                
                {/* 설명 */}
                <p className='text-[16px] text-neutral-600 text-center mb-3'>
                    유의사항을 확인해주세요.
                </p>

                {/* 유의사항 */}
                <p className="bg-neutral-100 text-neutral-600 text-[14px] rounded-[6px] w-[506px] h-[82px] gap-[10px] p-5">
                    프로젝트 매칭 신청은 <span className="text-neutral-900">24시간 동안 1일 1회</span>로 제한됩니다. <br />
                    매칭 결과는 24시간 내에 나오며, 매칭 대기 중엔 다른 프로젝트에 신청할 수 없습니다.
                </p>

                {/* 버튼 */}
                <div className='flex gap-4 justify-center mt-12'>
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
