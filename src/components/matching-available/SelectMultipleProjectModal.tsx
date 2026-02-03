import { useState } from 'react';

interface SelectMultipleProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (projectId: string) => void;
}

const SelectMultipleProjectModal = ({ isOpen, onClose, onConfirm }: SelectMultipleProjectModalProps) => {
    const [selectedProject, setSelectedProject] = useState<string>('');

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

                <div className='mb-10'>
                    {/* 프로젝트 1 */}
                    <button
                        onClick={() => setSelectedProject('nect')}
                        className={`w-[274px] h-[48px] px-2 py-1 rounded-xl border-[1.5px] transition-all flex justify-center items-center mx-auto mb-4
                            ${selectedProject === 'nect' 
                                ? 'border-primary-400-normal bg-primary-100-light' 
                                : 'border-neutral-100 hover:border-primary-200-light'
                            }`}
                    >
                        <span className={`text-[18px] font-semibold ${selectedProject === 'nect' ? 'text-primary-500-normal' : 'text-neutral-800'}`}>
                            넥트 (NECT)
                        </span>
                    </button>

                    {/* 프로젝트 2 */}
                    <button
                        onClick={() => setSelectedProject('triple')}
                        className={`w-[274px] h-[48px] px-2 py-1 rounded-xl border-[1.5px] transition-all flex justify-center items-center mx-auto
                            ${selectedProject === 'triple' 
                                ? 'border-primary-400-normal bg-primary-100-light' 
                                : 'border-neutral-100 hover:border-primary-200-light'
                            }`}
                    >
                        <span className={`text-[18px] font-semibold ${selectedProject === 'triple' ? 'text-primary-500-normal' : 'text-neutral-800'}`}>
                            트리플 (Triple)
                        </span>
                    </button>
                </div>

                {/* 버튼 */}
                <div className='flex gap-4 justify-center'>
                    <button
                        onClick={onClose}
                        className='w-[180px] h-[56px] border border-neutral-300 rounded-2xl text-[18px] font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors'
                    >
                        닫기
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedProject}
                        className={`w-[180px] h-[56px] rounded-2xl text-[18px] font-semibold transition-colors
                            ${selectedProject
                                ? 'bg-primary-400-normal text-white hover:bg-primary-500-normal'
                                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                            }`}
                    >
                        다음
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SelectMultipleProjectModal;
