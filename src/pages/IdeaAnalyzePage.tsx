import logo from '@/assets/icons/common/nect-logo.svg'
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router'
import type { IdeaFormData, IdeaErrors } from '@/types/ideaAnalyze'
import type { RequestPostAnalysisDto } from '@/types/api/analysis'
import FormInput from '@/components/idea-analyze/FormInput'
import FeaturesInput from '@/components/idea-analyze/FeaturesInput'
import NumberedSection from '@/components/common/NumberedSection'
import AnalysisScreen from '@/components/splash/AnalysisScreen'
import { useGetProfileQuery } from '@/hooks/auth/useUsersApi'
import { usePostAnalysisMutation } from '@/hooks/analysis/useAnalysisApi'

function toRequestPostAnalysisDto(form: IdeaFormData): RequestPostAnalysisDto {
	return {
		projectName: form.projectName.trim(),
		projectSummary: form.oneLine.trim(),
		targetUsers: form.targetUser.trim(),
		problemStatement: form.problem.trim(),
		coreFeature1: form.features[0]?.trim() ?? '',
		coreFeature2: form.features[1]?.trim() ?? '',
		coreFeature3: form.features[2]?.trim() ?? '',
		platform: form.platform.trim(),
		referenceServices: form.competitor.trim(),
		technicalChallenges: form.challenge.trim(),
		targetCompletionDate: form.deadline.trim(),
	}
}

