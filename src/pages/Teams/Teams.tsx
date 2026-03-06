import { useEffect, useState } from "react";
import './Teams.css';
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import type { Constructor } from "../../types/f1";
import { getConstructors } from "../../api/f1Api";

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

const TEAM_SHORTNAMES: Record<string, string> = {
    red_bull: 'Red Bull Racing',
    ferrari: 'Scuderia Ferrari',
    mercedes: 'Mercedes-AMG',
    mclaren: 'McLaren F1',
    aston_martin: 'Aston Martin',
    alpine: 'Alpine F1',
    williams: 'Williams Racing',
    rb: 'RB F1 Team',
    kick_sauber: 'Kick Sauber',
    haas: 'MoneyGram Haas',
};

const nationToFlag: Record<string, string> = {
    British: '🇬🇧', German: '🇩🇪', Italian: '🇮🇹', French: '🇫🇷',
    American: '🇺🇸', Austrian: '🇦🇹', Dutch: '🇳🇱', Japanese: '🇯🇵',
    Swiss: '🇨🇭',
};

export default function Teams() {
    const [constructor, setConstructor] = useState<Constructor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            setLoading(true)
            setError(null)
            try {
                setConstructor(await getConstructors());
            } catch {
                setError("Failed to load teams.")
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    return (
        <div className="teams-page">
            <div className="teams-header">
                <h1 className="teams-header__title">Teams</h1>
                <p className="teams-header__sub">Current season constructor</p>
            </div>

            {loading && <LoadingSpinner text="Loading Teams..."/>}
            {error && <p className="error-msg">{error}</p>}

            {!loading && !error && (
                <div className="team-grid">
                    {constructor.map((c) => {
                        const color = TEAM_COLORS[c.constructorId] ?? '#888';
                        return (
                            <div key={c.constructorId} className="team-card">
                                <div className="team-card__color-bar" style={{ background: color}} />
                                <div className="team-card__body">
                                    <div className="team-card__dot" style={{ background: color}} />
                                    <div className="team-card__name">
                                        {TEAM_SHORTNAMES[c.constructorId] ?? c.name}
                                    </div>
                                    <div className="team-card__official">{c.name}</div>
                                    <div className="team-card__footer">
                                        <span className="team-card__nat">
                                            {nationToFlag[c.nationality] ?? '🏁'} {c.nationality}
                                        </span>
                                        <a
                                            href={c.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="team-card__link"
                                        >
                                            Wikipedia ↗
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>  
            )}
        </div>
    )
}