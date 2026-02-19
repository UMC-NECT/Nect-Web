import landingImage1 from '@/assets/images/landing/landing1.png'
import landingImage2 from '@/assets/images/landing/landing2.png'
import landingImage3 from '@/assets/images/landing/landing3.png'
import landingImage4 from '@/assets/images/landing/landing4.png'
import landingImage5 from '@/assets/images/landing/landing5.png'
import landingImage6 from '@/assets/images/landing/landing6.png'
import landingImage7 from '@/assets/images/landing/landing7.png'
import landingImage8 from '@/assets/images/landing/landing8.png'
import landingImage9 from '@/assets/images/landing/landing9.png'
import landingImage10 from '@/assets/images/landing/landing10.png'
import Button from '@/components/common/Button'
import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { LOCAL_STORAGE_KEY } from '@/constants/key'
import Footer from '@/components/layout/Footer'
import AnalysisHeader from '@/components/header/AnalysisHeader'
import { cn } from '@/utils/cn'

const SCROLL_THRESHOLD = 10

const LandingPage = () => {
    const navigate = useNavigate()
    const [headerVisible, setHeaderVisible] = useState(true)
    const lastScrollY = useRef(0)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            const y = window.scrollY
            if (y <= SCROLL_THRESHOLD) {
                setHeaderVisible(true)
            } else if (y > lastScrollY.current) {
                setHeaderVisible(false)
            } else {
                setHeaderVisible(true)
            }
            lastScrollY.current = y
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    const { getItem: getAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.ACCESS_TOKEN)
    const isLoggedIn = getAccessToken()

    const handleAIProfileAnalysis = () => {
        if (isLoggedIn) {
            navigate('/idea-analyze')
        } else {
            navigate('/profile-analyze')
        }
    }

	return (
		<>
            <div
                className={cn(
                    'fixed top-0 left-0 right-0 z-50 bg-white transition-transform duration-300 ease-out',
                    !headerVisible && '-translate-y-full'
                )}
            >
                <AnalysisHeader />
            </div>
            <section className='pt-[66px]'>
                <img src={landingImage1} alt="landingImage1" className='w-full h-full' />
                <img src={landingImage2} alt="landingImage2" className='w-full h-full' />
                <img src={landingImage3} alt="landingImage3" className='w-full h-full' />
                <img src={landingImage4} alt="landingImage4" className='w-full h-full' />
                <img src={landingImage5} alt="landingImage5" className='w-full h-full' />
                <img src={landingImage6} alt="landingImage6" className='w-full h-full' />
                <img src={landingImage7} alt="landingImage7" className='w-full h-full' />
                <img src={landingImage8} alt="landingImage8" className='w-full h-full' />
                <img src={landingImage9} alt="landingImage9" className='w-full h-full' />
                <img src={landingImage10} alt="landingImage10" className='w-full h-full' />
            </section>

            <section className='bg-bg-gray'>
                <div className='flex flex-row gap-4 justify-center pt-[76px]    '>
                    <Button color='secondary' size='xl' className='w-[300px] h-[60px]' onClick={handleAIProfileAnalysis}>
                        {isLoggedIn ? 'AI 아이디어 분석하러 가기' : '회원가입 후 시작하기'}
                        </Button>
                    <Button color='primary' size='xl' className='w-[300px] h-[60px]' onClick={() => navigate('/')}>홈 둘러보기</Button>
                </div>
            </section>
            <Footer type='Default' margin='196' className='bg-bg-gray' />
		</>
	)
}

export default LandingPage