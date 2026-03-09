import { useState } from "react";
import './Guide.css'

type WeekendType = 'standard' | 'sprint';

interface Session {
    day: string;
    name: string;
    emoji: string;
    color: string;
    duration: string;
    description: string;
    details: string[];
}

const STANDARD_SESSIONS: Session[] = [
    {
        day: 'DAY 1 · 금요일',
        name: 'Practice 1',
        emoji: '🔧',
        color: '#3b82f6',
        duration: '60분',
        description: '첫 번째 자유 연습 세션',
        details: [
            '드라이버들이 서킷을 처음 달리며 타이어·차량 세팅을 점검합니다.',
            '순위보다는 데이터 수집이 목적이에요.',
            '각 팀은 다양한 설정을 시험해 봅니다.',
        ],
    },
    {
        day: 'DAY 1 · 금요일',
        name: 'Practice 2',
        emoji: '🔧',
        color: '#3b82f6',
        duration: '60분',
        description: '두 번째 자유 연습 세션',
        details: [
            'Practice 1 데이터를 바탕으로 차량 세팅을 더 발전시킵니다.',
            '레이스 시뮬레이션 (긴 스팅트)을 시도하기도 해요.',
            '타이어 성능 저하 패턴을 파악합니다.',
        ],
    },
    {
        day: 'DAY 2 · 토요일',
        name: 'Practice 3',
        emoji: '🔧',
        color: '#3b82f6',
        duration: '60분',
        description: '세 번째이자 마지막 자유 연습 세션',
        details: [
            '예선 전 마지막 조정 기회입니다.',
            '드라이버들이 빠른 랩타임을 위한 최적 세팅을 완성합니다.',
            '이 세션이 끝나면 더 이상 차량을 크게 바꿀 수 없어요.',
        ],
    },
    {
        day: 'DAY 2 · 토요일',
        name: 'Qualifying',
        emoji: '⚡',
        color: '#e8002d',
        duration: '60분 (Q1·Q2·Q3)',
        description: '예선 — 일요일 레이스 출발 순서 결정',
        details: [
            'Q1 (18분): 전체 드라이버 참가, 하위 6명 탈락.',
            'Q2 (15분): 남은 16명 참가, 하위 6명 탈락.',
            'Q3 (12분): 최상위 10명이 1~10위 그리드 자리를 놓고 경쟁.',
            'Q3에서 가장 빠른 랩타임을 기록한 드라이버가 폴 포지션(1번 자리)을 차지합니다!',
        ],
    },
    {
        day: 'DAY 3 · 일요일',
        name: 'Race',
        emoji: '🏁',
        color: '#f59e0b',
        duration: '约 90~120분',
        description: '메인 레이스 — 진짜 승부!',
        details: [
            '예선 순서대로 출발합니다 (그리드 스타트).',
            '총 서킷 거리 305km 이상을 달립니다.',
            '의무 피트스톱(타이어 교체)이 최소 1번 있어요.',
            '결승선을 가장 빨리 통과한 드라이버가 우승! 1위는 25점, 2위 18점 … 순으로 챔피언십 포인트를 획득합니다.',
        ],
    },
];

const SPRINT_SESSIONS: Session[] = [
    {
        day: 'DAY 1 · 금요일',
        name: 'Practice 1',
        emoji: '🔧',
        color: '#3b82f6',
        duration: '60분',
        description: '유일한 자유 연습 세션',
        details: [
            '스프린트 주말에는 FP가 딱 1번뿐이에요.',
            '드라이버들에게 연습 시간이 매우 적기 때문에 실수가 더 잦고 박진감이 넘칩니다.',
            '여기서 바로 스프린트 예선으로 이어집니다.',
        ],
    },
    {
        day: 'DAY 1 · 금요일',
        name: 'Sprint Qualifying',
        emoji: '⚡',
        color: '#8b5cf6',
        duration: '약 45분 (SQ1·SQ2·SQ3)',
        description: '스프린트 레이스 출발 순서 결정',
        details: [
            '일반 예선과 비슷하지만 스프린트 레이스의 그리드를 정합니다.',
            'SQ1·SQ2·SQ3 세 단계로 진행됩니다.',
            '이 결과는 일요일 메인 레이스 그리드와 무관합니다.',
        ],
    },
    {
        day: 'DAY 2 · 토요일',
        name: 'Sprint Race',
        emoji: '🚀',
        color: '#10b981',
        duration: '약 30분 (100km)',
        description: '짧은 미니 레이스 — 소량의 포인트 배분',
        details: [
            '총 거리 약 100km로 메인 레이스의 ⅓ 수준입니다.',
            '의무 피트스톱 없이 달립니다.',
            '1위 8점 / 2위 7점 … 8위 1점까지 포인트가 주어집니다.',
            '스프린트 결과는 일요일 메인 레이스 그리드에 영향을 주지 않아요.',
        ],
    },
    {
        day: 'DAY 2 · 토요일',
        name: 'Qualifying',
        emoji: '⚡',
        color: '#e8002d',
        duration: '60분 (Q1·Q2·Q3)',
        description: '일요일 메인 레이스 출발 순서 결정',
        details: [
            '스프린트 이후 토요일 오후에 진행됩니다.',
            '이 예선 결과가 일요일 결승 레이스의 그리드를 결정합니다.',
            'Q1→Q2→Q3 순서로 진행되며 가장 빠른 드라이버가 폴 포지션.',
        ],
    },
    {
        day: 'DAY 3 · 일요일',
        name: 'Race',
        emoji: '🏁',
        color: '#f59e0b',
        duration: '约 90~120분',
        description: '메인 레이스 — 진짜 승부!',
        details: [
            '토요일 예선(Q) 결과 순서로 출발합니다.',
            '총 서킷 거리 305km 이상을 달립니다.',
            '의무 피트스톱(타이어 교체)이 최소 1번 있어요.',
            '1위는 25점, 2위 18점 … 순으로 챔피언십 포인트를 획득합니다.',
        ],
    },
];

