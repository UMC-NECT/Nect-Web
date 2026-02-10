import { useParams, useNavigate } from 'react-router'
import Button from '@/components/common/Button'
import Character from '@/assets/Character.png'

const ERROR_CODES = ['404', '408', '500', '503'] as const
type ErrorCode = (typeof ERROR_CODES)[number]


/** 숫자와 캐릭터 이미지가 겹치도록 음수 마진 사용 (absolute 없음) */
const ErrorSection = ({ code }: { code: string }) => {
	const [a, b, c] = code.split('')
	return (
		<div
			className='flex items-center justify-center w-full gap-0 min-h-[288px] font-[Mitr]!'
		>
				<span className='text-[240px] leading-[120%] font-normal text-primary-400-normal font-[Mitr]!'>
					{a}
				</span>
			<img
				src={Character}
				alt={b}
				className='w-[242px] h-[207px] object-contain shrink-0 -mx-5 z-10'
			/>
			<span className='text-[240px] leading-[120%] font-normal text-primary-400-normal font-[Mitr]!'>
				{c}
			</span>
		</div>
	)
}

const ERROR_CONFIG: Record<
	ErrorCode,
	{
		description: string
	}
> = {
	'404': {
		description: '요청하신 페이지를 찾을 수 없습니다.',
	},
	'408': {
		description: '사용자의 네트워크 연결이 불안정합니다.',
	},
	'500': {
		description: '서버 오류가 발생했습니다.',
	},
	'503': {
		description: '서버 연결이 원할하지 않습니다. 잠시 후 다시 시도해주세요.',
	},
}

const isValidErrorCode = (code: string | undefined): code is ErrorCode =>
	code != null && ERROR_CODES.includes(code as ErrorCode)

const ErrorPage = () => {
	const { code } = useParams<{ code: string }>()
	const navigate = useNavigate()

	const errorCode: ErrorCode = isValidErrorCode(code) ? code : '404'
	const config = ERROR_CONFIG[errorCode]

	return (
		<div className='min-h-screen min-w-screen bg-neutral-000 flex flex-col items-center justify-center px-4 py-12'>
			<ErrorSection code={errorCode} />

			<h1
				className='text-[52px] leading-[120%] font-normal text-primary-400-normal text-center mt-8 mb-2.5'
				style={{ fontFamily: "'Mitr', sans-serif" }}
			>
				Error
			</h1>
			<p className='font-medium text-[28px] leading-[120%] text-neutral-800 text-center '>
				{config.description}
			</p>

			<div className='flex flex-col sm:flex-row gap-2.5 justify-center items-center mt-12 mb-4'>
				<Button
					className='body-1 font-semibold text-neutral-900 bg-neutral-000 w-[150px] border-[1.5px] border-neutral-200 px-2.5 py-3 hover:bg-neutral-100'
					onClick={() => navigate(-1)}
				>
					이전으로
				</Button>
				<Button
					className='body-1 font-semibold text-neutral-900 bg-neutral-000 w-[150px] border-[1.5px] border-neutral-200 px-2.5 py-3 hover:bg-neutral-100'
					onClick={() => navigate('/')}
				>
					홈으로
				</Button>
			</div>
		</div>
	)
}

export default ErrorPage
