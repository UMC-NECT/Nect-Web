interface ProjectBasicInfoProps {
    getPositionStyle: (position: string) => string;
}

const ProjectBasicInfo = ({ getPositionStyle }: ProjectBasicInfoProps) => {
    return (
        <>
            {/* 프로젝트 정보 내용 */}
            <div className='flex h-[178px] text-[16px]'>
                <div className='w-[320px] h-[178px] bg-neutral-200 rounded-lg mr-[28px]'></div>
                <div className='flex-1'>
                    <div className='mb-4 flex gap-[20px] items-start'>
                        <p className='text-neutral-600 mb-1 w-[100px] whitespace-nowrap'>프로젝트 이름</p>
                        <p className='font-semibold text-primary-600-normal'>넥트(Nect)</p>
                    </div>
                    <div className='mb-4 flex gap-[20px] items-start'>
                        <p className='text-neutral-600 mb-1 w-[100px] whitespace-nowrap'>프로젝트 소개</p>
                        <p className='ml-3'>아이디어 분석으로 프로젝트 등록, 팀원 매칭, 협업 보드까지, 사이드 프로젝트 팀 플랫폼 개발</p>
                    </div>
                    <div className='mb-4 flex gap-[20px] items-start'>
                        <p className='text-neutral-600 mb-1 w-[100px] whitespace-nowrap'>예상 기간</p>
                        <p>2025. 11. 13 ~ 2026. 02. 11</p>
                    </div>
                    <div className='mb-4 flex gap-[20px] items-start'>
                        <p className='text-neutral-600 mb-1 w-[100px] whitespace-nowrap'>모집 여부</p>
                        <p className='text-[16px] flex items-center gap-2'>
                            <div className='bg-primary-100-light w-[74px] h-[26px] rounded-xl flex items-center gap-2 px-2'>
                                <span className='inline-block w-[10px] h-[10px] bg-primary-500-normal rounded-full'></span>
                                <span className='text-[14px]'>모집 중</span>
                            </div>
                            <span className='text-primary-500-normal font-bold text-[18px] ml-[10px]'>D-22</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* 프로젝트 분야 */}
            <div className='mt-[64px] ml-[10px]'>
                <h2 className='font-bold text-[20px] mb-4'>
                    프로젝트 분야
                    <span className='text-red-500 text-[16px] ml-1'>*</span>
                </h2>
                <div className='flex gap-[10px]'>
                    <p className='w-[165px] h-[36px] bg-primary-150-light border border-primary-400 rounded-2xl text-primary-500-normal font-semibold items-center flex justify-center'>
                        ITㆍ웹,모바일 서비스
                    </p>
                    <p className='w-[155px] h-[36px] bg-primary-150-light border border-primary-400 rounded-2xl text-primary-500-normal font-semibold items-center flex justify-center'>
                        네트워킹ㆍ커뮤니티
                    </p>
                </div>
            </div>

            {/* 모집 정보 및 필수 스택 */}
            <div className='mt-[64px] ml-[10px]'>
                <h2 className='font-bold text-[20px] mb-4'>
                    모집 정보 및 필수 스택
                    <span className='text-red-500 text-[16px] ml-1'>*</span>
                </h2>
                
                <div className='space-y-4'>
                    <div className='flex gap-8'>
                        <div className='w-[120px] flex-shrink-0'>
                            <span className={`inline-flex items-center justify-center px-[8px] py-[2px] ${getPositionStyle('design')} text-neutral-700 rounded-[6px] text-[14px] font-medium`}>
                                Design (1)
                            </span>
                        </div>
                        <ul className='flex-1 space-y-2 list-disc list-outside text-[16px] pl-5'>
                            <li>사용자 경험을 고려한 플랫폼의 UI/UX 디자인을 담당합니다.</li>
                            <li>UI디자인을 위한 Figma / Illustrator 사용 가능하셔야합니다.</li>
                            <li>개발팀과 협업하여 디자인을 구현합니다.</li>
                        </ul>
                    </div>

                    <div className='flex gap-8'>
                        <div className='w-[120px] flex-shrink-0'>
                            <span className={`inline-flex items-center justify-center px-[8px] py-[2px] ${getPositionStyle('backend')} text-neutral-700 rounded-[6px] text-[14px] font-medium`}>
                                Backend (2)
                            </span>
                        </div>
                        <ul className='flex-1 space-y-2 list-disc list-outside text-[16px] pl-5'>
                            <li>사용자 경험을 고려한 플랫폼의 UI/UX 디자인을 담당합니다.</li>
                            <li>UI디자인을 위한 Figma / Illustrator 사용 가능하셔야합니다.</li>
                            <li>개발팀과 협업하여 디자인을 구현합니다.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* 프로젝트 파트 / 팀원 구성 */}
            <div className='mt-[64px] ml-[10px]'>
                <h2 className='font-bold text-[20px] mb-4'>
                    프로젝트 파트 <span className="text-neutral-600">/</span> 팀원 구성
                    <span className='text-red-500 text-[16px] ml-1'>*</span>
                </h2>

                <div className='space-y-6'>
                    <div className='flex items-center gap-6'>
                        <p className='w-[90px] text-[16px] font-medium'>기획</p>
                        <p className='w-[50px] text-[16px]'>1명</p>
                        <div className='flex gap-2'>
                            <span className={`inline-flex items-center justify-center w-[57px] h-[24px] px-[8px] py-[2px] ${getPositionStyle('pm')} text-neutral-700 rounded-[6px] text-[14px] font-medium`}>
                                PM (1)
                            </span>
                        </div>
                    </div>

                    <div className='flex items-center gap-6'>
                        <p className='w-[90px] text-[16px] font-medium'>디자인</p>
                        <p className='w-[50px] text-[16px]'>1명</p>
                        <div className='flex gap-2'>
                            <span className={`inline-flex items-center justify-center w-[82px] h-[24px] px-[8px] py-[2px] ${getPositionStyle('design')} text-neutral-700 rounded-[6px] text-[14px] font-medium`}>
                                Design (2)
                            </span>
                        </div>
                    </div>

                    <div className='flex items-center gap-6'>
                        <p className='w-[90px] text-[16px] font-medium'>개발</p>
                        <p className='w-[50px] text-[16px]'>8명</p>
                        <div className='flex gap-2'>
                            <span className={`inline-flex items-center justify-center w-[96px] h-[24px] px-[8px] py-[2px] ${getPositionStyle('frontend')} text-neutral-700 rounded-[6px] text-[14px] font-medium`}>
                                Frontend (4)
                            </span>
                            <span className={`inline-flex items-center justify-center w-[94px] h-[24px] px-[8px] py-[2px] ${getPositionStyle('backend')} text-neutral-700 rounded-[6px] text-[14px] font-medium`}>
                                Backend (4)
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProjectBasicInfo;