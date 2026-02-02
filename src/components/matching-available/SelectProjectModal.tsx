// SelectProjectModal.tsx
import { useState } from 'react';

interface SelectProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (projectId: string) => void;
}

const SelectProjectModal = ({ isOpen, onClose, onConfirm }: SelectProjectModalProps) => {
    const [selectedProject, setSelectedProject] = useState<string>('nect');

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (selectedProject) {
            onConfirm(selectedProject);
        }
    };

    return (
        <div 
            className='fixed inset-0 bg-neutral-50/70 flex items-center justify-center z-50'
            onClick={onClose}
        >
            <div 
                className='w-[600px] h-[376px] bg-white rounded-3xl px-[47px] py-[56px] flex flex-col border border-neutral-200'
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className='text-[20px] font-semibold text-center mb-12'>
                    팀원 매칭 할 프로젝트를 선택해주세요.
                </h2>

                {/* 프로젝트 선택 버튼 */}
                <div className='mb-16'>
                    <button
                        onClick={() => setSelectedProject('nect')}
                        className='w-[274px] h-[48px] px-2 py-1 rounded-xl border-[1.5px] border-primary-400-normal bg-primary-100-light justify-center items-center flex mx-auto mb-4 cursor-not-allowed'
                    >
                        <span className='text-[18px] text-primary-400-normal cursor-not-allowed'>넥트 (NECT)</span>
                    </button>
                </div>

                {/* 버튼 */}
                <div className='flex gap-4 justify-center'>
                    <button
                        onClick={onClose}
                        className='w-[160px] h-[48px] border border-neutral-200 rounded-xl text-[18px] font-semibold text-neutral-900 hover:bg-neutral-50 transition-colors'
                    >
                        닫기
                    </button>
                    <button
                        onClick={handleConfirm}
                        className='w-[160px] h-[48px] rounded-xl text-[18px] font-semibold bg-primary-400-normal text-white'
                    >
                        다음
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SelectProjectModal;