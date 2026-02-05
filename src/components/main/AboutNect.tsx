import ManualIcon from '@/assets/icons/main/manual.svg';
import IdeaIcon from '@/assets/icons/main/idea.svg';

const AboutNect = () => {
    return (
        <div className="w-282 h-36 mx-auto grid grid-cols-2 gap-6">
            {/* 왼쪽: NECT가 처음이라면? */}
            <div className="relative border-[1.5px] border-primary-300-light rounded-xl p-6 overflow-hidden bg-primary-100-light bg-gradient-to-l from-[#660FD8]/[0.04] from-45% to-primary-300 to-100%">
                {/* 배경 원 */}
                <div className="absolute right-8 top-5/7 -translate-y-1/2 w-43.5 h-43.5 rounded-full bg-[#BE8CFC] flex items-center justify-center">
                </div>
                <img 
                        src={ManualIcon}
                        alt="Manual Icon"
                        className="w-48.5 h-48.5 absolute -top-6 right-5"
                />
                
                <div className="mt-3 ml-3">
                    <h3 className="text-2xl font-bold text-primary-700-dark mb-3">
                        NECT가 처음이라면?
                    </h3>
                    <p className="text-lg text-neutral-600">
                        넥트 사용가이드를 제공해드릴게요 !
                    </p>
                </div>
            </div>
            
            {/* 오른쪽: AI 아이디어 분석 */}
            <div className="relative border-[1.5px] border-[#C1CDF9] rounded-xl p-6 overflow-hidden bg-[#F6F8FF] bg-gradient-to-r from-[#889FF5]/[0.04] from-45% to-[#889FF5]/[0.02] to-100%">
                {/* 배경 원 */}
                <div className="absolute right-8 top-5/7 -translate-y-1/2 w-43.5 h-43.5 rounded-full bg-[#A8BCFF] flex items-center justify-center">
                </div>
                <img 
                    src={IdeaIcon}
                    alt="AI Icon"
                    className="w-48.5 h-48.5 absolute -top-6 right-5"
                />
                
                <div className="ml-3">
                    <h3 className="text-2xl font-bold text-[#0026B8] mb-3">
                        AI 아이디어 분석
                    </h3>
                    <p className="text-lg text-neutral-600">
                        프로젝트 아이디어를 등록하고<br />팀원을 찾아보세요!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutNect;