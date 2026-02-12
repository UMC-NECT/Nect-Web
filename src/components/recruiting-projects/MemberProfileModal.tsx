import MemberProfileHeader from './MemberProfileHeader'
import MemberProfileDetail from './MemberProfileDetail'
import type { MemberDetailDto } from '@/types/api/member/detail'

interface MemberProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    member: MemberDetailDto | undefined;
    isLoading?: boolean;
}

const MemberProfileModal = ({ isOpen, onClose, member, isLoading }: MemberProfileModalProps) => {
    if (!isOpen) return null;

    return (
        <div 
            className='fixed inset-0 bg-neutral-900/70 flex items-center justify-center z-50' 
            onClick={onClose}
        >
            <div 
                className='w-[916px] max-h-[90vh] bg-white rounded-xl overflow-y-auto' 
                onClick={(e) => e.stopPropagation()}
            >
                <div className='my-[56px] mx-[46px]'>
                    {isLoading ? (
                        <p className='body-1 text-neutral-500'>프로필을 불러오는 중...</p>
                    ) : member ? (
                        <>
                            <div className='mb-10'>
                                <MemberProfileHeader member={member} />
                            </div>
                            <MemberProfileDetail memberData={member} />
                        </>
                    ) : (
                        <p className='body-1 text-neutral-500'>프로필을 불러올 수 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MemberProfileModal;