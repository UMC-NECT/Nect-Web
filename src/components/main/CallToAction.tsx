import { Link } from 'react-router';

const CallToAction = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
    return (
        <div className="w-full h-37.5 px-[196px] flex justify-between items-center">
            <div className="h-[66px]">
                <h2 className="title-2 font-bold mb-2">Connect your Next!</h2>
                <p className="font-bold text-2xl">당신과 함께 성장할 팀을 넥트에서</p>
            </div>
            {!isLoggedIn && (
            <Link
                to="/signup"
                className="w-40 h-13.5 bg-primary-400-normal text-neutral-50 text-md font-semibold px-6 py-3 rounded-xl flex items-center justify-center hover:bg-primary-500-normal transition-colors">
                    회원가입하기
                </Link>
            )}
        </div>
    );
};

export default CallToAction;