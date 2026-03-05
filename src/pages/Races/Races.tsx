import { useEffect, useState } from "react"
import './Races.css'
import { getCurrentSeasonRaces, getRaces } from "../../api/f1Api";
import type { Race } from "../../types/f1";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

export default function Races() {
    const [races, setRaces] = useState<Race[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [season, setSeason] = useState<string>('');
    const [selected, setSelected] = useState<Race | null>(null);

    useEffect(() => {
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const data = await getCurrentSeasonRaces();
                setRaces(data.races);
                setSeason(data.season);
            } catch (err) {
                setError('Failed to load races');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    async function handleSelectRace(race: Race) {
        if (selected?.round === race.round) {
            setSelected(null);
            return;
        }

        try {
            setLoading(true);

            const data = await getRaces(Number(season), race.round);

            if (data) {
                setSelected(data);
            }

        } catch {
            setError("Failed to load race results");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="races-page">
            <div className="races-header">
                <h1 className="races-header__title">Race Result</h1>
                <p className="races-header__sub">
                    {season} Season
                </p>
            </div>

            {loading && <LoadingSpinner text="Loading races data..." />}
            {error && <p className="error-msg">{error}</p>}

            {!loading && !error && (
                <div className={`race-layout ${selected ? 'race-layout--split' : ''}`}>
                    <div className="race-list">
                        {races.length === 0 && (
                            <p className="no-data">No races found for this season.</p>
                        )}
                        {races.map((race) => (
                            <button
                                    key={`${race.season}-${race.round}`}
                                    className={`race-item ${selected?.round === race.round ? 'race-item--active' : ''}`}
                                    onClick={() => handleSelectRace(race)}
                                >
                                    <div className="race-item__round">R{race.round}</div>
                                    <div className="race-item__info">
                                        <span className="race-item__name">{race.raceName}</span>
                                        <span className="race-item__circuit">
                                            📍 {race.Circuit.Location.locality}, {race.Circuit.Location.country}
                                        </span>
                                        <span className="race-item__date">{new Date(race.date).toLocaleDateString()}</span>
                                    </div>
                                    {race.Results && race.Results[0] && (
                                        <div className="race-item__winner">
                                            <span className="race-item__winner-label">Winner</span>
                                            <span className="race-item__winner-name">
                                                🏆 {race.Results[0].Driver.givenName[0]}. {race.Results[0].Driver.familyName}
                                            </span>
                                        </div>
                                    )}
                                    <span className="race-item__arrow">{selected?.round === race.round ? '▾' : '▸'}</span>
                            </button>
                        ))}
                    </div>

                    {selected && (
                        <div className="results-panel">
                            <div className="result-panel__header">
                                <div>
                                    <div className="result__header">
                                        <span className="results-panel__round">Round {selected.round}</span>
                                        <button className="results-panel__close" onClick={() => setSelected(null)}>x</button>
                                    </div>
                                    <h2 className="results-panel__title">{selected.raceName}</h2>
                                    <p className="result-panel__meta">
                                        {selected.Circuit.circuitName} / {new Date(selected.date).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {selected.Results && selected.Results.length > 0 ? (
                                <div className="results-table">
                                    <div className="results-table__head">
                                        <span>Pos</span>
                                        <span>Driver</span>
                                        <span>Team</span>
                                        <span>Time/Status</span>
                                        <span>Pts</span>
                                    </div>
                                    {selected.Results.map((r) => (
                                        <div key={r.Driver.driverId} className={`results-row ${r.position === '1' ? 'results-row--winner' : ''}`}>
                                            <span className="results-row__pos">{r.positionText}</span>
                                            <div className="results-row__driver">
                                                <span className="results-row__code">{r.Driver.code ?? r.Driver.familyName.slice(0, 3).toUpperCase()}</span>
                                                <span className="results-row__name">{r.Driver.givenName[0]}. {r.Driver.familyName}</span>
                                            </div>
                                            <span className="results-row__team">{r.Constructor.name}</span>
                                            <span className="results-row__time">
                                                {r.Time?.time ?? r.status}
                                            </span>
                                            <span className="results-row__pts">{r.points}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-data">Results not available yet.</p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}