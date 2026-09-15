import React, { useState, useEffect } from 'react';
import type { Contestant, ContestantStatus } from '../types/contestant';
import {
    getContestantsApi,
    createContestantApi,
    updateContestantStatusApi,
    deleteContestantApi,
} from '../services/contestantService';

const statusBadgeClass = (status: ContestantStatus) =>
    status === 'Active' ? 'badge-success' : status === 'Inactive' ? 'badge-neutral' : 'badge-danger';

export const Contestants: React.FC = () => {
    const [contestants, setContestants] = useState<Contestant[]>([]);
    const [number, setNumber] = useState<number>(1);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState<ContestantStatus>('Active');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchContestants = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getContestantsApi();
            setContestants(data);
            setNumber(data.length > 0 ? Math.max(...data.map((c) => c.contestantNumber)) + 1 : 1);
        } catch (err: any) {
            setError(err.message || 'Error fetching contestants.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContestants();
    }, []);

    const handleAddContestant = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !number) return;
        setError(null);

        try {
            await createContestantApi({
                contestantNumber: number,
                fullName: name,
                category,
                status,
            });
            setName('');
            setCategory('');
            setStatus('Active');
            await fetchContestants();
        } catch (err: any) {
            setError(err.message || 'Failed to add contestant.');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this contestant?')) return;
        setError(null);
        try {
            await deleteContestantApi(id);
            await fetchContestants();
        } catch (err: any) {
            setError(err.message || 'Failed to delete contestant.');
        }
    };

    const handleStatusToggle = async (id: number, newStatus: ContestantStatus) => {
        setError(null);
        try {
            await updateContestantStatusApi(id, newStatus);
            setContestants(
                contestants.map((c) => (c.contestantId === id ? { ...c, status: newStatus } : c))
            );
        } catch (err: any) {
            setError(err.message || 'Failed to update status.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Contestants</h2>
                    <p className="page-desc">
                        Register contestant numbers, names, and eligibility status linked to judge score
                        submissions.
                    </p>
                </div>
            </div>

            {error && (
                <div className="alert-error" role="alert">
                    <span className="font-medium">Error:</span>
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleAddContestant} className="entry-form">
                <div>
                    <label htmlFor="contestant-number" className="field-label">No.</label>
                    <input
                        id="contestant-number"
                        type="number"
                        value={number}
                        onChange={(e) => setNumber(Number(e.target.value))}
                        className="input num w-20"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="contestant-name" className="field-label">
                        Full name <span className="text-danger">*</span>
                    </label>
                    <input
                        id="contestant-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Maria Santos"
                        className="input w-60"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="contestant-category" className="field-label">Category / group</label>
                    <input
                        id="contestant-category"
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="e.g. Category A"
                        className="input w-48"
                    />
                </div>
                <div>
                    <label htmlFor="contestant-status" className="field-label">Status</label>
                    <select
                        id="contestant-status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as ContestantStatus)}
                        className="input"
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Disqualified">Disqualified</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">
                    Add Contestant
                </button>
            </form>

            <div className="overflow-x-auto">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th className="w-16">No.</th>
                            <th>Full Name</th>
                            <th>Category</th>
                            <th className="w-36">Status</th>
                            <th className="w-24">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="text-center text-ink-muted">
                                    Loading contestants…
                                </td>
                            </tr>
                        ) : contestants.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center text-ink-muted">
                                    No contestants registered yet. Add the first one above.
                                </td>
                            </tr>
                        ) : (
                            contestants.map((c) => (
                                <tr key={c.contestantId}>
                                    <td className="num font-medium">#{c.contestantNumber}</td>
                                    <td className="font-medium">{c.fullName}</td>
                                    <td className="text-ink-secondary">{c.category || '—'}</td>
                                    <td>
                                        <select
                                            value={c.status}
                                            onChange={(e) =>
                                                handleStatusToggle(c.contestantId, e.target.value as ContestantStatus)
                                            }
                                            className={`input h-7 w-32 text-xs ${statusBadgeClass(c.status)}`}
                                            aria-label={`Change status for ${c.fullName}`}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                            <option value="Disqualified">Disqualified</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleDelete(c.contestantId)}
                                            className="btn btn-ghost-danger"
                                        >
                                            Delete
                                        </button>
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