import { useEffect, useState } from "react"
import './Home.css'

type Tab = 'drivers' | 'teams'

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

export default function Home() {
    const [tab, setTab] = useState<Tab>('drivers')

    return (
        <div className="home">
            <section className= "home-header">
                <div className= "home-header__eyebrow">
                    <span className="home-header__badge"></span>
                </div>
            </section>
        </div>
    )
}