import type { ProjectDetailDto } from '@/types/api/project'

interface LeaderProfileProps {
	projectData: ProjectDetailDto
}

const LeaderProfile = ({ projectData }: LeaderProfileProps) => {
    const leader = projectData.defaultInfo?.leader;

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

    return (
        <div className='mt-[64px] ml-[10px]'>
            <h3 className='font-bold text-[20px] mb-4'>
                리더 프로필
                <span className='text-red-500 text-[16px] ml-1'>*</span>
            </h3>
            
            <div className='w-[386px] h-[112px] bg-primary-50-light border border-primary-200-light rounded-xl p-[16px] flex gap-3 cursor-pointer'>
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
    );
};

export default LeaderProfile;