function SessionCard({ session, index }: { session: Session; index: number }) {
    const [open, setOpen] = useState(false);

    return (
        <div
            className="guide-card"
            style={{ '--session-color': session.color } as React.CSSProperties}
        >
            <div className="guide-card__day-badge">{session.day}</div>
            <button className="guide-card__header" onClick={() => setOpen(!open)}>
                <div className="guide-card__left">
                    <span className="guide-card__num">{String(index + 1).padStart(2, '0')}</span>
                    <span className="guide-card__emoji">{session.emoji}</span>
                    <div className="guide-card__title-group">
                        <h3 className="guide-card__name">{session.name}</h3>
                        <p className="guide-card__desc">{session.description}</p>
                    </div>
                </div>
                <div className="guide-card__right">
                    <span className="guide-card__duration">{session.duration}</span>
                    <span className={`guide-card__arrow ${open ? 'guide-card__arrow--open' : ''}`}>▸</span>
                </div>
            </button>
            {open && (
                <ul className="guide-card__details">
                    {session.details.map((d, i) => (
                        <li key={i}>
                            <span className="guide-card__bullet">▪</span>
                            {d}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default function Guide() {
    const [type, setType] = useState<WeekendType>('standard');
    const sessions = type === 'standard' ? STANDARD_SESSIONS : SPRINT_SESSIONS;

    return (
        <div className="guide-page">
            {/* Hero */}
            <section className="guide-hero">
                <p className="guide-hero__eyebrow">F1 입문 가이드 (2026년 기준)</p>
                <h1 className="guide-hero__title">
                    레이스 위크엔드<br />
                    <span className="text-red">구조 이해하기</span>
                </h1>
                <p className="guide-hero__sub">
                    F1 그랑프리는 보통 3일에 걸쳐 진행됩니다. 각 세션이 무엇인지,
                    왜 중요한지 알아두면 훨씬 재미있게 즐길 수 있어요!
                </p>
            </section>

            {/* Type Toggle */}
            <div className="guide-toggle">
                <button
                    className={`guide-toggle__btn ${type === 'standard' ? 'guide-toggle__btn--active' : ''}`}
                    onClick={() => setType('standard')}
                >
                    🗓️ 일반 주말
                </button>
                <button
                    className={`guide-toggle__btn ${type === 'sprint' ? 'guide-toggle__btn--active' : ''}`}
                    onClick={() => setType('sprint')}
                >
                    🚀 스프린트 주말
                </button>
            </div>

            {/* Description Banner */}
            <div className={`guide-banner ${type === 'sprint' ? 'guide-banner--sprint' : ''}`}>
                {type === 'standard' ? (
                    <>
                        <strong>일반(Standard) 주말</strong> — 시즌 대부분의 그랑프리가 이 형식입니다.
                        금·토·일 3일간 프랙티스 3번, 예선 1번, 레이스 1번으로 구성됩니다.
                    </>
                ) : (
                    <>
                        <strong>스프린트(Sprint) 주말</strong> — 시즌 중 약 6번 열리는 특별 형식입니다.
                        프랙티스가 1번으로 줄고, 스프린트 레이스와 스프린트 예선이 추가됩니다.
                        더 짧고 더 긴박합니다!
                    </>
                )}
            </div>

            {/* Session Cards */}
            <div className="guide-sessions">
                {sessions.map((s, i) => (
                    <SessionCard key={`${type}-${i}`} session={s} index={i} />
                ))}
            </div>

            {/* Points Table */}
            <section className="guide-points">
                <h2 className="guide-points__title">🏆 포인트 시스템</h2>
                <p className="guide-points__sub">드라이버·팀들은 각 레이스마다 포인트를 쌓아 챔피언을 결정합니다.</p>
                <div className="guide-points__tables">
                    <div className="guide-points__table">
                        <div className="guide-points__table-title">메인 레이스</div>
                        {[
                            ['1위', '25'], ['2위', '18'], ['3위', '15'], ['4위', '12'],
                            ['5위', '10'], ['6위', '8'], ['7위', '6'], ['8위', '4'],
                            ['9위', '2'], ['10위', '1'],
                        ].map(([pos, pts]) => (
                            <div key={pos} className="guide-points__row">
                                <span>{pos}</span>
                                <span className="guide-points__pts">{pts} <small>pts</small></span>
                            </div>
                        ))}
                    </div>
                    <div className="guide-points__table">
                        <div className="guide-points__table-title">스프린트 레이스</div>
                        {[
                            ['1위', '8'], ['2위', '7'], ['3위', '6'], ['4위', '5'],
                            ['5위', '4'], ['6위', '3'], ['7위', '2'], ['8위', '1'],
                        ].map(([pos, pts]) => (
                            <div key={pos} className="guide-points__row">
                                <span>{pos}</span>
                                <span className="guide-points__pts">{pts} <small>pts</small></span>
                            </div>
                        ))}
                        <div className="guide-points__note">※ 스프린트 주말에만 개최</div>
                    </div>
                </div>
            </section>
        </div>
    );
}