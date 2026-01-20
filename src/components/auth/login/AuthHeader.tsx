import NectLogoIcon from '@/assets/icons/common/nect-logo.svg?react'

const AuthHeader = () => {
	return (
		<>
			<div className=' flex flex-col items-center justify-center mb-10.5 gap-4.75'>
				<NectLogoIcon className='w-56.5 h-10' />
				<div className='title-1 text-neutral-900'>모든 창작자를 잇는 연결</div>
			</div>
		</>
	)
}

export default AuthHeader
