import NecttyIcon from '@/assets/nectty.png'
import Button from '@/components/common/Button'
import { useNavigate } from 'react-router'

const LoginCompletePage = () => {
    const navigate = useNavigate()
    const handleLogin = () => {
        navigate('/login')
    }
	return (
		<div className='flex flex-col w-[412px] items-center justify-center mx-auto h-full'>
			<div className='flex flex-col gap-3.5 mb-[58px] text-center'>
                <p className='heading-2 font-bold text-neutral-800'>가입이 완료됐어요!</p>
                <p className='title-1 font-medium text-primary-500-normal'>팀 매칭부터 협업까지 넥트에서 다 가능해요</p>
            </div>
            <img src={NecttyIcon} alt="NecttyIcon" className='w-[225px] h-[192.8px]' />

            <Button className='font-semibold text-[20px] px-2 pb-2.5 pt-2 rounded-12 w-full h-[56px] mt-[85.2px]' onClick={handleLogin}>로그인 페이지로</Button>
		</div>
	)
}

export default LoginCompletePage