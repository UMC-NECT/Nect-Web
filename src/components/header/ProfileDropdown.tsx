import { useRef, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { useClickOutside } from '@/hooks/useClickOutside'
import MyIcon from '@/assets/icons/header/my.svg?react'
import ProjectIcon from '@/assets/icons/header/project.svg?react'
import MatchingIcon from '@/assets/icons/header/matching.svg?react'
import { useGetProfileQuery, useLogoutMutation } from '@/hooks/auth/useUsersApi'
import { useOnboardingEnums } from '@/hooks/auth/useOnboardingEnums'
import DefaultProfileImage from '@/assets/Default_Profile.svg'
import type { EnumItem } from '@/types/api/enums'

/** role_field(value)에 해당하는 enum label 반환. roles 우선, 없으면 roleFields에서 검색 */
const getRoleLabel = (roleValue: string, roles: EnumItem[], roleFields: Record<string, EnumItem[]>): string => {
	if (!roleValue) return ''
	const inRoles = roles.find(r => r.value === roleValue)?.label
	if (inRoles) return inRoles
	for (const fields of Object.values(roleFields)) {
		const found = fields.find(f => f.value === roleValue)?.label
		if (found) return found
	}
	return roleValue
}

interface ProfileDropdownProps {
	isOpen: boolean
	onClose: () => void
}

const ProfileDropdown = ({ isOpen, onClose }: ProfileDropdownProps) => {
	const navigate = useNavigate()
	const dropdownRef = useRef<HTMLDivElement>(null)
	const { mutate: logout } = useLogoutMutation()
	useClickOutside(dropdownRef, () => onClose(), isOpen)
	const { data: profileData } = useGetProfileQuery()
	const { roles, roleFields } = useOnboardingEnums()
	const roleLabel = useMemo(
		() => getRoleLabel(profileData?.body?.role ?? '', roles, roleFields),
		[profileData?.body?.role, roles, roleFields]
	)

	const handleMenuClick = (path: string) => {
		navigate(path)
		onClose()
	}

	const handleLogout = () => {
		logout()
		onClose()
	}

	if (!isOpen) return null

	return (
		<div
			ref={dropdownRef}
			className='w-[344px] h-[260px] absolute top-full -right-5 mt-2 px-2.5 pt-[26px] pb-3.5 bg-white rounded-md shadow-drop-neutral-1 inline-flex flex-col justify-start items-center gap-2.5 z-50'
		>
			<div className='flex flex-col justify-start items-center gap-4'>
				<div className='self-stretch flex flex-col justify-start items-center gap-4'>
					<div className='w-80 flex flex-col justify-start items-center gap-5'>
						{/* 프로필 정보 영역 */}
						<div className='self-stretch px-2 inline-flex justify-start items-center gap-5'>
							<img
								className='w-[68px] h-[68px] rounded-[28px]'
								src={profileData?.body?.imageUrl || DefaultProfileImage}
								alt='프로필'
							/>
							<div className='w-60 inline-flex flex-col justify-start items-start gap-1'>
								<div className='w-fit max-w-full h-6 inline-flex justify-start items-center gap-2'>
									<p className='justify-start text-neutral-900 title-3 font-semibold'>
										{profileData?.body?.name}
									</p>
									<div className='w-0.5 h-4 relative bg-neutral-300 rounded-md' />
									<div className='justify-start text-primary-500-normal title-3 font-regular leading-6'>
										{roleLabel}
									</div>
								</div>
								<div className='justify-start text-neutral-500 body-2 font-regular leading-5'>
									{profileData?.body?.email}
								</div>
							</div>
						</div>

						{/* 메뉴 아이템들 */}
						<div className='self-stretch inline-flex justify-center items-center gap-10'>
							{/* 마이 페이지 */}
							<button
								onClick={() => handleMenuClick('/mypage')}
								className='h-16 pt-1.5 pb-1 inline-flex flex-col justify-center items-center gap-0.5 text-neutral-700 hover:text-neutral-500'
							>
								<div className='w-[30px] h-[30px] flex flex-col justify-center items-center gap-[1.25px]'>
									<MyIcon className='w-[30px] h-[30px]' />
								</div>
								<div className='w-16 text-center justify-center body-2 font-medium leading-5 transition-colors'>
									마이 페이지
								</div>
							</button>

							{/* 내 프로젝트 */}
							<button
								onClick={() => handleMenuClick('/mypage/ongoing')}
								className='h-16 pt-1.5 pb-1 inline-flex flex-col justify-center items-center gap-0.5 text-neutral-700 hover:text-neutral-500'
							>
								<div className='w-[30px] h-[30px] relative overflow-hidden'>
									<ProjectIcon className='w-[30px] h-[30px]' />
								</div>
								<div className='w-16 text-center justify-center body-2 font-medium leading-5 transition-colors'>
									내 프로젝트
								</div>
							</button>

							{/* 매칭 현황 */}
							<button
								onClick={() => handleMenuClick('/mypage/matching')}
								className='h-16 pt-1.5 pb-1 inline-flex flex-col justify-center items-center gap-0.5 text-neutral-700 hover:text-neutral-500'
							>
								<div className='w-[30px] h-[30px] relative overflow-hidden'>
									<MatchingIcon className='w-[30px] h-[30px]' />
								</div>
								<div className='w-16 text-center justify-center body-2 font-medium leading-5 transition-colors'>
									매칭 현황
								</div>
							</button>
						</div>
					</div>

					{/* 구분선 */}
					<div className='w-80 h-0 border-t border-neutral-200' />
				</div>

				{/* 로그아웃 버튼 */}
				<button
					onClick={handleLogout}
					className='px-1.5 py-1 inline-flex justify-center items-center gap-2.5'
				>
					<div className='text-center justify-center text-neutral-700 body-1 font-medium leading-6 transition-colors hover:text-neutral-900'>
						로그아웃
					</div>
				</button>
			</div>
		</div>
	)
}

export default ProfileDropdown
