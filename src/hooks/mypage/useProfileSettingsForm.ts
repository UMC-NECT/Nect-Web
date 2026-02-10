import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileFormSchema, type ProfileFormDataType } from '@/utils/schemas/profileSchema'
import { mapProfileToFormData } from '@/utils/mapProfileToFormData'
import type { ResponseMypageProfileDto } from '@/types/api/mypage'

type ProfileBody = NonNullable<ResponseMypageProfileDto['body']>

export const useProfileSettingsForm = (profile?: ProfileBody) => {
	const methods = useForm<ProfileFormDataType>({
		resolver: zodResolver(profileFormSchema),
		mode: 'onChange',
		shouldFocusError: false,
		values: profile ? mapProfileToFormData(profile) : undefined,
		defaultValues: {
			userStatus: '',
			interestJob: '',
			interestOccupation: '',
			userCareer: '',
			introduction: '',
			coreCompetency: '',
			interestFields: [],
			skills: [],
			careers: [
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
			portfolios: [{ id: 1, title: '', link: '', isCompleted: false }],
			projectHistory: [],
		},
	})

	return methods
}
