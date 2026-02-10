import More from '@/assets/icons/common/chevron-right.svg?react';
import projectBg from '@/assets/icons/main/nugu.svg'; 
import profile from '@/assets//icons/main/profile.svg';
import BarIcon from '@/assets/icons/common/Bar.svg?react';
import { Link } from 'react-router';
import { useMatchableMembers } from '@/hooks/queries/home';

const AvailableNecters = () => {
    const { data: members, isLoading, error } = useMatchableMembers();

    // 최대 4개만 표시
    const displayMembers = members?.slice(0, 4) || [];
    const hasData = !isLoading && !error && displayMembers.length > 0;

    // status, part 변환 함수
    const getDisplayStatus = (status: string | null) => {
        const statusMap: Record<string, string> = {
            'JOB_SEEKING': '매칭 가능',
            'EMPLOYED': '재직 중',
        };
        return status ? (statusMap[status] || status) : '매칭 가능';
    };

    const getDisplayPart = (part: string | null) => {
        const partMap: Record<string, string> = {
            'DESIGNER': 'Design',
            'DEVELOPER': 'Develop',
            'PLANNER': 'PM',
            'OTHER': '기타',
        };
        return part ? (partMap[part] || part) : '기타';
    };

    return (
        <div className="w-138 h-142.5">
            <div className="flex justify-between items-center mb-5 w-138 h-7.5">
                <h2 className="text-[22px] text-neutral-900 font-bold">지금 매칭 가능한 넥터</h2>
                {hasData && (
                    <Link 
                        to="/necterList"
                        className="w-16.5 h-6 flex items-center gap-1 cursor-pointer text-neutral-500 font-semibold text-md hover:text-neutral-700"
                    >
                        더보기
                        <More className="w-4 h-4 stroke-neutral-500 hover:stroke-neutral-700 mr-1" />
                    </Link>
                )}
            </div>

            {isLoading && (
                <div className="flex items-center justify-center h-full">
                    <p className="text-neutral-500">로딩 중...</p>
                </div>
            )}

            {error && (
                <div className="flex items-center justify-center h-full">
                    <p className="text-red-500">에러가 발생했습니다</p>
                </div>
            )}

            {!isLoading && !error && displayMembers.length === 0 && (
                <div className="flex items-center justify-center h-full">
                    <p className="text-neutral-500">매칭 가능한 넥터가 없습니다</p>
                </div>
            )}

            {hasData && (
                <div className="grid grid-cols-2 gap-2">
                    {displayMembers.map((member) => (
                        <Link 
                            key={member.userId}
                            to={`/matching-available/${member.userId}`}
                            className="w-68 h-64 rounded-xl overflow-hidden cursor-pointer bg-white border-neutral-100 border-[1.5px] hover:border-primary-400-normal hover:shadow-lg transition-all duration-200 block"
                        >
                            {/* 상단: 배경 + 이미지 영역 */}
                            <div className="relative h-30">
                                <img 
                                    src={projectBg} 
                                    alt="background"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                
                                {/* 프로필 이미지 + 매칭 가능 버튼 */}
                                <div className="absolute top-18.5 left-3 right-3 w-62">
                                    <div className="flex justify-between items-end">
                                        <img 
                                            src={member.imageUrl || profile} 
                                            alt={member.name}
                                            className="w-20 h-20 border-neutral-100 border rounded-full object-cover"
                                        />
                                        
                                        <div className="flex items-center justify-center gap-1 border border-primary-200-light rounded-2xl bg-white w-21.5 h-6.5">
                                            <span className="w-2.5 h-2.5 bg-primary-500-normal rounded-full"></span>
                                            <span className="text-sm text-neutral-700 font-semibold">
                                                {getDisplayStatus(member.status)}
                                            </span>
                                        </div>
                                    </div>
                                    {/* 하단: 텍스트 정보 영역 */}
                                    <div className="px-3 flex flex-col h-18 gap-1.5 mt-2">
                                        <div className="flex items-center text-lg font-semibold text-neutral-900 gap-1.5">
                                            <span>{member.name}</span>
                                            <BarIcon className="w-0.5 h-3" />
                                            <span className="text-neutral-500 font-medium">{getDisplayPart(member.part)}</span>
                                        </div>
                                        
                                        <p className="text-[13px] font-medium text-neutral-600 line-clamp-2">
                                            {member.introduction || '자기소개가 없습니다.'}
                                        </p>
                                    </div>
                                </div>
                                
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AvailableNecters;