const IdeaAnalyzePage = () => {
	const navigate = useNavigate()
	const { data: profileData } = useGetProfileQuery()
	const { mutateAsync: postAnalyze, isPending: isPostAnalyzePending } = usePostAnalysisMutation()

	const [formData, setFormData] = useState<IdeaFormData>({
		projectName: '',
		oneLine: '',
		targetUser: '',
		problem: '',
		features: ['', '', ''],
		platform: '',
		competitor: '',
		challenge: '',
		deadline: '',
	})

	const [errors, setErrors] = useState<IdeaErrors>({
		projectName: false,
		oneLine: false,
		targetUser: false,
		problem: false,
		features: false,
		platform: false,
		competitor: false,
		challenge: false,
		deadline: false,
	})

	const isFormComplete = useMemo(() => {
		return (
			formData.projectName.trim() !== '' &&
			formData.oneLine.trim() !== '' &&
			formData.targetUser.trim() !== '' &&
			formData.problem.trim() !== '' &&
			formData.features.every(f => f.trim() !== '') &&
			formData.platform.trim() !== '' &&
			formData.competitor.trim() !== '' &&
			formData.challenge.trim() !== '' &&
			formData.deadline.trim() !== ''
		)
	}, [formData])

	const handleFeatureChange = (index: number, value: string) => {
		const newFeatures = [...formData.features]
		newFeatures[index] = value
		setFormData({
			...formData,
			features: newFeatures,
		})
	}

	const handleSubmit = async () => {
		const newErrors: IdeaErrors = {
			projectName: !formData.projectName.trim(),
			oneLine: !formData.oneLine.trim(),
			targetUser: !formData.targetUser.trim(),
			problem: !formData.problem.trim(),
			features: !formData.features.every(f => f.trim() !== ''),
			platform: !formData.platform.trim(),
			competitor: !formData.competitor.trim(),
			challenge: !formData.challenge.trim(),
			deadline: !formData.deadline.trim(),
		}

		setErrors(newErrors)

		const hasErrors = Object.values(newErrors).some(error => error === true)
		if (hasErrors) return
		await postAnalyze(toRequestPostAnalysisDto(formData))
	}

	return (
		<>
			{isPostAnalyzePending ? (
				<AnalysisScreen name={profileData?.body?.name || '넥터'} section='아이디어' />
			) : (
				<div className='flex flex-col items-center justify-start min-h-screen pt-[128px]'>
					<div className='flex flex-col items-center px-4 mb-[64px] gap-[26px]'>
						<img src={logo} alt='NECT Logo' className='w-[226px] h-[40px]' />
						<h1 className='heading-1 font-bold text-primary-800-dark text-center'>프로젝트 아이디어 분석 리포트</h1>
					</div>

					<div className='relative bg-bg-gray rounded-100 z-10 w-screen -ml-[calc((100vw-100%)/2)] -mr-[calc((100vw-100%)/2)] min-h-screen shadow-inner-neutral-1'>
						<div className='my-20 flex flex-col justify-center items-center'>
							<h2 className='title-3 font-semibold text-primary-600-normal'>NECT Analysis Report</h2>
							<p className='font-bold text-[28px] mt-4'>아이디어 입력을 시작합니다!</p>
						</div>

						<div className='flex flex-col gap-[88px] mt-[52px] w-[940px] pr-[26px] mx-auto'>
							{/* 01 프로젝트 기본 정보 */}
							<NumberedSection number='01' title='프로젝트 기본 정보'>
								<FormInput
									label='프로젝트 이름'
									placeholder='생각하고 있는 프로젝트 명을 30자 이내로 입력해주세요'
									value={formData.projectName}
									onChange={value => setFormData({ ...formData, projectName: value })}
									error={errors.projectName}
									maxLength={30}
								/>
								<FormInput
									label='한줄 정의'
									placeholder='이 서비스가 무엇인지 한 문장으로 표현해주세요'
									value={formData.oneLine}
									onChange={value => setFormData({ ...formData, oneLine: value })}
									error={errors.oneLine}
									maxLength={1000}
								/>
							</NumberedSection>

							{/* 02 아이디어 구체화 */}
							<NumberedSection number='02' title='아이디어 구체화'>
								<FormInput
									label='누가 이 서비스를 사용하나요?'
									placeholder='이 아이디어의 주요 사용자층을 작성해주세요'
									value={formData.targetUser}
									onChange={value => setFormData({ ...formData, targetUser: value })}
									error={errors.targetUser}
									maxLength={1000}
								/>
								<FormInput
									label='이 서비스는 어떤 문제를 해결하나요?'
									placeholder='자유롭게 작성해주세요'
									value={formData.problem}
									onChange={value => setFormData({ ...formData, problem: value })}
									error={errors.problem}
									maxLength={1000}
								/>
								<FeaturesInput
									features={formData.features}
									onChange={handleFeatureChange}
									error={errors.features}
								/>
								<FormInput
									label='어떤 플랫폼 서비스 위주인가요?'
									placeholder='웹(iOS/안드로이드), 웹(데스크톱/태블릿), 기기 인터페이스(키오스크/실물교구등), 전화통, 오프라인 등을 구체적으로 작성해주세요'
									value={formData.platform}
									onChange={value => setFormData({ ...formData, platform: value })}
									error={errors.platform}
									maxLength={1000}
								/>
								<FormInput
									label="참고 할 만한 기존 서비스나 경쟁사가 있나요? (없다면, '없음' 입력)"
									placeholder='자유롭게 작성해주세요'
									value={formData.competitor}
									onChange={value => setFormData({ ...formData, competitor: value })}
									error={errors.competitor}
									maxLength={1000}
								/>
								<FormInput
									label='구현 시 가장 걱정되거나 해결이 필요한 기술적 및 외부적 난관은 무엇인가요?'
									placeholder='자유롭게 작성해주세요'
									value={formData.challenge}
									onChange={value => setFormData({ ...formData, challenge: value })}
									error={errors.challenge}
									maxLength={1000}
								/>
								<FormInput
									label='생각하고 있는 프로젝트 최종 목표일이 있나요?'
									placeholder='YYYY-MM-DD (ex.2026-04-30)'
									value={formData.deadline}
									onChange={value => setFormData({ ...formData, deadline: value })}
									error={errors.deadline}
									maxLength={1000}
								/>
							</NumberedSection>

							{/* AI 아이디어 분석하기 버튼 */}
							<div className='flex flex-col items-center justify-center mt-6 mb-24'>
								<button
									onClick={handleSubmit}
									disabled={!isFormComplete || isPostAnalyzePending}
									className={`w-[320px] h-[60px] text-white font-semibold text-[16px] px-12 py-4 rounded-2xl transition-colors ${
										isFormComplete && !isPostAnalyzePending
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
						<button
							onClick={() => navigate('/')}
							className='title-3 font-medium text-neutral-500 underline underline-offset-4 m-[44px] cursor-pointer'
						>
							홈으로 이동
						</button>
					</div>
				</div>
			)}
		</>
	)
}

export default IdeaAnalyzePage
