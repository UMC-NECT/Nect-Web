import { useState } from 'react';
import ProjectHistory from './ProjectHistory';
import MemberCard from './MemberCard';
import MemberProfileModal from './MemberProfileModal';

interface TeamMembersTabProps {
    getPositionStyle: (position: string) => string;
}

interface MemberDetail {
    name: string;
    role: string;
    position: string;
    email: string;
    isRecruiting?: boolean;
    jobTitle: string;
    field: string;
    experience: string;
    introduction: string;
    coreCompetencies: string[];
    portfolioKeywords: string[];
    designTools: string[];
    recordTools: string[];
    etcTools: string[];
}

const TeamMembersTab = ({ getPositionStyle }: TeamMembersTabProps) => {
    const [selectedMember, setSelectedMember] = useState<MemberDetail | null>(null);

    // 멤버 데이터
    const pmMembers = [
        { name: '시루', role: 'Leader', position: 'PM', introduction: '디자인 전공 출신 만능형 프로덕트 매니저입니다 ! 함께 성장 할 팀을 구합니다 !' }
    ];

    const designMembers = [
        { name: '이방토', role: 'Lead', position: 'Design', introduction: '디자인 프로젝트 경험이 많고 꼼꼼한 UX.UI 디자이너입니다 !...' },
        { name: '매칭 중', position: 'Part', introduction: '해당 파트 매칭 대기 중', isMatching: true }
    ];

    const frontendMembers = [
        { name: '숀', role: 'Lead', position: 'Frontend', introduction: '프로필 소개' },
        { name: '갱빈', position: 'Frontend', introduction: '프로필 소개' },
        { name: '웬디', position: 'Frontend', introduction: '프로필 소개' },
        { name: '미노', position: 'Frontend', introduction: '프로필 소개' }
    ];

    const backendMembers = [
        { name: '세인트', role: 'Lead', position: 'Backend', introduction: '프로필 소개' },
        { name: '미카엘', position: 'Backend', introduction: '프로필 소개' },
        { name: '매칭 중', position: 'Part', introduction: '해당 파트 매칭 대기 중', isMatching: true },
        { name: '매칭 중', position: 'Part', introduction: '해당 파트 매칭 대기 중', isMatching: true }
    ];

    // 상세 멤버 데이터 (모달용)
    const memberDetailData = {
        name: '이방토',
        role: 'Lead',
        position: 'Design',
        email: 'ellaella2@hanyang.ac.kr',
        isRecruiting: true,
        jobTitle: 'UX/UI Product Designer / UX researcher',
        field: 'UX/UI  브랜딩/제품',
        experience: '6개월',
        introduction: '디자인 프로젝트 경험이 많고 꼼꼼한 UX.UI 디자이너 입니다!\nUX리서치/ 브랜딩/ 패키지/ 그래픽 및 일러스트 모두 가능합니다.',
        coreCompetencies: [
            '사용자 경험을 기반으로 한 UX 전략 도출 및 서비스 프로토타입 설계 가능',
            'UX 리서치 및 데이터 드리븐을 통한 가설 설정, 지표 개선 경험',
            '기획 / 개발 / 비즈니스 / 마케팅 직군과의 커뮤니케이션 능숙',
            '다양한 디바이스 환경(웹 접근성, 반응형, 앱 앱 등)에 대한 높은 이해도',
            '디자인 시스템 구축 및 실 서비스에 활용 경험 보유'
        ],
        portfolioKeywords: ['#프트폴리오 집중', '#신중한 설계자', '#비주얼 전문가'],
        designTools: ['Figma', 'Photoshop', 'Illustrator', 'Premiere Pro', 'After Effect', 'Procreate'],
        recordTools: ['Notion', 'UX Research'],
        etcTools: ['Claude', 'Consecutive Interpretation']
    };

    return (
        <div className='ml-[10px]'>
            <h2 className="font-bold text-[20px] mb-[24px]">파트별 팀원 프로필</h2>

            {/* PM */}
            <div className='flex flex-col mt-[24px]'>
                <div className='mb-[12px]'>
                    <span className={`inline-flex items-center justify-center w-[37px] h-[24px] px-[8px] py-[2px] ${getPositionStyle('pm')} text-neutral-700 rounded-[6px] text-[14px] font-medium`}>
                        PM
                    </span>
                </div>
                {pmMembers.map((member, index) => (
                    <MemberCard key={index} member={member} onClick={() => setSelectedMember(memberDetailData)} />
                ))}
            </div>

            {/* Design */}
            <div className='mt-[24px]'>
                <div className='mb-[12px]'>
                    <span className={`inline-flex items-center justify-center w-[61px] h-[24px] px-[8px] py-[2px] ${getPositionStyle('design')} text-neutral-700 rounded-[6px] text-[14px] font-medium`}>
                        Design
                    </span>
                </div>
                <div className='flex gap-6'>
                    {designMembers.map((member, index) => (
                        <MemberCard key={index} member={member} onClick={() => !member.isMatching && setSelectedMember(memberDetailData)} />
                    ))}
                </div>
            </div>

            {/* Frontend */}
            <div className='mt-[24px]'>
                <div className='mb-[12px]'>
                    <span className={`inline-flex items-center justify-center w-[74px] h-[24px] px-[8px] py-[2px] ${getPositionStyle('frontend')} text-neutral-700 rounded-[6px] text-[14px] font-medium`}>
                        Frontend
                    </span>
                </div>
                <div className='flex gap-6'>
                    {frontendMembers.slice(0, 2).map((member, index) => (
                        <MemberCard key={index} member={member} onClick={() => setSelectedMember(memberDetailData)} />
                    ))}
                </div>
                <div className='flex gap-6 mt-[12px]'>
                    {frontendMembers.slice(2, 4).map((member, index) => (
                        <MemberCard key={index} member={member} onClick={() => setSelectedMember(memberDetailData)} />
                    ))}
                </div>
            </div>

            {/* Backend */}
            <div className='mt-[24px] mb-[64px]'>
                <div className='mb-[12px]'>
                    <span className={`inline-flex items-center justify-center w-[72px] h-[24px] px-[8px] py-[2px] ${getPositionStyle('backend')} text-neutral-700 rounded-[6px] text-[14px] font-medium`}>
                        Backend
                    </span>
                </div>
                <div className='flex gap-6'>
                    {backendMembers.slice(0, 2).map((member, index) => (
                        <MemberCard key={index} member={member} onClick={() => !member.isMatching && setSelectedMember(memberDetailData)} />
                    ))}
                </div>
                <div className='flex gap-6 mt-[12px]'>
                    {backendMembers.slice(2, 4).map((member, index) => (
                        <MemberCard key={index} member={member} />
                    ))}
                </div>
            </div>

            <ProjectHistory getPositionStyle={getPositionStyle} />

            {/* 모달 */}
            <MemberProfileModal 
                isOpen={selectedMember !== null}
                onClose={() => setSelectedMember(null)}
                member={selectedMember || memberDetailData}
            />
        </div>
    );
};

export default TeamMembersTab;