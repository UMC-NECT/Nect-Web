import { create } from 'zustand'
import ProfileSamplePath from '@/assets/icons/mypage/profile-sample.svg'
import type { UserStatusType } from '@/constants/userStatus'

interface UserProfile {
	userName: string
	userRole: string
	userEmail: string
	userStatus: string
	profileImage: string
	isPro: boolean
}

interface UserStore extends UserProfile {
	setProfileImage: (image: string) => void
	setUserProfile: (profile: Partial<UserProfile>) => void
	setUserStatus: (status: UserStatusType) => void
}

export const useUserStore = create<UserStore>(set => ({
	userName: '김넥터',
	userRole: '디자이너',
	userEmail: 'Nect2u@naver.com',
	userStatus: '재학 중',
	profileImage: ProfileSamplePath,
	isPro: true,

	setProfileImage: (image: string) => set({ profileImage: image }),
	setUserProfile: (profile: Partial<UserProfile>) => set(state => ({ ...state, ...profile })),
	setUserStatus: (status: UserStatusType) => set({ userStatus: status }),
}))
