export const USER_STATUS = ['재학 중', '구직 중', '재직 중'] as const
export type UserStatusType = (typeof USER_STATUS)[number]
