const AboutNect = () => {
    return (
        <div className="w-[1200px] mx-auto grid grid-cols-2 gap-6">
            {/* 왼쪽: NECT가 처음이라면? */}
            <div className="bg-neutral-100 rounded-2xl p-8 transition-colors cursor-pointer">
                
                <h3 className="text-[24px] font-bold mb-4">NECT가 처음이라면?</h3>
                <p className="text-[20px] font-semibold mb-6">
                    NECT 사용 방법을 확인하고 프로젝트를 시작해보세요
                </p>
                
                <div className="flex justify-end">
                    <button className="px-6 py-3 text-white bg-neutral-600 font-semibold rounded-xl">
                        가이드 확인하기
                    </button>
                </div>
            </div>
            
            {/* 오른쪽: 프로젝트 아이디어 등록하기 */}
            <div className="bg-neutral-100 rounded-2xl p-8 transition-colors cursor-pointer">                
                <h3 className="text-[24px] font-bold mb-4">프로젝트 아이디어 등록하기</h3>
                <p className="text-[20px] font-semibold mb-6">
                    아이디어를 등록하고 함께할 팀원을 찾아보세요
                </p>
                
                <div className="flex justify-end">
                    <button className="px-6 py-3 bg-neutral-600 text-white font-semibold rounded-xl">
                        아이디어 등록하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AboutNect;