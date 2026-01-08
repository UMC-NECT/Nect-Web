import Button from '@/components/common/Button'
import Dropdown from '@/components/common/Dropdown'
import Input from '@/components/common/Input'
import { useState } from 'react'

const jobs = ['직장인', '대학생', '취업 준비생', '프리랜서', '사업가', '기타']

const Step1 = () => {
	const [selectedJob, setSelectedJob] = useState<string>('')

	const handleSelectJob = (option: string) => {
		setSelectedJob(option)
	}

	return (
		<div>
			<div className=' heading-3 text-neutral-900 text-center mb-23'>나에 대해 알려주세요!</div>

			<div className='flex flex-col justify-center items-center gap-47.25'>
				<div className='flex flex-col gap-7.5'>
					<Input placeholder='닉네임' />
					<Input placeholder='생년월일 8자리' />
					<Dropdown options={jobs} placeholder='직업' value={selectedJob} onSelect={handleSelectJob} />
				</div>

				<Button size='lg'>다음</Button>
			</div>
		</div>
	)
}

export default Step1
