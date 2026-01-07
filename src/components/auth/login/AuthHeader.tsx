import NectIcon from '@/assets/icons/common/logo.svg?react'
import NECT from '@/assets/icons/common/NECT.svg?react'

const AuthHeader = () => {
	return (
		<>
			<div className=' flex flex-col items-center justify-center mb-10.75 gap-4.75'>
				<div className='flex justify-center items-center gap-4.5'>
					<NectIcon />
					<NECT />
				</div>
				<div className='title-1 text-neutral-900'>모든 창작자를 잇는 연결</div>
			</div>
		</>
	)
}

export default AuthHeader
