import MemberProfileHeader from './MemberProfileHeader';
import MemberProfileDetail from './MemberProfileDetail';
import type { Member } from '@/types/member';

interface MemberProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    member: Member;
}

const MemberProfileModal = ({ isOpen, onClose, member }: MemberProfileModalProps) => {
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
                    <div className='mb-10'>
                        <MemberProfileHeader member={member} />
                    </div>
                    <MemberProfileDetail member={member} />
                </div>
            </div>
        </div>
    );
};

export default MemberProfileModal;