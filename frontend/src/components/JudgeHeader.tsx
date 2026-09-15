import React from 'react';
import { useNavigate } from 'react-router-dom';

interface JudgeHeaderProps {
    /** e.g. "Judge 1 (John)" */
    judgeLabel: string;
    /** Second chip text, e.g. "Active: Evening Gown" or "No active round" */
    roundLabel: string;
    /** Right-side extras rendered before Logout (e.g. density toggle) */
    children?: React.ReactNode;
}

export const JudgeHeader: React.FC<JudgeHeaderProps> = ({ judgeLabel, roundLabel, children }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('judge_session');
        navigate('/judge/login');
    };

    return (
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-hairline bg-surface px-4">
            <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-ink">Tabulation System</span>
                <span className="h-4 w-px bg-edge" aria-hidden="true" />
                <span className="status-chip">{judgeLabel}</span>
                <span className="status-chip">{roundLabel}</span>
            </div>
            <div className="flex items-center gap-3">
                {children}
                <button onClick={handleLogout} className="btn btn-ghost-danger">
                    Logout
                </button>
            </div>
        </header>
    );
};