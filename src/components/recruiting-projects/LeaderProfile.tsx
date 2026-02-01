import bar from '@/assets/icons/common/Bar.svg';

interface LeaderProfileProps {
    getPositionStyle: (position: string) => string;
}

const LeaderProfile = ({ getPositionStyle }: LeaderProfileProps) => {
    return (
        <div className='mt-[64px] ml-[10px]'>
            <h3 className='font-bold text-[20px] mb-4'>
                리더 프로필
                <span className='text-red-500 text-[16px] ml-1'>*</span>
            </h3>
            
            <div className='mb-[12px]'>
                <span className={`inline-flex items-center justify-center w-[37px] h-[24px] px-[8px] py-[2px] ${getPositionStyle('pm')} text-neutral-700 rounded-[6px] text-[14px] font-medium`}>
                    PM
                </span>
            </div>

            <div className='w-[386px] h-[112px] bg-primary-50-light border border-primary-200-light rounded-xl p-[16px] flex gap-3 cursor-pointer'>
                <div className='w-[80px] h-[80px] bg-yellow-200 rounded-full flex-shrink-0'></div>
                
                <div className='flex-1 h-[74px]'>
                    <div className='flex items-baseline mb-2'>
                        <h4 className='text-[18px] text-primary-600-normal mr-[6px]'>Leader</h4>
                        <span className='text-[18px] text-neutral-900'>시루</span>
                        <img src={bar} alt="Bar" className='mx-2 w-[2px] h-[12px] bg-neutral-300' />
                        <span className='text-[18px] text-neutral-500'>PM</span>
                    </div>
                    <p className='text-[14px] text-neutral-600'>
                        디자인 전공 출신 만능형 프로덕트 매니저입니다 ! 함께 성장 할 팀을 구합니다 !
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LeaderProfile;