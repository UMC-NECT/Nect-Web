import { useState } from 'react';
import RoleTag from '@/components/mypage/RoleTag';
import type { RecruitmentDto } from '@/types/api/project/recruitment';

interface MatchingRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onMatchingComplete?: (field: string) => void;
    getPositionStyle: (position: string) => string;
    recruitments: RecruitmentDto[];
}

const MatchingRequestModal = ({ isOpen, onClose, onMatchingComplete, recruitments }: MatchingRequestModalProps) => {
    const [selectedParts, setSelectedParts] = useState<string[]>([]);

    if (!isOpen) return null;

    const availableParts = recruitments.map(r => ({
        name: r.customField || r.roleField,
        field: r.roleField,
        width: 'w-auto px-[8px] py-[2px]'
    }));

    const togglePart = (part: string) => {
        if (selectedParts.includes(part)) {
            setSelectedParts(selectedParts.filter(p => p !== part));
        } else {
            setSelectedParts([...selectedParts, part]);
        }
    };

    const handleNext = () => {
        if (selectedParts.length > 0 && onMatchingComplete) {
            const selectedRecruitment = availableParts.find(p => p.name === selectedParts[0]);
            if (selectedRecruitment) {
                onMatchingComplete(selectedRecruitment.field);
            }
        }
    };

    const handleClose = () => {
        setSelectedParts([]);
        onClose();
    };

    return (
        <div className='fixed inset-0 bg-neutral-50/70 flex items-center justify-center z-50'>
            <div className='w-[600px] h-[376px] bg-white rounded-xl p-12 flex flex-col border-neutral-200'>
                {/* 제목 */}
                <h2 className='text-[20px] font-semibold text-center mb-[18px]'>
                    매칭할 파트를 선택해주세요
                </h2>
                
                {/* 설명 */}
                <p className='text-[16px] text-neutral-600 text-center mb-[38px]'>
                    선택한 파트로 프로젝트 매칭이 신청됩니다.
                </p>

                {/* 파트 선택 버튼들 */}
                <div className='flex justify-center gap-4 mb-auto flex-wrap '>
                    {availableParts.map((part) => {
                        const isSelected = selectedParts.includes(part.name);
                        
                        return (
                            <button
                                key={part.name}
                                onClick={() => togglePart(part.name)}
                                disabled={!isSelected && selectedParts.length >= 1}
                                className={`transition-all ${
                                    isSelected 
                                        ? 'opacity-100' 
                                        : 'opacity-50'
                                    }
                                    ${!isSelected && selectedParts.length >= 1
                                        ? 'cursor-not-allowed'
                                        : 'hover:opacity-80 cursor-pointer'
                                    }`}
                            >
                                <RoleTag 
                                    role={part.name}
                                    showTotal={false}
                                    className='text-[20px] text-neutral-700'
                                />
                            </button>
                        );
                    })}
                </div>

                {/* 하단 버튼들 */}
                <div className='flex gap-3 justify-center'>
                    <button 
                        onClick={handleClose}
                        className='w-[160px] h-[48px] border border-neutral-200 rounded-2xl text-[18px] font-semibold text-neutral-900 hover:bg-neutral-50 transition-colors'
                    >
                        닫기
                    </button>
                    <button 
                        onClick={handleNext}
                        disabled={selectedParts.length === 0}
                        className={`w-[160px] h-[48px] rounded-2xl text-[18px] font-semibold transition-colors
                            ${selectedParts.length > 0
                                ? 'bg-primary-500-normal text-white hover:bg-primary-600-normal'
                                : 'bg-primary-300-light text-neutral-50 cursor-not-allowed'
                            }`}
                    >
                        다음
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MatchingRequestModal;
