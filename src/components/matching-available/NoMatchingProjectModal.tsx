interface NoMatchingProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const NoMatchingProjectModal = ({ isOpen, onClose }: NoMatchingProjectModalProps) => {
    if (!isOpen) return null;

    return (
        <div 
            className='fixed inset-0 bg-neutral-50/70 flex items-center justify-center z-50'
            onClick={onClose}
        >
            <div 
                className='w-[600px] h-[376px] bg-white rounded-3xl px-[47px] py-[56px] flex flex-col items-center justify-center border border-neutral-200'
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className='text-[20px] font-semibold text-center mb-6'>
                    매칭 요청 할 프로젝트가 없습니다
                </h2>
                <p className='text-[16px] text-neutral-600 text-center mb-10'>
                    팀원 매칭 신청은 프로젝트가 <br/>모집 중인 경우에만 가능합니다
                </p>
                <button
                    onClick={onClose}
                    className='w-[160px] h-[48px] rounded-xl text-[18px] font-semibold bg-primary-400-normal text-white hover:bg-primary-500-normal transition-colors'
                >
                    확인
                </button>
            </div>
        </div>
    );
};

export default NoMatchingProjectModal;
