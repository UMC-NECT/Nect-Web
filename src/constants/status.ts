export const STATUS = {
    planning: {
        text: '진행 전',
        dotColor: 'bg-status-complete', // 파란색
        bgColor: 'bg-bg-blue',
    },
    in_progress: {
        text: '진행 중',
        dotColor: 'bg-status-progress', // 노란색
        bgColor: 'bg-bg-yellow',
    },
    completed: {
        text: '완료',
        dotColor: 'bg-status-success', // 초록색
        bgColor: 'bg-bg-green',
    },
    backlog: {
        text: '백로그',
        dotColor: 'bg-status-info-cool-gray-deep', // 회색
        bgColor: 'bg-bg-gray',
    },
}