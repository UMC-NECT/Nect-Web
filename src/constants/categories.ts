export const CATEGORY_FIELDS = [
    { name: '브랜딩' },
    { name: '기획' },
    { name: 'UX/UI' },
    { name: '영상' },
    { name: '그래픽' },
    { name: '프론트' },
    { name: '스프링' },
    { name: '백엔드' },
] as const;

export const CREATOR_TYPES = [
    '디자이너',
    '기획자',
    '편집자',
    '개발자',
    '마케터',
] as const;

export type CategoryField = typeof CATEGORY_FIELDS[number]['name'];
export type CreatorType = typeof CREATOR_TYPES[number];