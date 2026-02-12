import { useState } from 'react';
import type { ProjectDetailDto } from '@/types/api/project';
import ProfileCard from '@/components/mypage/ProfileCard';
import MemberProfileModal from './MemberProfileModal';
import { useMemberDetail } from '@/hooks/queries/member/useMemberDetail';

interface LeaderProfileProps {
	projectData: ProjectDetailDto
}

const LeaderProfile = ({ projectData }: LeaderProfileProps) => {
    const leader = projectData.defaultInfo?.leader;
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // 타입 안전하게 user_id 접근
    const getLeaderId = () => {
        if (!leader) return 0;
        
        // leader가 unknown 타입이므로 타입 가드 사용
        if (typeof leader === 'object' && leader !== null) {
            const leaderObj = leader as Record<string, unknown>;
            
            if ('user_id' in leaderObj && typeof leaderObj.user_id === 'number') {
                return leaderObj.user_id;
            }
            
            // id 필드도 확인
            if ('id' in leaderObj && typeof leaderObj.id === 'number') {
                return leaderObj.id;
            }
        }
        
        return 0;
    };
    
    const leaderId = getLeaderId();
    
    // 리더의 상세 정보 가져오기
    const { data: leaderDetail, isLoading: isLeaderDetailLoading } = useMemberDetail(leaderId);

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
        if (leaderId) {
            setIsModalOpen(true);
        }
    };

    // leader 객체에서 안전하게 속성 접근
    const getLeaderProperty = (key: string): string => {
        if (typeof leader === 'object' && leader !== null) {
            const leaderObj = leader as Record<string, unknown>;
            const value = leaderObj[key];
            return typeof value === 'string' ? value : '';
        }
        return '';
    };

    const leaderName = getLeaderProperty('name');
    const profileImageUrl = getLeaderProperty('profile_image_url');

    return (
        <>
            <div className='mt-[64px] ml-[10px]'>
                <h3 className='font-bold text-[20px] mb-4'>
                    리더 프로필
                    <span className='text-red-500 text-[16px] ml-1'>*</span>
                </h3>
                
                <div className='cursor-pointer' onClick={handleLeaderClick}>
                    <ProfileCard
                        profileImage={
                            profileImageUrl ? (
                                <img
                                    src={profileImageUrl}
                                    alt=''
                                    className='w-20 h-20 rounded-full object-cover'
                                />
                            ) : undefined
                        }
                        isLeader
                        highlighted
                        nickname={leaderName || '-'}
                        introduction='리더 프로필입니다.'
                    />
                </div>
            </div>

            {/* 리더 프로필 상세 모달 */}
            {isModalOpen && (
                <MemberProfileModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    member={leaderDetail}
                    isLoading={isLeaderDetailLoading}
                />
            )}
        </>
    );
};

export default LeaderProfile;