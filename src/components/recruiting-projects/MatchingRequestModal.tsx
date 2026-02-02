// MatchingRequestModal.tsx
import { useState } from 'react';

interface MatchingRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onMatchingComplete?: () => void;
    getPositionStyle: (position: string) => string;
}

const MatchingRequestModal = ({ isOpen, onClose, onMatchingComplete, getPositionStyle }: MatchingRequestModalProps) => {
    const [selectedParts, setSelectedParts] = useState<string[]>([]);

    if (!isOpen) return null;

    const availableParts = [
        { name: 'Design', width: 'w-[80px] px-[8px] py-[2px]' },
        { name: 'Backend', width: 'w-[95px] px-[8px] py-[2px]' }
    ];

    const togglePart = (part: string) => {
        if (selectedParts.includes(part)) {
            setSelectedParts(selectedParts.filter(p => p !== part));
        } else {
            setSelectedParts([...selectedParts, part]);
        }
    };

    const handleNext = () => {
        if (selectedParts.length > 0 && onMatchingComplete) {
            onMatchingComplete(); // 다음 단계로
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
                <div className='flex justify-center gap-15 mb-auto'>
                    {availableParts.map((part) => {
                        const isSelected = selectedParts.includes(part.name);
                        const positionKey = part.name.toLowerCase();
                        
                        return (
                            <button
                                key={part.name}
                                onClick={() => togglePart(part.name)}
                                disabled={!isSelected && selectedParts.length >= 1}
                                className={`${part.width} h-[32px] rounded-md text-[20px] font-medium transition-all
                                    ${getPositionStyle(positionKey)} text-neutral-700
                                    ${isSelected 
                                        ? 'opacity-100' 
                                        : 'opacity-50'
                                    }
                                    ${!isSelected && selectedParts.length >= 1
                                        ? 'cursor-not-allowed'
                                        : 'hover:opacity-80 cursor-pointer'
                                    }`}
                            >
                                {part.name}
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