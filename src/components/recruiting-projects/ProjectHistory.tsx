interface ProjectHistoryProps {
    getPositionStyle: (position: string) => string;
}

const ProjectHistory = ({ getPositionStyle }: ProjectHistoryProps) => {
    return (
        <div className='mt-[64px] ml-[10px]'>
            <h3 className='font-bold text-[20px] mb-6'>팀원들의 프로젝트 히스토리</h3>
            
            <div className='grid grid-cols-2 gap-6'>
                <div className='w-[386px]'>
                    <div className='flex gap-[10px] mb-[12px]'>
                        <span className={`inline-flex items-center justify-center w-[37px] h-[24px] px-[8px] py-[2px] ${getPositionStyle('pm')} text-neutral-700 rounded-[6px] text-[14px] font-medium`}>
                            PM
                        </span>
                        <span className={`inline-flex items-center justify-center w-[72px] h-[24px] px-[8px] py-[2px] ${getPositionStyle('backend')} text-neutral-700 rounded-[6px] text-[14px] font-medium`}>
                            Backend
                        </span>
                    </div>
                    
                    <div className='border border-neutral-200 rounded-xl overflow-hidden'>
                        <div className='w-full h-[211px] bg-neutral-400 rounded-xl'></div>
                        
                        <div className='pl-[20px] pr-[20px]'>
                            <h4 className='font-semibold text-[18px] mt-[14px] mb-[6px]'>트리플 UX.UI 개선 및 리브랜딩</h4>
                            <p className='text-[14px] text-neutral-600 mb-[6px] font-medium line-clamp-2'>
                                사용 체류 시간을 늘리고 기업 비전에 맞게 전략 및 BI 제안 <br />
                                / 여행의 전반에 활용 될 수 있는 UX Flow 개선 / GUI 제작
                            </p>
                            <p className='text-[14px] text-neutral-400'>2025.10~2025.12</p>
                        </div>
                    </div>
                </div>

                <div className='w-[386px]'>
                    <div className='flex gap-[10px] mb-[12px]'>
                        <span className={`inline-flex items-center justify-center w-[61px] h-[24px] px-[8px] py-[2px] ${getPositionStyle('design')} text-neutral-700 rounded-[6px] text-[14px] font-medium`}>
                            Design
                        </span>
                    </div>
                    
                    <div className='border border-neutral-200 rounded-xl overflow-hidden'>
                        <div className='w-full h-[211px] bg-black rounded-xl'></div>
                        
                        <div className='pl-[20px] pr-[20px]'>
                            <h4 className='font-semibold text-[18px] mt-[14px] mb-[6px]'>트리플 UX.UI 개선 및 리브랜딩</h4>
                            <p className='text-[14px] text-neutral-600 mb-[6px] font-medium line-clamp-2'>
                                사용 체류 시간을 늘리고 기업 비전에 맞게 전략 및 BI 제안 <br />
                                / 여행의 전반에 활용 될 수 있는 UX Flow 개선 / GUI 제작
                            </p>
                            <p className='text-[14px] text-neutral-400'>2025.10~2025.12</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectHistory;