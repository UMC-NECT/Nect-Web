interface FormInputProps {
    label: string
    placeholder: string
    value: string
    onChange: (value: string) => void
    error: boolean
    required?: boolean
}

const FormInput = ({ label, placeholder, value, onChange, error, required = true }: FormInputProps) => {
    return (
        <div className='mb-6'>
            <label className='block mb-2'>
                <span className='font-medium text-[16px]'>{label}</span>
                {required && <span className='text-red-500 ml-1'>*</span>}
            </label>
            <input 
                type='text' 
                placeholder={placeholder}
                className={`px-4 py-3 border rounded-lg bg-white placeholder:text-gray-400 placeholder:text-[16px] text-[16px] focus:outline-none focus:border-primary-500-normal focus:border-[1.5px] w-[864px] h-[64px] ${
                    error ? 'border-red-500 border-[1.5px]' : 'border-gray-300'
                }`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};

export default FormInput;