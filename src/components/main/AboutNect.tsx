import ManPose from '@/assets/images/main/Nect_Guide.svg';
import Analysis from '@/assets/images/main/Analyze.svg';

const AboutNect = () => {
    return (
        <div className="w-282 h-36 mx-auto grid grid-cols-2 gap-6">
            {/* 왼쪽: NECT가 처음이라면? */}
            <div className="relative flex items-center border-[1.5px] border-primary-300-light rounded-xl p-6 overflow-hidden bg-primary-100-light bg-linear-to-l from-[#660FD8]/4 from-45% to-primary-300 to-100%">
                <img
                        src={ManPose}
                        alt="Manual Icon"
                        className="absolute top-0 right-5"
                />

                <div className="ml-3">
                    <h3 className="text-2xl font-bold text-primary-700-dark mb-3">
                        NECT가 처음이라면?
                    </h3>
                    <p className="text-lg text-neutral-600">
                        넥트 사용가이드를 제공해드릴게요 !
                    </p>
                </div>
            </div>

            {/* 오른쪽: AI 아이디어 분석 */}
            <div className="relative flex items-center border-[1.5px] border-[#C1CDF9] rounded-xl p-6 overflow-hidden bg-[#F6F8FF] bg-linear-to-r from-[#889FF5]/4 from-45% to-[#889FF5]/2 to-100%">
                <img
                    src={Analysis}
                    alt="AI Icon"
                    className="absolute top-0 right-5"
                />

                <div className="ml-3 ">
                    <h3 className="text-2xl font-bold text-[#0026B8] mb-3">
                        AI 아이디어 분석
                    </h3>
                    <p className="text-lg text-neutral-600">
                        프로젝트 아이디어를 등록 후 AI 가이드까지 !
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutNect;