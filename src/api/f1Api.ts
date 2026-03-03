import type {
    JolpicaResponse,
    DriverStandingsList,
    ConstructorStandingsList,
    Driver,
    Constructor,
} from '../types/f1';

const API_BASE_URL = 'https://api.jolpi.ca/ergast/f1';

async function fetchJSON<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json() as Promise<T>;
}

export async function getDrivers(limit = 30, offset = 0): Promise<{ drivers: Driver[]; total: number }> {
    const data = await fetchJSON<JolpicaResponse<Driver>>(
        `${API_BASE_URL}/drivers?limit=${limit}&offset=${offset}`
    );
    return { 
        drivers: data.MRData.DriverTable?.Drivers ?? [], 
        total: Number(data.MRData.total) };
}

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