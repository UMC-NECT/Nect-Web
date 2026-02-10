/**
 * 스킬 카테고리 변환 (영어->한글)
 * @param category - 영어 카테고리명
 * @returns 한글 카테고리명
 */
export const translateSkillCategory = (category: string): string => {
	const categoryMap: Record<string, string> = {
		DEVELOPMENT: '개발',
		DESIGN: '디자인',
		PLANNING: '기획',
		MARKETING: '마케팅',
		OTHER: '기타',
	}

	return categoryMap[category.toUpperCase()] || category
}
