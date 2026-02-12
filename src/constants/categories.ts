export const CATEGORY_FIELDS = [
    { name: '기획/홍보' },
    { name: '브랜딩' },
    { name: 'UX/UI' },
    { name: '제품/공간' },
    { name: '영상/모션' },
    { name: '아트/그래픽' },
    { name: '프론트' },
    { name: '백엔드' },
    { name: '엔지니어' },
    { name: '데이터분석' },
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