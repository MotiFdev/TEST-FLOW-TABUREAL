import React, { useState } from 'react';

interface LeaderboardEntry {
    rank: number;
    contestantNumber: number;
    contestantName: string;
    totalScore: number;
    submissionCount: number;
}

export const LiveLeaderboard: React.FC = () => {
    // Initial mock state for flow testing
    const [leaderboard] = useState<LeaderboardEntry[]>([
        { rank: 1, contestantNumber: 1, contestantName: 'Contestant Alpha', totalScore: 94.5, submissionCount: 3 },
        { rank: 2, contestantNumber: 2, contestantName: 'Contestant Bravo', totalScore: 91.2, submissionCount: 3 },
        { rank: 3, contestantNumber: 3, contestantName: 'Contestant Charlie', totalScore: 88.75, submissionCount: 2 },
    ]);

    return (
        <div className="space-y-6">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Live Leaderboard</h2>
                    <p className="page-desc">Auto-updates via SignalR as judges submit scores.</p>
                </div>
                <span className="status-chip is-online" role="status">
                    Listening for incoming scores
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th className="w-16">Rank</th>
                            <th className="w-16">No.</th>
                            <th>Contestant</th>
                            <th className="w-32 text-right">Judges Scored</th>
                            <th className="w-32 text-right">Total Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center text-ink-muted">
                                    No scores yet. The leaderboard will populate as judges submit.
                                </td>
                            </tr>
                        ) : (
                            leaderboard.map((entry) => (
                                <tr key={entry.contestantNumber} className={entry.rank <= 3 ? 'is-active' : undefined}>
                                    <td className="num font-semibold">{entry.rank}</td>
                                    <td className="num">#{entry.contestantNumber}</td>
                                    <td className="font-medium">{entry.contestantName}</td>
                                    <td className="num text-right text-ink-secondary">
                                        {entry.submissionCount}
                                    </td>
                                    <td className="num text-right text-base font-semibold">{entry.totalScore.toFixed(2)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};