import React, { useState } from 'react';

interface ScoreSubmission {
    id: string;
    submissionUuid: string;
    timestamp: string;
    judgeName: string;
    contestantNumber: number;
    contestantName: string;
    round: string;
    score: number;
    status: 'Synced' | 'Pending' | 'Failed';
}

const statusBadgeClass = (status: ScoreSubmission['status']) =>
    status === 'Synced' ? 'badge-success' : status === 'Pending' ? 'badge-warning' : 'badge-danger';

const statusLabel = (status: ScoreSubmission['status']) =>
    status === 'Pending' ? 'Pending (IndexedDB)' : status;

export const ScoreMonitor: React.FC = () => {
    // Mock data representing incoming score submissions from judges
    const [submissions] = useState<ScoreSubmission[]>([
        {
            id: '1',
            submissionUuid: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            timestamp: '2026-09-13 19:42:01',
            judgeName: 'Judge 1 (John)',
            contestantNumber: 1,
            contestantName: 'Contestant Alpha',
            round: 'Round 1 - Evening Gown',
            score: 95.0,
            status: 'Synced',
        },
        {
            id: '2',
            submissionUuid: '9c8b7a65-4321-4def-9876-543210fedcba',
            timestamp: '2026-09-13 19:42:15',
            judgeName: 'Judge 2 (Maria)',
            contestantNumber: 1,
            contestantName: 'Contestant Alpha',
            round: 'Round 1 - Evening Gown',
            score: 94.0,
            status: 'Synced',
        },
        {
            id: '3',
            submissionUuid: '123e4567-e89b-12d3-a456-426614174000',
            timestamp: '2026-09-13 19:43:05',
            judgeName: 'Judge 3 (Alex)',
            contestantNumber: 2,
            contestantName: 'Contestant Bravo',
            round: 'Round 1 - Evening Gown',
            score: 91.5,
            status: 'Pending', // Stored in IndexedDB, waiting for server sync
        },
        {
            id: '4',
            submissionUuid: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
            timestamp: '2026-09-13 19:43:20',
            judgeName: 'Judge 1 (John)',
            contestantNumber: 2,
            contestantName: 'Contestant Bravo',
            round: 'Round 1 - Evening Gown',
            score: 89.0,
            status: 'Synced',
        },
    ]);

    const syncedCount = submissions.filter((s) => s.status === 'Synced').length;
    const pendingCount = submissions.filter((s) => s.status === 'Pending').length;

    return (
        <div className="space-y-6">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Score Monitor</h2>
                    <p className="page-desc">
                        Real-time feed of scores saved to local IndexedDB and SQL Server.
                    </p>
                </div>
                <div className="flex gap-2">
                    <span className="badge badge-success">Synced: {syncedCount}</span>
                    <span className="badge badge-warning">Pending: {pendingCount}</span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Submission UUID</th>
                            <th>Timestamp</th>
                            <th>Judge</th>
                            <th>Contestant</th>
                            <th>Round / Segment</th>
                            <th className="w-20 text-right">Score</th>
                            <th className="w-44">Sync Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {submissions.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center text-ink-muted">
                                    No score submissions received yet.
                                </td>
                            </tr>
                        ) : (
                            submissions.map((sub) => (
                                <tr key={sub.submissionUuid}>
                                    <td className="num max-w-56 truncate text-xs text-ink-muted" title={sub.submissionUuid}>
                                        {sub.submissionUuid}
                                    </td>
                                    <td className="num text-ink-secondary">{sub.timestamp}</td>
                                    <td className="font-medium">{sub.judgeName}</td>
                                    <td>
                                        <span className="num">#{sub.contestantNumber}</span> — {sub.contestantName}
                                    </td>
                                    <td className="text-ink-secondary">{sub.round}</td>
                                    <td className="num text-right font-semibold">{sub.score.toFixed(1)}</td>
                                    <td>
                                        <span className={`badge ${statusBadgeClass(sub.status)}`}>
                                            {statusLabel(sub.status)}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};