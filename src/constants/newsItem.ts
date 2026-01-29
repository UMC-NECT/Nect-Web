import FileImage from '@/assets/icons/main/file.svg';
import TalkImage from '@/assets/icons/main/talk.svg';
import RectImage from '@/assets/icons/main/rectangle.svg';

export interface NewsItem {
    id: number;
    title: string;
    description: string;
    image: string;
    isActive?: boolean;
    bgColor: string;
    borderColor: string;
}

export const newsItems: NewsItem[] = [
    {
        id: 1,
        title: '맞춤 프로젝트 매칭',
        description: '관심사 기반의 프로필 설정을 통해 목표에 맞게 매칭을 연결해드려요!',
        image: FileImage,
        isActive: false,
        bgColor: '#FFF8E7',
        borderColor: '#E0E0E0'
    },
    {
        id: 2,
        title: 'NECT가 처음이라면?',
        description: '팀 매칭부터 프로젝트 협업까지!\n넥트 입문 가이드로 한눈에 알아보세요.',
        image: TalkImage,
        isActive: true,
        bgColor: '#FFFFFF',
        borderColor: '#E0E0E0'
    },
    {
        id: 3,
        title: '프로젝트 시작 가이드',
        description: '넥트에서의 프로젝트 첫 시작을 위한 가이드를 제공해드릴게요!',
        image: RectImage,
        isActive: true,
        bgColor: '#E6F4EA',
        borderColor: '#E0E0E0'
    },
];