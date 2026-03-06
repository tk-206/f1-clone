import type {
    JolpicaResponse,
    DriverStandingsList,
    ConstructorStandingsList,
    Driver,
    Constructor,
    Race,
} from '../types/f1';

const API_BASE_URL = 'https://api.jolpi.ca/ergast/f1';
const seasonNumber = '2025';

async function fetchJSON<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json() as Promise<T>;
}

/* Standings */
export async function getDriverStandings(): Promise<{ data: DriverStandingsList; season: string } | null> {
    const list = await fetchJSON<JolpicaResponse<DriverStandingsList>>(
        `${API_BASE_URL}/${seasonNumber}/driverStandings.json`
    );
    const listData = list.MRData.StandingsTable?.StandingsLists[0];
    return listData ? { data: listData, season: seasonNumber } : null;
}

export async function getConstructorStandings(): Promise<{ data: ConstructorStandingsList; season: string } | null> {
    const list = await fetchJSON<JolpicaResponse<ConstructorStandingsList>>(
        `${API_BASE_URL}/${seasonNumber}/constructorStandings.json`
    );
    const listData = list.MRData.StandingsTable?.StandingsLists[0]
    return listData ? { data: listData, season: seasonNumber} : null;
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
        `${API_BASE_URL}/${seasonNumber}/constructors.json`
    );

    return data.MRData.ConstructorTable?.Constructors ?? [];
}

/* Races */
export async function getCurrentSeasonRaces(): Promise<{ races: Race[]; season: string }> {
    const data = await fetchJSON<JolpicaResponse<Race>>(
        `${API_BASE_URL}/${seasonNumber}/races.json?limit=100`
    );
    return { races: data.MRData.RaceTable?.Races ?? [], season: seasonNumber };
}

export async function getRaces(season: number, round: string): Promise<Race | null> {
    const data = await fetchJSON<JolpicaResponse<Race>>(
        `${API_BASE_URL}/${season}/${round}/results.json`
    );
    return data.MRData.RaceTable?.Races[0] ?? null;
}