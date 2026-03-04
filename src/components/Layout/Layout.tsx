import { NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';
import './Layout.css'

interface Props {
    children: ReactNode;
}
const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Drivers', path: '/drivers' },
    { name: 'Races', path: '/races' },
]

export default function Layout({ children }: Props) {
    return (
        <div>
            <header className="navbar">
                <div className="container navbar__inner">
                    <NavLink to="/" className="navbar__brand">
                        <span className="navbar__brand-f1">F1</span>
                        <span className="navbar__brand-hub">HUB</span>
                    </NavLink>

                    <nav className="navbar__nav">
                        {navItems.map(({ path, name }) => (
                            <NavLink
                                key={path}
                                to={path}
                                className={({ isActive }) => `navbar__nav-item ${isActive ? 'active' : ''}`}
                            >
                                {name}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            </header>
            <main className="main">
                <div className="container page-enter">
                    {children}
                </div>
            </main>

            <footer className="footer">
                <div className="container footer__inner">
                    <p>Data provided by <a href="https://jolpi.ca" target="_blank" rel="noreferrer">Jolpica API</a> (Ergast fork)</p>
                    <p>© 2025 F1 Hub • Portfolio Project</p>
                </div>
            </footer>
        </div>
    )
}
