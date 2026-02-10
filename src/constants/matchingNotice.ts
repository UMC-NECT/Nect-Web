export interface NoticeItem {
	/** 규칙 번호 */
	number: number
	/** 규칙 메인 텍스트 */
	text: string
	/** 규칙 하위 설명 텍스트 (선택, 여러 줄은 \n으로 구분) */
	subText?: string
}

/** 받은 요청 유의사항 */
export const RECEIVED_REQUEST_NOTICES: NoticeItem[] = [
	{
		number: 1,
		text: '대기 만료 시, 매칭이 자동 거절 처리',
	},
	{
		number: 2,
		text: '24시간 동안의 매칭 취소 / 거절 / 수락은 번복 불가',
	},
	{
		number: 3,
		text: '리더가 직접 보내는 요청은 파트당 최대 3명까지 가능 (24시간 동안)',
		subText: '리더는 24시간동안 한 프로젝트의 파트당 최대 3명에게 **매칭 요청을 직접 보낼 수 있습니다.**\n이때, 유저가 보내오는 프로젝트 매칭 요청은 포함되지 않습니다.',
	},
]

/** 보낸 요청 유의사항 */
export const SENT_REQUEST_NOTICES: NoticeItem[] = [
	{
		number: 1,
		text: '대기 만료 시, 매칭이 자동 거절 처리',
	},
	{
		number: 2,
		text: '24시간 동안의 매칭 취소 / 거절 / 수락은 번복 불가',
	},
	{
		number: 3,
		text: '매칭 신청 후 대기 중인 24시간동안 다른 프로젝트에 신청할 수 없습니다.',
		subText: '이때, 타 유저로 부터 받은 요청은 포함되지 않습니다.',
	},
]
