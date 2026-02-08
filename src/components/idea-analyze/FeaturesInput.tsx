import { useRef } from 'react'

interface FeaturesInputProps {
    features: string[]
    onChange: (index: number, value: string) => void
    error: boolean
}

const FeaturesInput = ({ features, onChange, error }: FeaturesInputProps) => {
    const inputRefs = useRef<HTMLInputElement[]>([])

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Enter') {
            e.preventDefault()

            const nextIndex = index + 1
            if (nextIndex < features.length && inputRefs.current[nextIndex]) {
                inputRefs.current[nextIndex]?.focus()
            }
        }
    }

    return (
        <div className='mb-6'>
            <label className='block mb-2'>
                <span className='font-medium text-[16px]'>이 서비스의 가장 중요한 핵심 기능 3가지는 무엇인가요?</span>
                <span className='text-red-500 ml-1'>*</span>
            </label>
            <div className={`w-[864px] h-[164px] px-4 py-4 border rounded-lg bg-neutral-000 flex flex-col justify-between transition-colors ${
                error ? 'border-danger-500 border-[1.5px]' : 'border-neutral-000'
            } focus-within:border-primary-500-normal focus-within:border-[1.5px]`}>
                {features.map((feature, index) => (
                    <div key={index} className='flex items-center gap-2'>
                        <span className={`font-medium ${feature.trim() ? 'text-primary-600-normal' : 'text-neutral-400'}`}>
                            {index + 1}.
                        </span>
                        <input
                            ref={el => {
                                if (el) inputRefs.current[index] = el
                            }}
                            type='text'
                            maxLength={1000}
                            value={feature}
                            onChange={e => onChange(index, e.target.value)}
                            onKeyUp={e => handleKeyUp(e, index)}
                            placeholder={index === 0 ? '꼭 들어갔으면 하는 기능 위주로 작성해주세요' : ''}
                            className='flex-1 outline-none text-[16px] placeholder:text-neutral-400 placeholder:text-[16px] bg-transparent'
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeaturesInput;