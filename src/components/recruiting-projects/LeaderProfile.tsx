import { useState } from 'react';
import type { ProjectDetailDto } from '@/types/api/project'
import MemberProfileModal from './MemberProfileModal';
import { useMemberDetail } from '@/hooks/queries/member/useMemberDetail';

interface LeaderProfileProps {
	projectData: ProjectDetailDto
}

const LeaderProfile = ({ projectData }: LeaderProfileProps) => {
    const leader = projectData.defaultInfo?.leader;
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // 리더의 상세 정보 가져오기
    const { data: leaderDetail } = useMemberDetail(leader?.user_id || 0);

    if (!leader) {
        return (
            <div className='mt-[64px] ml-[10px]'>
                <h3 className='font-bold text-[20px] mb-4'>
                    리더 프로필
                    <span className='text-red-500 text-[16px] ml-1'>*</span>
                </h3>
                <p className='text-[16px] text-neutral-500'>리더 정보가 없습니다.</p>
            </div>
        );
    }

    const handleLeaderClick = () => {
        if (leader?.user_id) {
            setIsModalOpen(true);
        }
    };

    return (
        <>
            <div className='mt-[64px] ml-[10px]'>
                <h3 className='font-bold text-[20px] mb-4'>
                    리더 프로필
                    <span className='text-red-500 text-[16px] ml-1'>*</span>
                </h3>
                
                <div 
                    onClick={handleLeaderClick}
                    className='w-[386px] h-[112px] bg-primary-50-light border border-primary-200-light rounded-xl p-[16px] flex gap-3 cursor-pointer hover:bg-primary-100-light transition-colors'
                >
                    <div className='w-[80px] h-[80px] bg-yellow-200 rounded-full flex-shrink-0 overflow-hidden'>
                        {leader.profile_image_url ? (
                            <img 
                                src={leader.profile_image_url} 
                                alt={leader.name}
                                className='w-full h-full object-cover'
                            />
                        ) : (
                            <div className='w-full h-full bg-yellow-200'></div>
                        )}
                    </div>
                    
                    <div className='flex-1 h-[74px]'>
                        <div className='flex items-baseline mb-2'>
                            <h4 className='text-[18px] text-primary-600-normal mr-[6px]'>Leader</h4>
                            <span className='text-[18px] text-neutral-900'>{leader.name || '-'}</span>
                        </div>
                        <p className='text-[14px] text-neutral-600'>
                            리더 프로필입니다.
                        </p>
                    </div>
                </div>
            </div>

            {/* 리더 프로필 상세 모달 */}
            {leaderDetail && (
                <MemberProfileModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    member={leaderDetail}
                />
            )}
        </>
    );
};

export default LeaderProfile;