import React from 'react';

interface HeaderProps {
    /** Currently active round name — wired to real round state later. */
    activeRound?: string;
    /** Live hub connection state. Truthful only — never decorative. */
    hubStatus?: 'online' | 'syncing' | 'offline';
}

export const Header: React.FC<HeaderProps> = ({ activeRound = 'Round 1', hubStatus = 'offline' }) => {
    const hubLabel =
        hubStatus === 'online' ? 'Hub online' : hubStatus === 'syncing' ? 'Hub syncing' : 'Hub offline';
    const hubClass =
        hubStatus === 'online' ? 'is-online' : hubStatus === 'syncing' ? 'is-syncing' : 'is-offline';

    return (
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-hairline bg-surface px-4">
            <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-ink">Tabulation System</span>
                <span className="h-4 w-px bg-edge" aria-hidden="true" />
                <span className="status-chip" title="Round currently open for judge scoring">
                    Active: {activeRound}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <span className={`status-chip ${hubClass}`} role="status" aria-label={`SignalR hub ${hubLabel}`}>
                    {hubLabel}
                </span>
            </div>
        </header>
    );
};