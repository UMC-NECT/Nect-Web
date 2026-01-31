import logo from '@/assets/icons/common/nect-logo.svg'
import { useState, useMemo } from 'react'

interface FormData {
    projectName: string
    oneLine: string
    targetUser: string
    problem: string
    features: string[]
    platform: string
    competitor: string
    challenge: string
    deadline: string
}

interface Errors {
    projectName: boolean
    oneLine: boolean
    targetUser: boolean
    problem: boolean
    features: boolean
    platform: boolean
    competitor: boolean
    challenge: boolean
    deadline: boolean
}

const IdeaAnalyzePage = () => {
    const [formData, setFormData] = useState<FormData>({
        projectName: '',
        oneLine: '',
        targetUser: '',
        problem: '',
        features: [],
        platform: '',
        competitor: '',
        challenge: '',
        deadline: ''
    })

    const [featureInput, setFeatureInput] = useState('')
    const [editingIndex, setEditingIndex] = useState<number | null>(null)

    const [errors, setErrors] = useState<Errors>({
        projectName: false,
        oneLine: false,
        targetUser: false,
        problem: false,
        features: false,
        platform: false,
        competitor: false,
        challenge: false,
        deadline: false
    })

    const isFormComplete = useMemo(() => {
        return (
            formData.projectName.trim() !== '' &&
            formData.oneLine.trim() !== '' &&
            formData.targetUser.trim() !== '' &&
            formData.problem.trim() !== '' &&
            formData.features.length === 3 &&
            formData.platform.trim() !== '' &&
            formData.competitor.trim() !== '' &&
            formData.challenge.trim() !== '' &&
            formData.deadline.trim() !== ''
        )
    }, [formData])

    const handleFeatureKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && featureInput.trim() !== '') {
            e.preventDefault()
            
            if (editingIndex !== null) {
                // 수정 모드
                const newFeatures = [...formData.features]
                newFeatures[editingIndex] = featureInput.trim()
                setFormData({
                    ...formData,
                    features: newFeatures
                })
                setEditingIndex(null)
            } else if (formData.features.length < 3) {
                // 추가 모드
                setFormData({
                    ...formData,
                    features: [...formData.features, featureInput.trim()]
                })
            }
            setFeatureInput('')
        }
    }

    const removeFeature = (index: number) => {
        setFormData({
            ...formData,
            features: formData.features.filter((_, i) => i !== index)
        })
        if (editingIndex === index) {
            setEditingIndex(null)
            setFeatureInput('')
        }
    }

    const startEditFeature = (index: number) => {
        setEditingIndex(index)
        setFeatureInput(formData.features[index])
    }

    const handleSubmit = () => {
        const newErrors: Errors = {
            projectName: !formData.projectName,
            oneLine: !formData.oneLine,
            targetUser: !formData.targetUser,
            problem: !formData.problem,
            features: formData.features.length !== 3,
            platform: !formData.platform,
            competitor: !formData.competitor,
            challenge: !formData.challenge,
            deadline: !formData.deadline
        }

        setErrors(newErrors)

        const hasErrors = Object.values(newErrors).some(error => error === true)
        
        if (!hasErrors) {
            console.log('Submit', formData)
        }
    }

    const getInputClassName = (fieldName: keyof Errors): string => {
        const baseClass = 'w-full px-4 py-3 border rounded-lg bg-white placeholder:text-gray-400 text-[14px] focus:outline-none'
        const focusClass = 'focus:border-primary-500-normal focus:border-[1.5px]'
        const errorClass = errors[fieldName] ? 'border-red-500 border-[1.5px]' : 'border-gray-300'
        
        return `${baseClass} ${focusClass} ${errorClass}`
    }

    return (
        <div className="flex flex-col items-center justify-start min-h-screen pt-[100px]">
            <div className="flex flex-col items-center px-4 mb-4">
                <img src={logo} alt="NECT Logo" className="w-[226px] h-[40px] mb-[26px]" />
                <h1 className="text-[32px] font-bold text-neutral-900 text-center">프로젝트 아이디어 분석 리포트</h1>
            </div>

            <div className='relative bg-bg-gray rounded-[100px] z-10 w-screen -ml-[calc((100vw-100%)/2)] -mr-[calc((100vw-100%)/2)] min-h-screen py-8 mt-[258px]'>
                <div className="mt-[80px] flex flex-col justify-center items-center">
                    <h2 className='font-semibold text-md text-primary-600-normal'>NECT Analyze Report</h2>
                    <p className="font-bold text-[28px] mt-4">아이디어 입력을 시작합니다!</p>
                </div>
                
                <div className='mt-20 w-[940px] mx-auto'>
                    {/* 01 프로젝트 기본 정보 */}
                    <div className='mb-12 flex gap-6'>
                        <h2 className='font-bold text-[28px] flex-shrink-0'>01</h2>
                        <div className='flex-1'>
                            <p className='font-bold text-[28px] text-primary-600-normal mb-8'>프로젝트 기본 정보</p>
                            
                            <div className='mb-6'>
                                <label className='block mb-2'>
                                    <span className='font-medium text-[16px]'>프로젝트 이름</span>
                                    <span className='text-red-500 ml-1'>*</span>
                                </label>
                                <input 
                                    type='text' 
                                    placeholder='영작하고 있는 프로젝트 명을 30자 이내로 입력해주세요'
                                    className={getInputClassName('projectName')}
                                    value={formData.projectName}
                                    onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                                />
                            </div>

                            <div className='mb-6'>
                                <label className='block mb-2'>
                                    <span className='font-medium text-[16px]'>한줄 정의</span>
                                    <span className='text-red-500 ml-1'>*</span>
                                </label>
                                <input 
                                    type='text' 
                                    placeholder='이 서비스가 무엇인지 한 문장으로 표현해주세요'
                                    className={getInputClassName('oneLine')}
                                    value={formData.oneLine}
                                    onChange={(e) => setFormData({...formData, oneLine: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 02 아이디어 구체화 */}
                    <div className='mb-12 flex gap-6'>
                        <h2 className='font-bold text-[28px] flex-shrink-0'>02</h2>
                        <div className='flex-1'>
                            <p className='font-bold text-[28px] text-primary-600-normal mb-8'>아이디어 구체화</p>

                            <div className='mb-6'>
                                <label className='block mb-2'>
                                    <span className='font-medium text-[16px]'>누가 이 서비스를 사용하나요?</span>
                                    <span className='text-red-500 ml-1'>*</span>
                                </label>
                                <input 
                                    type='text' 
                                    placeholder='이 아이디어의 주요 사용자층을 작성해주세요'
                                    className={getInputClassName('targetUser')}
                                    value={formData.targetUser}
                                    onChange={(e) => setFormData({...formData, targetUser: e.target.value})}
                                />
                            </div>

                            <div className='mb-6'>
                                <label className='block mb-2'>
                                    <span className='font-medium text-[16px]'>이 서비스는 어떤 문제를 해결하나요?</span>
                                    <span className='text-red-500 ml-1'>*</span>
                                </label>
                                <input 
                                    type='text' 
                                    placeholder='자유롭게 작성해주세요'
                                    className={getInputClassName('problem')}
                                    value={formData.problem}
                                    onChange={(e) => setFormData({...formData, problem: e.target.value})}
                                />
                            </div>

                            <div className='mb-6'>
                                <label className='block mb-2'>
                                    <span className='font-medium text-[16px]'>이 서비스의 가장 중요한 핵심 기능 3가지는 무엇인가요?</span>
                                    <span className='text-red-500 ml-1'>*</span>
                                </label>
                                <div className={`w-full min-h-[120px] px-4 py-3 border rounded-lg bg-white focus-within:border-primary-500-normal focus-within:border-[1.5px] ${
                                    errors.features ? 'border-red-500 border-[1.5px]' : 'border-gray-300'
                                }`}>
                                    {formData.features.map((feature, index) => (
                                        editingIndex === index ? (
                                            <div key={index} className='flex items-center gap-2 mb-2'>
                                                <span className='text-primary-600-normal font-medium'>{index + 1}.</span>
                                                <input 
                                                    type='text'
                                                    value={featureInput}
                                                    onChange={(e) => setFeatureInput(e.target.value)}
                                                    onKeyDown={handleFeatureKeyDown}
                                                    onBlur={() => {
                                                        if (featureInput.trim() === '') {
                                                            setEditingIndex(null)
                                                            setFeatureInput('')
                                                        }
                                                    }}
                                                    autoFocus
                                                    className='flex-1 outline-none text-[14px]'
                                                />
                                                <button 
                                                    onClick={() => removeFeature(index)}
                                                    className='text-gray-400 hover:text-gray-600'
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ) : (
                                            <div key={index} className='flex items-center gap-2 mb-2'>
                                                <span className='text-primary-600-normal font-medium'>{index + 1}.</span>
                                                <span 
                                                    onClick={() => startEditFeature(index)}
                                                    className='flex-1 text-[14px] cursor-pointer hover:text-primary-500-normal'
                                                >
                                                    {feature}
                                                </span>
                                                <button 
                                                    onClick={() => removeFeature(index)}
                                                    className='text-gray-400 hover:text-gray-600'
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        )
                                    ))}
                                    {formData.features.length < 3 && editingIndex === null && (
                                        <div className='flex items-center gap-2'>
                                            <span className='text-gray-400 font-medium'>{formData.features.length + 1}.</span>
                                            <input 
                                                type='text'
                                                value={featureInput}
                                                onChange={(e) => setFeatureInput(e.target.value)}
                                                onKeyDown={handleFeatureKeyDown}
                                                placeholder='꼭 들어갔으면 하는 기능 위주로 작성해주세요'
                                                className='flex-1 outline-none text-[14px] placeholder:text-gray-400'
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className='mb-6'>
                                <label className='block mb-2'>
                                    <span className='font-medium text-[16px]'>어떤 플랫폼 서비스 위주인가요?</span>
                                    <span className='text-red-500 ml-1'>*</span>
                                </label>
                                <input 
                                    type='text' 
                                    placeholder='웹(iOS/안드로이드), 웹(데스크톱/태블릿), 기기 인터페이스(키오스크/실물교구등), 전화통, 오프라인 등을 구체적으로 작성해주세요.'
                                    className={getInputClassName('platform')}
                                    value={formData.platform}
                                    onChange={(e) => setFormData({...formData, platform: e.target.value})}
                                />
                            </div>

                            <div className='mb-6'>
                                <label className='block mb-2'>
                                    <span className='font-medium text-[16px]'>참고할만한 기존 서비스나 경쟁사가 있나요? (현다면, '없음' 입력)</span>
                                    <span className='text-red-500 ml-1'>*</span>
                                </label>
                                <input 
                                    type='text' 
                                    placeholder='자유롭게 작성해주세요'
                                    className={getInputClassName('competitor')}
                                    value={formData.competitor}
                                    onChange={(e) => setFormData({...formData, competitor: e.target.value})}
                                />
                            </div>

                            <div className='mb-6'>
                                <label className='block mb-2'>
                                    <span className='font-medium text-[16px]'>구현 시 가장 걱정되거나 해결이 필요한 기술적 및 외부적 난관은 무엇인가요?</span>
                                    <span className='text-red-500 ml-1'>*</span>
                                </label>
                                <input 
                                    type='text' 
                                    placeholder='자유롭게 작성해주세요'
                                    className={getInputClassName('challenge')}
                                    value={formData.challenge}
                                    onChange={(e) => setFormData({...formData, challenge: e.target.value})}
                                />
                            </div>

                            <div className='mb-6'>
                                <label className='block mb-2'>
                                    <span className='font-medium text-[16px]'>생각해고 있는 프로젝트 최종 목표일이 있나요?</span>
                                    <span className='text-red-500 ml-1'>*</span>
                                </label>
                                <input 
                                    type='text' 
                                    placeholder='ex. 두달 뒤 / 올해 10월까지 / 0000년 00월 00일까지'
                                    className={getInputClassName('deadline')}
                                    value={formData.deadline}
                                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    {/* AI 아이디어 분석하기 버튼 */}
                    <div className='flex justify-center mt-16 mb-8'>
                        <button 
                            onClick={handleSubmit}
                            disabled={!isFormComplete}
                            className={`w-[320px] h-[60px] text-white font-semibold text-[16px] px-12 py-4 rounded-2xl transition-colors ${
                                isFormComplete 
                                    ? 'bg-primary-400-normal hover:bg-primary-500-normal cursor-pointer' 
                                    : 'bg-gray-300 cursor-not-allowed'
                            }`}
                        >
                            AI 아이디어 분석하기
                        </button>
                    </div>
                </div>
            </div>
            {/* 홈으로 이동 */}
            <div className='flex justify-center mb-80'>
                <button className='text-gray-600 text-[14px] underline underline-offset-4 m-[44px]'>
                    홈으로 이동
                </button>
            </div>
        </div>
    );
};

export default IdeaAnalyzePage;