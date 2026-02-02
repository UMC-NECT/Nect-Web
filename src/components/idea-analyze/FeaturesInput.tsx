import { useRef } from 'react'

interface FeaturesInputProps {
    features: string[]
    onChange: (index: number, value: string) => void
    error: boolean
}

const FeaturesInput = ({ features, onChange, error }: FeaturesInputProps) => {
    const input0Ref = useRef<HTMLInputElement>(null)
    const input1Ref = useRef<HTMLInputElement>(null)
    const input2Ref = useRef<HTMLInputElement>(null)

    const getInputRef = (index: number) => {
        if (index === 0) return input0Ref
        if (index === 1) return input1Ref
        return input2Ref
    }

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            
            if (index === 0 && input1Ref.current) {
                input1Ref.current.focus()
            } else if (index === 1 && input2Ref.current) {
                input2Ref.current.focus()
            }
        }
    }

    return (
        <div className='mb-6'>
            <label className='block mb-2'>
                <span className='font-medium text-[16px]'>이 서비스의 가장 중요한 핵심 기능 3가지는 무엇인가요?</span>
                <span className='text-red-500 ml-1'>*</span>
            </label>
            <div className={`w-[864px] h-[164px] px-4 py-4 border rounded-lg bg-white flex flex-col justify-between ${
                error ? 'border-red-500 border-[1.5px]' : 'border-gray-300'
            }`}>
                {features.map((feature, index) => (
                    <div key={index} className='flex items-center gap-2'>
                        <span className={`font-medium ${feature.trim() ? 'text-primary-600-normal' : 'text-gray-400'}`}>
                            {index + 1}.
                        </span>
                        <input 
                            ref={getInputRef(index)}
                            type='text'
                            value={feature}
                            onChange={(e) => onChange(index, e.target.value)}
                            onKeyUp={(e) => handleKeyUp(e, index)}
                            placeholder={index === 0 ? '꼭 들어갔으면 하는 기능 위주로 작성해주세요' : ''}
                            className='flex-1 outline-none text-[16px] placeholder:text-gray-400 placeholder:text-[16px] bg-transparent'
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeaturesInput;