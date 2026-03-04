import type {
    JolpicaResponse,
    DriverStandingsList,
    ConstructorStandingsList,
    Driver,
    Constructor,
    Race,
} from '../types/f1';

const API_BASE_URL = 'https://api.jolpi.ca/ergast/f1';

async function fetchJSON<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json() as Promise<T>;
}

/* Drivers */
export async function getDrivers(limit = 30, offset = 0): Promise<{ drivers: Driver[]; total: number }> {
    const data = await fetchJSON<JolpicaResponse<Driver>>(
        `${API_BASE_URL}/drivers?limit=${limit}&offset=${offset}`
    );
    return { 
        drivers: data.MRData.DriverTable?.Drivers ?? [], 
        total: Number(data.MRData.total) };
}

/* Constructors */
export async function getConstructors(): Promise<Constructor[]> {
    const data = await fetchJSON<JolpicaResponse<Constructor>>(
        `${API_BASE_URL}/constructors?constructors.json`
    );
    const list = data.MRData.ConstructorTable?.Constructors ?? [];
    if (list.length > 0) return list;

    const fallback = await fetchJSON<JolpicaResponse<Constructor>>(
        `${API_BASE_URL}/${2025}/constructors.json`
    );

    return fallback.MRData.ConstructorTable?.Constructors ?? [];
}

/* Races */
export async function getCurrentSeasonRaces(): Promise<{ races: Race[]; season: string }> {
    const data = await fetchJSON<JolpicaResponse<Race>>(
        `${API_BASE_URL}/${2025}/races.json?limit=100`
    );
    return { races: data.MRData.RaceTable?.Races ?? [], season: '2025' };
}

export async function getRaces(season: number, round: string): Promise<Race | null> {
    const data = await fetchJSON<JolpicaResponse<Race>>(
        `${API_BASE_URL}/${season}/${round}/results.json`
    );
    return data.MRData.RaceTable?.Races[0] ?? null;
}