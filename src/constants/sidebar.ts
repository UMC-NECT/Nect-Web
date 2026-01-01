import NotificationIcon from '@/assets/icons/common/notification.svg?react'
import MessageIcon from '@/assets/icons/common/message.svg?react'
import TeamBoardIcon from '@/assets/icons/sidebar/team-board.svg?react'
import WeekMissionIcon from '@/assets/icons/sidebar/week-mission.svg?react'
import WorkStatusIcon from '@/assets/icons/sidebar/work-status.svg?react'

export type TopMenuId = 'notification' | 'message'
export type BottomMenuId = 'team-board' | 'week-mission' | 'work-status'
export type MenuId = TopMenuId | BottomMenuId

export interface MenuItem {
	id: MenuId
	icon: React.ComponentType<{ className?: string }>
	label: string
}

export const TOP_MENU_ITEMS: MenuItem[] = [
	{ id: 'notification', icon: NotificationIcon, label: '알림' },
	{ id: 'message', icon: MessageIcon, label: '메세지' },
]

export const BOTTOM_MENU_ITEMS: MenuItem[] = [
	{ id: 'team-board', icon: TeamBoardIcon, label: '팀 보드' },
	{ id: 'week-mission', icon: WeekMissionIcon, label: '위크 미션' },
	{ id: 'work-status', icon: WorkStatusIcon, label: '작업 현황' },
]
