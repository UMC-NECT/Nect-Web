const CallToAction = () => {
    return (
        <div className="w-282 h-37.5 mx-auto p-10 flex justify-between items-center">
            <div>
                <h2 className="text-3xl font-bold mb-4">Connect your Nect!</h2>
                <p className="mb-6">당신과 함께 성장할 팀을 넥트에서</p>
            </div>
            <button className="w-40 h-13.5 bg-primary-400-normal text-white font-semibold px-6 py-3 rounded-lg">
                회원가입하기
            </button>
        </div>
    );
};

export default CallToAction;