import { useEffect, useState, useMemo } from "react"
import './Drivers.css'
import type { Driver } from "../../types/f1";
import { getDrivers } from "../../api/f1Api";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import Pagination from "../../components/Pagination/Pagination";

const nationToFlag: Record<string, string> = {
    British: '🇬🇧', German: '🇩🇪', Spanish: '🇪🇸', Finnish: '🇫🇮',
    French: '🇫🇷', Australian: '🇦🇺', Dutch: '🇳🇱', Mexican: '🇲🇽',
    Monégasque: '🇲🇨', Canadian: '🇨🇦', Danish: '🇩🇰', Thai: '🇹🇭',
    American: '🇺🇸', Japanese: '🇯🇵', Chinese: '🇨🇳', Italian: '🇮🇹',
    Brazilian: '🇧🇷', Argentine: '🇦🇷', Austrian: '🇦🇹', Belgian: '🇧🇪',
    Swedish: '🇸🇪', Russian: '🇷🇺', Polish: '🇵🇱',
};
const PAGE_SIZE = 12;

export default function Drivers() {
    const [drivers, setDrivers] = useState<Driver[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    
    useEffect(() => {
        async function fetchDrivers() {
            setLoading(true)
            setError(null)
            try {
                const res = await getDrivers(100, 0);
                let all = [...res.drivers]
                const totalCount = res.total;
                setTotal(totalCount);
                const fetches: Promise<{ drivers: Driver[]; total: number }>[] = [];
                for (let offset = 100; offset < totalCount; offset += 100) {
                    fetches.push(getDrivers(100, offset));
                }
                const results = await Promise.all(fetches);
                results.forEach((r) => { all = [...all, ...r.drivers] });
                setDrivers(all);
            } catch {
                setError("Failed to load drivers");
            } finally {
                setLoading(false)
            }
        }
        fetchDrivers()
    }, [])

    const filtered = useMemo(() => {
        if (!search.trim()) return drivers
        const q = search.toLowerCase()
        return drivers.filter(
            (d) =>
            d.givenName.toLowerCase().includes(q) ||
            d.familyName.toLowerCase().includes(q) ||
            d.nationality?.toLowerCase().includes(q) ||
            d.code?.toLowerCase().includes(q)
        )
    }, [drivers, search])

    const handleSearch = (value: string) => {
        setSearch(value)
        setPage(1)
    }


    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div className="drivers-page">
            <div className="drivers-header">
                <h1 className="drivers-header__title">F1 Drivers</h1>
                <p className="drivers-header__sub">
                    {loading ? "Loading drivers..." : `${filtered.length.toLocaleString()} drivers`}
                    {total > 0 && !loading && ` ${total.toLocaleString()} total`}
                </p>
            </div>
            <div className="drivers-search">
                <span className="drivers-search__icon">🔍</span>
                <input
                    type="text"
                    className="drivers-search__input"
                    placeholder="Search drivers..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                />
                {search && (
                    <button
                        className="drivers-search__clear"
                        onClick={() => handleSearch('')}
                    >
                        ✕
                    </button>
                )}
            </div>

            {loading && <LoadingSpinner text="Loading drivers database..." />}
            {error && <p className="error-msg">{error}</p>}

            {!loading && !error && (
                <>
                    {paginated.length === 0 ? (
                        <div className="drivers-empty">
                            <p>No drivers found.</p>
                        </div>
                    ) : (
                        <div className="drivers-grid">
                            {paginated.map((d) => (
                                <div key={d.driverId} className="driver-card">
                                    <div className="driver-card__number">
                                        {d.permanentNumber ?? '#'}
                                    </div>
                                    <div className="driver-card__code">
                                        {d.code ?? d.familyName.slice(0, 3).toUpperCase()}
                                    </div>
                                    <div className="driver-card__name">
                                        <span className="driver-card__given">{d.givenName}</span>
                                        <span className="driver-card__family">{d.familyName}</span>
                                    </div>
                                    <div className="driver-card__footer">
                                        <div className="driver-card__nat">
                                            <span>{nationToFlag[d.nationality] ?? '🏁'}</span>
                                            <span>{d.nationality}</span>
                                        </div>
                                        <span className="driver-card__dob">
                                            {new Date(d.dateOfBirth).getFullYear()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={(p) => {
                            setPage(p);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                    />
                </>
            )}
        </div>
    )
}