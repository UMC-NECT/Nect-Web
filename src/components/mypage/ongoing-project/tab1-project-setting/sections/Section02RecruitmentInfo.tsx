import { useState, useEffect, useRef } from 'react'
import Button from '@/components/common/Button'
import BulletTextArea from '@/components/common/BulletTextArea'
import RoleSelectModal from '../RoleSelectModal'
import RoleTagChip from '@/components/mission-modal/RoleTagChip'
import { useMypageProjectRecruitmentsQuery } from '@/hooks/mypage/useMypageApi'
import type { UseFormSetValue } from 'react-hook-form'
import type { ProjectSettingsType } from '@/utils/schemas/projectSchema'
import type { TeamMembersByRole } from '@/types/mypage/ongoindProject'

export type RecruitmentLocalItem = {
	recruitmentId: number
	roleField: string
	capacity: number
	requirements: string
}

type RecruitmentApiItem = {
	recruitmentId?: number
	roleField?: string
	capacity?: number
	requirements?: string[] | string
}

const isRecruitmentApiItem = (value: unknown): value is RecruitmentApiItem => {
	if (!value || typeof value !== 'object') return false
	const candidate = value as Record<string, unknown>
	return 'roleField' in candidate || 'requirements' in candidate
}

const flattenRecruitmentArray = (value: unknown): RecruitmentApiItem[] => {
	if (!Array.isArray(value)) return []
	return value.reduce<RecruitmentApiItem[]>((acc, current) => {
		if (Array.isArray(current)) {
			acc.push(...flattenRecruitmentArray(current))
		} else if (isRecruitmentApiItem(current)) {
			acc.push(current)
		}
		return acc
	}, [])
}

const extractRecruitments = (payload: unknown): RecruitmentApiItem[] => {
	if (!payload) return []
	if (Array.isArray(payload)) {
		return flattenRecruitmentArray(payload)
	}
	if (typeof payload === 'object') {
		const body = (payload as { body?: unknown }).body
		if (!body) return []
		return extractRecruitments(body)
	}
	return []
}

const getPartByRoleField = (roleField: string, teamMembersByRole: TeamMembersByRole[]) =>
	teamMembersByRole.find(p => p.roleField === roleField || p.role === roleField)

interface ISection02RecruitmentInfo {
	projectId: string
	onDataChange?: (data: RecruitmentLocalItem[]) => void
	setValue: UseFormSetValue<ProjectSettingsType>
	availableRoles?: string[]
	teamMembersByRole?: TeamMembersByRole[]
}

const Section02RecruitmentInfo = ({ projectId, onDataChange, setValue, availableRoles, teamMembersByRole = [] }: ISection02RecruitmentInfo) => {
	const [openModalIndex, setOpenModalIndex] = useState<number | null>(null)
	const [localData, setLocalData] = useState<RecruitmentLocalItem[]>([])
	const tempIdCounter = useRef(-1)
	const isInitialLoadRef = useRef(true)

	// API - 기존 모집정보 조회
	const { data: recruitmentsData } = useMypageProjectRecruitmentsQuery(projectId)

	// API 데이터를 로컬 상태로 동기화
	useEffect(() => {
		if (!recruitmentsData) return

		queueMicrotask(() => {
			const recruitments = extractRecruitments(recruitmentsData)
			if (recruitments.length === 0) {
				// 기본 빈 입력 필드 1개 제공
				setLocalData([{
					recruitmentId: tempIdCounter.current--,
					roleField: '',
					capacity: 1,
					requirements: '',
				}])
				return
			}

			setLocalData(
				recruitments.map(item => ({
					recruitmentId: typeof item.recruitmentId === 'number' ? item.recruitmentId : tempIdCounter.current--,
					roleField: item.roleField ?? '',
					capacity: item.capacity ?? 1,
					requirements: Array.isArray(item.requirements) ? item.requirements.join('\n') : (item.requirements ?? ''),
				}))
			)
		})
	}, [recruitmentsData])

	// 로컬 데이터 변경 시 부모에 알림 + RFH과 동기화
	useEffect(() => {
		queueMicrotask(() => {
			onDataChange?.(localData)
			// 초기 로드 시에는 shouldDirty: false, 유저 변경 시에는 shouldDirty: true
			setValue('recruitmentInfo', localData, {
				shouldDirty: !isInitialLoadRef.current,
				shouldValidate: true,
			})
		})
	}, [localData, onDataChange, setValue])

	// 모집 팀원 추가 (로컬 UI만 추가, 저장 시 API 호출)
	const handleAddItem = () => {
		isInitialLoadRef.current = false
		setLocalData(prev => [
			...prev,
			{
				recruitmentId: tempIdCounter.current--,
				roleField: '',
				capacity: 1,
				requirements: '',
			},
		])
	}

	// 역할 변경 (로컬만 변경 - 저장 버튼에서 PUT)
	const handleRoleChange = (index: number, role: string) => {
		const item = localData[index]
		if (!item) return
		isInitialLoadRef.current = false
		setLocalData(prev => prev.map((d, i) => (i === index ? { ...d, roleField: role } : d)))
	}

	// 설명(요구사항) 변경 (로컬만 - 저장 버튼에서 PUT)
	const handleRequirementsChange = (index: number, value: string) => {
		isInitialLoadRef.current = false
		setLocalData(prev => prev.map((d, i) => (i === index ? { ...d, requirements: value } : d)))
	}

	return (
		<div className='flex flex-col pl-5'>
			{/* 타이틀 */}
			<div className='flex items-center justify-between'>
				<h3 className='title-2 font-bold text-neutral-900'>
					모집 정보 및 필수 스택 <span className='text-danger-700'>*</span>
				</h3>

				<Button color='text' size='sm' className='group flex gap-1.25' onClick={handleAddItem}>
					<span className='text-neutral-400 group-hover:text-neutral-500 duration-200'>+</span>
					<span className='text-neutral-500 group-hover:text-neutral-600 duration-200'>모집 팀원 추가</span>
				</Button>
			</div>

			{/* 모집 팀원 목록 */}
			{localData.map((item, index) => (
				<div key={item.recruitmentId} className='flex flex-col items-start gap-1.5'>
					{/* 선택 직무 */}
					<div className='relative shrink-0 mt-5 w-25'>
						<RoleTagChip
							roleId={getPartByRoleField(item.roleField, teamMembersByRole)?.partId ?? 1}
							roleName={item.roleField || '직무 선택'}
							roleField={item.roleField}
							state='default'
							count={item.roleField ? (getPartByRoleField(item.roleField, teamMembersByRole)?.targetCount ?? item.capacity) : undefined}
							onClick={() => setOpenModalIndex(index)}
							className='cursor-pointer hover:opacity-80 transition-opacity'
						/>
						<RoleSelectModal
							isOpen={openModalIndex === index}
							onClose={() => setOpenModalIndex(null)}
							onSelect={role => {
								handleRoleChange(index, role)
								setOpenModalIndex(null)
							}}
							availableRoles={availableRoles}
						/>
					</div>

					{/* 역할 필드 */}
					<BulletTextArea
						value={item.requirements}
						onChange={value => handleRequirementsChange(index, value)}
						hasSectionTitle={false}
						placeholder='모집 팀원의 필수 스택과 팀에서 맡을 역할을 적어주세요.'
						minHeight='min-h-24'
					/>
				</div>
			))}
		</div>
	)
}

export default Section02RecruitmentInfo
