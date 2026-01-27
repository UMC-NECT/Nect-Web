export const MYPAGE_MENU = [
	{
		id: 'info-management',
		title: '나의 정보 관리',
		items: [
			{ id: 'profile-settings', label: '내 프로필 설정', path: '/mypage/profile' },
			{ id: 'idea-analysis', label: '나의 아이디어 분석', path: '/mypage/idea-analysis' },
			{ id: 'profile-analysis', label: '나의 프로필 분석', path: '/mypage/profile-analysis' },
			{ id: 'portfolio', label: '나의 포트폴리오', path: '/mypage/portfolio' },
			{ id: 'account', label: '계정 및 이용권', path: '/mypage/account' },
		],
	},
	{
		id: 'my-project',
		title: '마이 프로젝트',
		items: [
			{ id: 'ongoing-projects', label: '진행 중인 프로젝트', path: '/mypage/ongoing' },
			{ id: 'all-projects', label: '모든 프로젝트', path: '/mypage/projects' },
		],
	},
	{
		id: 'my-matching',
		title: '마이 매칭',
		items: [{ id: 'matching-status', label: '매칭 현황', path: '/mypage/matching' }],
	},
	{
		id: 'my-scrap',
		title: '마이 스크랩',
		items: [
			{ id: 'scrap-projects', label: '관심 프로젝트', path: '/mypage/scrap/projects' },
			{ id: 'scrap-profiles', label: '관심 프로필', path: '/mypage/scrap/profiles' },
		],
	},
] as const

export type MyPageMenuId = (typeof MYPAGE_MENU)[number]['id']
export type MyPageMenuItemId = (typeof MYPAGE_MENU)[number]['items'][number]['id']

export const INTEREST_FIELDS = [
	'IT · 웹/모바일 서비스',
	'출판 · 콘텐츠 제작',
	'예술 · 전시 · 미디어아트',
	'게임 · 엔터테인먼트',
	'헬스케어 · 피트니스',
	'네트워킹 · 커뮤니티',
	'교육 · 에듀테크',
	'금융 · 핀테크',
	'기타',
]

export const SKILLS_DATA = {
	디자인: ['Figma', 'Photoshop', 'Illustrator', 'Premiere Pro', 'After Effect', 'Procreate'],
	기획: ['Notion', 'UX Research'],
	기타: ['Claude', 'Consecutive Interpretation'],
}
