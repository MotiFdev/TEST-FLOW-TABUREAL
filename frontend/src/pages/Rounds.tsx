import React, { useState, useEffect } from 'react';
import type { Round } from '../types/round';
import {
    getRoundsApi,
    createRoundApi,
    setActiveRoundApi,
    deleteRoundApi,
} from '../services/roundService';

export const Rounds: React.FC = () => {
    const [rounds, setRounds] = useState<Round[]>([]);
    const [newRoundName, setNewRoundName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRounds = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getRoundsApi();
            setRounds(data);
        } catch (err: any) {
            setError(err.message || 'Error fetching rounds.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRounds();
    }, []);

    const handleSetActive = async (id: number) => {
        setError(null);
        try {
            await setActiveRoundApi(id);
            setRounds(rounds.map((r) => ({ ...r, isActive: r.roundId === id })));
        } catch (err: any) {
            setError(err.message || 'Failed to set active round.');
        }
    };

    const handleAddRound = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newRoundName) return;
        setError(null);

        try {
            await createRoundApi({
                sequence: rounds.length + 1,
                name: newRoundName,
            });
            setNewRoundName('');
            await fetchRounds();
        } catch (err: any) {
            setError(err.message || 'Failed to add round.');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this round?')) return;
        setError(null);
        try {
            await deleteRoundApi(id);
            await fetchRounds();
        } catch (err: any) {
            setError(err.message || 'Failed to delete round.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Rounds</h2>
                    <p className="page-desc">
                        Manage competition rounds and select which round is currently active for judges.
                    </p>
                </div>
            </div>

            {error && (
                <div className="alert-error" role="alert">
                    <span className="font-medium">Error:</span>
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleAddRound} className="entry-form">
                <div>
                    <label htmlFor="round-name" className="field-label">
                        Round name <span className="text-danger">*</span>
                    </label>
                    <input
                        id="round-name"
                        type="text"
                        value={newRoundName}
                        onChange={(e) => setNewRoundName(e.target.value)}
                        placeholder="e.g. Swimwear"
                        className="input w-60"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Add Round
                </button>
            </form>

            <div className="overflow-x-auto">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th className="w-16">Order</th>
                            <th>Round Name</th>
                            <th className="w-36">Status</th>
                            <th className="w-44">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="text-center text-ink-muted">
                                    Loading rounds…
                                </td>
                            </tr>
                        ) : rounds.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center text-ink-muted">
                                    No rounds set up yet. Add the first round above.
                                </td>
                            </tr>
                        ) : (
                            rounds.map((round) => (
                                <tr key={round.roundId} className={round.isActive ? 'is-active' : undefined}>
                                    <td className="num">{round.sequence}</td>
                                    <td className="font-medium">{round.name}</td>
                                    <td>
                                        {round.isActive ? (
                                            <span className="badge badge-success">Active</span>
                                        ) : (
                                            <span className="badge badge-neutral">Inactive</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            {!round.isActive && (
                                                <button
                                                    onClick={() => handleSetActive(round.roundId)}
                                                    className="btn btn-secondary h-7 px-2.5 text-xs"
                                                >
                                                    Set as Active
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(round.roundId)}
                                                className="btn btn-ghost-danger"
                                            >
                                                Delete
                                            </button>
                                        </div>
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