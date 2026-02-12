import type { ResponseMypageProfileDto } from '@/types/api/mypage'
import type { ProfileFormDataType } from '@/utils/schemas/profileSchema'
import { getUserStatusValue } from '@/constants/userStatus'

type ProfileBody = NonNullable<ResponseMypageProfileDto['body']>

export const mapProfileToFormData = (profile: ProfileBody): ProfileFormDataType => ({
	userStatus: getUserStatusValue(profile.userStatus ?? ''),
	interestJob: profile.interestedJob ?? '',
	interestOccupation: profile.interestedField ?? '',
	userCareer: profile.careerDuration ?? '',
	introduction: profile.bio ?? '',
	coreCompetency: profile.coreCompetencies ?? '',
	interestFields: profile.interestedField ? [profile.interestedField] : [],
	skills: profile.skills ?? [],
	careers:
		profile.careers?.length > 0
			? profile.careers.map((career, index) => ({
					id: index + 1,
					projectName: career.projectName ?? '',
					startDate: career.startDate ?? '',
					endDate: career.endDate ?? '',
					isInProgress: career.isOngoing ?? false,
					industry: career.industryField ?? '',
					role: career.role ?? '',
					achievements:
						career.achievements?.map((ach, achIndex) => ({
							id: achIndex + 1,
							title: ach.title ?? '',
							content: ach.content ?? '',
						})) ?? [],
				}))
			: [
					{
						id: 1,
						projectName: '',
						startDate: '',
						endDate: '',
						isInProgress: false,
						industry: '',
						role: '',
						achievements: [{ id: 1, title: '', content: '' }],
					},
				],
	portfolios:
		profile.portfolios?.length > 0
			? profile.portfolios.map((portfolio, index) => ({
					id: index + 1,
					title: portfolio.title ?? '',
					link: portfolio.link ?? portfolio.fileUrl ?? '',
					file: portfolio.fileUrl ? { name: portfolio.title ?? '', url: portfolio.fileUrl } : undefined,
					isCompleted: !!(portfolio.title && (portfolio.link || portfolio.fileUrl)),
				}))
			: [{ id: 1, title: '', link: '', isCompleted: false }],
	projectHistory:
		profile.projectHistories?.length > 0
			? profile.projectHistories.map(history => ({
					title: history.projectName ?? '',
					description: history.projectDescription ?? '',
					date: `${history.startYearMonth ?? ''}~${history.endYearMonth ?? ''}`,
					imageUrl: history.projectImage ?? null,
					imageFileName: null,
				}))
			: [],
})
