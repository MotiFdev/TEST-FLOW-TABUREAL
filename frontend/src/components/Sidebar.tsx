import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

/* Minimal 16px stroke icons — one consistent style, decorative only in support of labels */
const Icon = ({ children }: { children: React.ReactNode }) => (
    <svg
        className="h-4 w-4 shrink-0"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        {children}
    </svg>
);

const icons = {
    leaderboard: (
        <>
            <path d="M2.5 13.5h11" />
            <path d="M4.5 13.5V8.5" />
            <path d="M8 13.5V3.5" />
            <path d="M11.5 13.5V6.5" />
        </>
    ),
    monitor: (
        <>
            <path d="M1.5 8h3l1.5-4 3.5 8 1.5-4h3.5" />
        </>
    ),
    rounds: (
        <>
            <path d="M8 2.5 13.5 5 8 7.5 2.5 5 8 2.5Z" />
            <path d="m2.5 8.5 5.5 2.5 5.5-2.5" />
            <path d="m2.5 11.5 5.5 2.5 5.5-2.5" />
        </>
    ),
    criteria: (
        <>
            <path d="M2.5 4.5h11" />
            <path d="M2.5 11.5h11" />
            <circle cx="6" cy="4.5" r="1.5" />
            <circle cx="10.5" cy="11.5" r="1.5" />
        </>
    ),
    contestants: (
        <>
            <circle cx="6" cy="5" r="2.25" />
            <path d="M2 13.5c0-2.2 1.8-3.5 4-3.5s4 1.3 4 3.5" />
            <path d="M10.5 3.2a2.25 2.25 0 0 1 0 3.6" />
            <path d="M12 10.4c1.2.5 2 1.6 2 3.1" />
        </>
    ),
    judges: (
        <>
            <rect x="2.5" y="2.5" width="11" height="11" rx="1.5" />
            <circle cx="8" cy="6.5" r="1.75" />
            <path d="M4.75 13.5c0-1.8 1.45-2.75 3.25-2.75s3.25.95 3.25 2.75" />
        </>
    ),
} as const;

const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors duration-150 ${isActive
        ? 'bg-primary-soft font-medium text-primary'
        : 'text-ink-secondary hover:bg-canvas hover:text-ink'
    }`;

export const Sidebar: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('admin_session');
        navigate('/admin/login');
    };

    return (
        <aside className="flex w-56 shrink-0 flex-col justify-between border-r border-hairline bg-surface px-3 py-4">
            <nav className="flex flex-col gap-6">
                <div>
                    <h2 className="section-label mb-2 px-2.5">Live View Scores</h2>
                    <div className="flex flex-col gap-0.5">
                        <NavLink to="/admin/leaderboard" className={navItemClass}>
                            <Icon>{icons.leaderboard}</Icon>
                            Live Leaderboard
                        </NavLink>
                        <NavLink to="/admin/score-monitor" className={navItemClass}>
                            <Icon>{icons.monitor}</Icon>
                            Score Monitor
                        </NavLink>
                    </div>
                </div>

                <div>
                    <h2 className="section-label mb-2 px-2.5">Event Setup</h2>
                    <div className="flex flex-col gap-0.5">
                        <NavLink to="/admin/rounds" className={navItemClass}>
                            <Icon>{icons.rounds}</Icon>
                            Rounds
                        </NavLink>
                        <NavLink to="/admin/criteria" className={navItemClass}>
                            <Icon>{icons.criteria}</Icon>
                            Criteria & Weights
                        </NavLink>
                        <NavLink to="/admin/contestants" className={navItemClass}>
                            <Icon>{icons.contestants}</Icon>
                            Contestants
                        </NavLink>
                        <NavLink to="/admin/judges" className={navItemClass}>
                            <Icon>{icons.judges}</Icon>
                            Judges
                        </NavLink>
                    </div>
                </div>
            </nav>

            <div className="border-t border-hairline pt-3">
                <button
                    onClick={handleLogout}
                    className="w-full rounded-md px-2.5 py-1.5 text-left text-sm font-medium text-danger transition-colors duration-150 hover:bg-danger-soft"
                >
                    Logout
                </button>
            </div>
        </aside>
    );
};