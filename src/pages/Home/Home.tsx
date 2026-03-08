import { useEffect, useState } from "react"
import './Home.css'
import { getDriverStandings, getConstructorStandings } from "../../api/f1Api";
import type { ConstructorStandingsList, DriverStandingsList } from "../../types/f1";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

type Tab = 'drivers' | 'constructors';

interface StandingsResult<T> {
    data: T;
    season: string;
}

const TEAM_COLORS: Record<string, string> = {
    red_bull: '#3671C6',
    ferrari: '#E8002D',
    mercedes: '#27F4D2',
    mclaren: '#FF8000',
    aston_martin: '#229971',
    alpine: '#FF87BC',
    williams: '#64C4FF',
    rb: '#6692FF',
    kick_sauber: '#52E252',
    haas: '#B6BABD',
};

function getTeamColor(constructorId: string): string {
    return TEAM_COLORS[constructorId] ?? '#888';
}

function getMedalColor(pos: number): string {
    if (pos === 1) return 'var(--color-gold)';
    if (pos === 2) return 'var(--color-silver)';
    if (pos === 3) return 'var(--color-bronze)';
    return 'var(--color-text-secondary)';
}

export default function Home() {
    const [tab, setTab] = useState<Tab>('drivers')
    const [driverData, setDriverData] = useState<StandingsResult<DriverStandingsList> | null>(null);
    const [constructorData, setConstructorData] = useState<StandingsResult<ConstructorStandingsList> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>('');

    useEffect(() => {
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const [d, c] = await Promise.all([getDriverStandings(), getConstructorStandings()]);
                setDriverData(d);
                setConstructorData(c ?? null);
            } catch {
                setError("Failed to load standing data.");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    return (
        <div className="home">
            <section className= "home-hero">
                <div className= "home-hero__eyebrow">
                    <span className="home-hero__badge">{driverData?.data.season}</span>
                    {driverData && (
                        <span className="home-hero__season">
                            {driverData.data.season} Season / Round {driverData.data.round}
                        </span>
                    )}
                </div>
                <h1 className="home-hero__title">Championship<br /><span className="text-red">Standings</span></h1>
                <p className="home-hero__desc">Formula 1 World Championship</p>
            </section>

            <div className="home-tabs">
                <button
                    className={`home-tabs__btn ${tab === 'drivers' ? 'home-tabs__btn--active' : ''}`}
                    onClick={() => setTab('drivers')}
                >
                    Drivers
                </button>
                <button
                    className={`home-tabs__btn ${tab === 'constructors' ? 'home-tabs__btn--active' : ''}`}
                    onClick={() => setTab('constructors')}
                >
                    Constructors
                </button>
            </div>

            {loading && <LoadingSpinner text="Loading standings..." />}
            {error && <p className="error-msg">{error}</p>}

            {!loading && !error && tab === 'drivers' && driverData?.data && (
                <div className="standings-table">
                    {driverData.data.DriverStandings.map((s) => {
                        const pos = Number(s.position);
                        const teamColor = getTeamColor(s.Constructors[0]?.constructorId ?? '');
                        return (
                            <div key={s.Driver.driverId} className="standing-row">
                                <div className="standing-row__pos" style={{ color: getMedalColor(pos) }}>
                                    {pos <= 3 ? ['🥇', '🥈', '🥉'][pos - 1] : pos}
                                </div>
                                <div className="standing-row_team-bar" style={{ background: teamColor}} />
                                <div className="standing-row_info">
                                    <span className="standing-row__code">{s.Driver.code ?? s.Driver.familyName.slice(0, 3).toUpperCase()}</span>
                                    <span className="standing-row__name">
                                        {s.Driver.givenName} <strong>{s.Driver.familyName}</strong>
                                    </span>
                                </div>
                                <div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}