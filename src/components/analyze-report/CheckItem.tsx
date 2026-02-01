import check from '@/assets/icons/analyze-report/Check.svg'

interface CheckItemProps {
    checkNumber: number
    title: string
    description: string
}

const CheckItem = ({ checkNumber, title, description }: CheckItemProps) => {
    return (
        <div className='bg-white rounded-lg p-6 h-[126px]'>
            <div className='flex items-start gap-3'>
                <div className='flex flex-col items-center mt-3'>
                    <p className='text-primary-600-normal font-bold text-sm mb-1'>Check {checkNumber}</p>
                    <img src={check} alt="check" className='w-[34px] h-[32px]' />
                </div>
                <div className='flex-1 ml-6'>
                    <h3 className='font-semibold text-[16px] mb-2'>
                        {title}
                    </h3>
                    <p className='text-[16px] text-gray-700 mb-3' dangerouslySetInnerHTML={{ __html: description }} />
                </div>
            </div>
        </div>
    );
};

export default CheckItem;