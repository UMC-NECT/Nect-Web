import { create } from 'zustand'

export interface RadarDataItem {
	subject: string
	value: number
}

interface CollaboState {
	type: string
	role: string
	tags: string[]
	radarData: RadarDataItem[]
	setType: (type: string) => void
	setRole: (role: string) => void
	setTags: (tags: string[]) => void
	setRadarData: (data: RadarDataItem[]) => void
}

const initialRadarData: RadarDataItem[] = [
	{ subject: '계획형', value: 65 },
	{ subject: '논리형', value: 80 },
	{ subject: '서포터형', value: 90 },
	{ subject: '실행형', value: 55 },
	{ subject: '공감형', value: 75 },
	{ subject: '리더형', value: 60 },
]

export const useCollaboStore = create<CollaboState>(set => ({
	type: '대인형 서포터',
	role: 'UX.UI 디자이너',
	tags: ['포트폴리오 집중', '신중한 설계자', '비주얼 전문가'],
	radarData: initialRadarData,
	setType: (type: string) => set({ type }),
	setRole: (role: string) => set({ role }),
	setTags: (tags: string[]) => set({ tags }),
	setRadarData: (data: RadarDataItem[]) => set({ radarData: data }),
}))

export interface Skill {
	skillName: string
	skillList: string[]
}

interface SkillState {
	skills: Skill[]
	setSkills: (skills: Skill[]) => void
}

const initialSkills: Skill[] = [
	{ skillName: '디자인', skillList: ['Photoshop', 'Illustrator', 'InDesign'] },
	{ skillName: '기획', skillList: ['Notion', 'UX Resarch'] },
]

export const useSkillStore = create<SkillState>(set => ({
	skills: initialSkills,
	setSkills: (skills: Skill[]) => set({ skills }),
}))

export interface RoleRecommend {
	role: string
	title: string
	description: string
}

export interface RoleRecommendState {
	roleRecommend: RoleRecommend[]
	setRoleRecommend: (roleRecommend: RoleRecommend[]) => void
}

const initialRoleRecommend: RoleRecommend[] = [
	{
		role: '리더',
		title: '다음과 같은 성격의 팀원과 함께하세요!',
		description: `아이디어를 빠르게 구현하는 [빠른 실행형 팀원]과의 최고의 시너지를 낼 수 있습니다. \n 이방토님의 깊이 있는 고민이 정체되지 않고 실제 결과물로  빠르게 이어지도록 보완해줄 것입니다.`,
	},
	{
		role: '팀원',
		title: '현재 모집중인 프로젝트를 추천할게요!',
		description: `이방토님이 관심 있는 [IT · 웹/모바일 서비스] 산업군에서 [포트폴리오] 쌓기에 최적화된 프로젝트를 선별했습니다. \n 실제 서비스 출시 경험을 가진 팀원들과 함께하며 실무 역량을 빠르게 끌어올릴 수 있는 기회입니다!`,
	},
]

export const useRoleRecommendStore = create<RoleRecommendState>(set => ({
	roleRecommend: initialRoleRecommend,
	setRoleRecommend: (roleRecommend: RoleRecommend[]) => set({ roleRecommend }),
}))

export interface GrowGuide {
	tipText: string
	title: string
	description: string
}

export interface GrowGuideState {
	growGuide: GrowGuide[]
	setGrowGuide: (growGuide: GrowGuide[]) => void
}

const initialGrowGuide: GrowGuide[] = [
	{
		tipText: '앞으로 이런 활동을 하면 좋아요 !',
		title: `포트폴리오 제작을 위한 ‘실무 프로세스 경험'`,
		description: `성공적인 [포트폴리오 제작]을 위해 이방토님에게 필요한 건 ‘실무 프로세스의 기록’입니다.`,
	},
	{
		tipText: '확장 가능한 스킬 추천',
		title: `포트폴리오 제작을 위한 ‘실무 프로세스 경험'`,
		description: `이미 figma에 능숙하시네요!  [출판 / 콘텐츠]에 관심이 있다면, 인쇄 프로세스에 대한 이해도를 높여 \n‘온오프라인 통합 브랜드 경험’ 역량을 쌓아보시는건 어떨까요?`,
	},
]

export const useGrowGuideStore = create<GrowGuideState>(set => ({
	growGuide: initialGrowGuide,
	setGrowGuide: (growGuide: GrowGuide[]) => set({ growGuide }),
}))