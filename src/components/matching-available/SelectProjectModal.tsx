// SelectProjectModal.tsx
import { useState, useEffect } from 'react';
import { useLeaderRecruitments } from '@/hooks/queries/recruitment/useLeaderRecruitments';

interface SelectProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (projectId: string) => void;
    onNoProject: () => void;
}

const SelectProjectModal = ({ isOpen, onClose, onConfirm, onNoProject }: SelectProjectModalProps) => {
    const { data: projects, isLoading } = useLeaderRecruitments();
    const [selectedProject, setSelectedProject] = useState<string>('');
    const visibleProjects = projects?.slice(0, 2) ?? [];

    // 프로젝트가 없을 때 자동으로 NoMatchingProjectModal로 전환
    useEffect(() => {
        if (isOpen && !isLoading && visibleProjects.length === 0) {
            onNoProject();
        }
    }, [isOpen, isLoading, visibleProjects.length, onNoProject]);

    if (!isOpen) return null;

    const handleClose = () => {
        setSelectedProject('');
        onClose();
    };

    const handleConfirm = () => {
        if (selectedProject) {
            onConfirm(selectedProject);
            setSelectedProject('');
        }
    };

    return (
        <div
            className='fixed inset-0 bg-neutral-50/70 flex items-center justify-center z-50'
            onClick={handleClose}
        >
            <div
                className='w-[600px] h-[376px] bg-white rounded-3xl px-[47px] py-[56px] flex flex-col border border-neutral-200'
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className='text-[20px] font-semibold text-center mb-[34px]'>
                    팀원 매칭 할 프로젝트를 선택해주세요.
                </h2>

                {/* 프로젝트 선택 버튼 */}
                <div className='mb-auto pt-[26px] px-5 flex items-center justify-center'>
                    {isLoading ? (
                        <div className='text-center py-8 text-neutral-500'>로딩 중...</div>
                    ) : visibleProjects.length === 0 ? (
                        <div className='text-center py-8 text-neutral-500'>
                            리더로 있는 모집 중인 프로젝트가 없습니다.
                        </div>
                    ) : (
                        <div className='space-y-3 flex flex-col items-center'>
                            {visibleProjects.map(project => (
                                <button
                                    key={project.projectId}
                                    onClick={() => setSelectedProject(String(project.projectId))}
                                    className={`w-[274px] h-auto min-h-[60px] px-4 py-3 rounded-xl border-[1.5px] transition-all
                                        ${selectedProject === String(project.projectId)
                                            ? 'border-primary-500-normal bg-primary-100-light'
                                            : 'border-neutral-100 bg-white hover:bg-neutral-50'
                                        }`}
                                >
                                    <div className='text-center'>
                                        <p className={`text-[18px] font-medium truncate
                                            ${selectedProject === String(project.projectId)
                                                ? 'text-primary-500-normal'
                                                : 'text-neutral-800'
                                            }`}
                                        >
                                            {project.title}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* 버튼 */}
                <div className='flex gap-4 justify-center'>
                    <button
                        onClick={handleClose}
                        className='w-[160px] h-[48px] border border-neutral-200 rounded-xl text-[18px] font-semibold text-neutral-900 hover:bg-neutral-50 transition-colors'
                    >
                        닫기
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedProject || visibleProjects.length === 0}
                        className='w-[160px] h-[48px] rounded-xl text-[18px] font-semibold bg-primary-400-normal text-white disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed'
                    >
                        다음
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SelectProjectModal;
