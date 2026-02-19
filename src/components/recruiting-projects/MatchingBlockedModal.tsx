interface MatchingBlockedModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const MatchingBlockedModal = ({ isOpen, onClose }: MatchingBlockedModalProps) => {
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-neutral-50/70 flex items-center justify-center z-50'>
            <div className='w-[480px] min-h-[310px] bg-white rounded-3xl p-12 flex flex-col border-neutral-200'>
                {/* 제목 */}
                <h2 className='text-[28px] font-bold text-primary-600-normal text-center mb-[18px]'>
                    이미 매칭 대기 중인 프로젝트가 있습니다!
                </h2>

                {/* 설명 */}
                <p className='text-[16px] text-neutral-600 text-center mb-4'>
                    매칭 신청 후 대기 중인 24시간동안 다른 프로젝트에 신청할 수 없습니다.
                </p>

                {/* 안내 박스 */}
                <div className='bg-neutral-100 rounded-xl p-4 mb-auto'>
                    <p className='text-[14px] text-neutral-700 leading-relaxed text-center'>
                        지금 해당 프로젝트의 매칭을 취소할 수 신청 할 수 있습니다.<br />
                        대기 중인 프로젝트의 매칭을 종료할 후 신청할 수 있습니다.
                    </p>
                </div>

                {/* 하단 버튼들 */}
                <div className='flex gap-3 justify-center'>
                    <button
                        onClick={onClose}
                        className='w-[160px] h-[48px] border border-neutral-200 rounded-2xl text-[18px] font-semibold text-neutral-900 hover:bg-neutral-50 transition-colors'
                    >
                        돌아가기
                    </button>
                    <button
                        onClick={onClose}
                        className='w-[160px] h-[48px] rounded-2xl text-[18px] font-semibold bg-primary-400-normal text-white hover:bg-primary-500-normal transition-colors'
                    >
                        매칭 현황 가기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MatchingBlockedModal;
