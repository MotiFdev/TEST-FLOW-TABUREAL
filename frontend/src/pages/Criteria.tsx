import React, { useState, useEffect } from 'react';
import type { Criterion } from '../types/criterion';
import type { Round } from '../types/round';
import {
    getCriteriaApi,
    createCriterionApi,
    updateCriterionApi,
    deleteCriterionApi,
} from '../services/criterionService';
import { getRoundsApi } from '../services/roundService';

export const Criteria: React.FC = () => {
    const [criteria, setCriteria] = useState<Criterion[]>([]);
    const [rounds, setRounds] = useState<Round[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Add form state
    const [roundId, setRoundId] = useState<number>(0);
    const [name, setName] = useState('');
    const [maxScore, setMaxScore] = useState<number>(100);
    const [weightPercentage, setWeightPercentage] = useState<number>(0);

    // Inline edit state (round assignment is fixed at creation, matching the API contract)
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');
    const [editMaxScore, setEditMaxScore] = useState<number>(100);
    const [editWeight, setEditWeight] = useState<number>(0);

    const fetchAll = async () => {
        setLoading(true);
        setError(null);
        try {
            const [roundsData, criteriaData] = await Promise.all([getRoundsApi(), getCriteriaApi()]);
            setRounds(roundsData);
            setCriteria(criteriaData);
            setRoundId((current) =>
                current > 0 ? current : roundsData.length > 0 ? roundsData[0].roundId : 0
            );
        } catch (err: any) {
            setError(err.message || 'Error fetching criteria.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const totalWeightForRound = (targetRoundId: number) =>
        criteria
            .filter((c) => c.roundId === targetRoundId)
            .reduce((sum, c) => sum + c.weightPercentage, 0);

    const selectedRound = rounds.find((r) => r.roundId === roundId);
    const selectedRoundTotal = selectedRound ? totalWeightForRound(selectedRound.roundId) : 0;

    const weightBadgeVariant =
        selectedRoundTotal === 100 ? 'badge-success' : selectedRoundTotal > 100 ? 'badge-danger' : 'badge-warning';
    const weightBadgeLabel =
        selectedRoundTotal === 100
            ? 'complete'
            : selectedRoundTotal > 100
                ? 'over limit'
                : `${Math.round((selectedRoundTotal / 100) * 100)}% assigned`;

    const handleAddCriterion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!roundId || !name) return;
        setError(null);

        try {
            await createCriterionApi({ roundId, name, maxScore, weightPercentage });
            setName('');
            setWeightPercentage(0);
            await fetchAll();
        } catch (err: any) {
            setError(err.message || 'Failed to add criterion.');
        }
    };

    const startEdit = (c: Criterion) => {
        setEditingId(c.criterionId);
        setEditName(c.name);
        setEditMaxScore(c.maxScore);
        setEditWeight(c.weightPercentage);
        setError(null);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setError(null);
    };

    const handleSaveEdit = async (id: number) => {
        setError(null);
        try {
            await updateCriterionApi(id, {
                name: editName,
                maxScore: editMaxScore,
                weightPercentage: editWeight,
            });
            setEditingId(null);
            await fetchAll();
        } catch (err: any) {
            setError(err.message || 'Failed to update criterion.');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this criterion?')) return;
        setError(null);
        try {
            await deleteCriterionApi(id);
            await fetchAll();
        } catch (err: any) {
            setError(err.message || 'Failed to delete criterion.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Criteria & Weights</h2>
                    <p className="page-desc">
                        Define criteria, score limits, and weight distribution per round.
                    </p>
                </div>
                {selectedRound && (
                    <span className={`badge ${weightBadgeVariant}`} title="Weights must total exactly 100% per round">
                        {selectedRound.name}: {selectedRoundTotal}% / 100% ({weightBadgeLabel})
                    </span>
                )}
            </div>

            {error && (
                <div className="alert-error" role="alert">
                    <span className="font-medium">Error:</span>
                    <span>{error}</span>
                </div>
            )}

            {rounds.length === 0 ? (
                <div className="entry-form">
                    <p className="text-sm text-ink-secondary">
                        No rounds defined yet. Create a round on the{' '}
                        <a href="/admin/rounds" className="text-primary hover:underline">
                            Rounds
                        </a>{' '}
                        page before adding criteria.
                    </p>
                </div>
            ) : (
                <form onSubmit={handleAddCriterion} className="entry-form">
                    <div>
                        <label htmlFor="criterion-round" className="field-label">Target round</label>
                        <select
                            id="criterion-round"
                            value={roundId}
                            onChange={(e) => setRoundId(Number(e.target.value))}
                            className="input"
                        >
                            {rounds.map((r) => (
                                <option key={r.roundId} value={r.roundId}>
                                    {r.sequence}. {r.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="criterion-name" className="field-label">
                            Criterion name <span className="text-danger">*</span>
                        </label>
                        <input
                            id="criterion-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Poise & Bearing"
                            className="input w-52"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="criterion-max" className="field-label">Max score</label>
                        <input
                            id="criterion-max"
                            type="number"
                            value={maxScore}
                            onChange={(e) => setMaxScore(Number(e.target.value))}
                            min={0.01}
                            max={999.99}
                            step={0.01}
                            className="input num w-20"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="criterion-weight" className="field-label">Weight (%)</label>
                        <input
                            id="criterion-weight"
                            type="number"
                            value={weightPercentage || ''}
                            onChange={(e) => setWeightPercentage(Number(e.target.value))}
                            placeholder="40"
                            min={0}
                            max={100}
                            step={0.01}
                            className="input num w-20"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Add Criterion
                    </button>
                </form>
            )}

            <div className="overflow-x-auto">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th className="w-40">Round</th>
                            <th>Criterion</th>
                            <th className="w-28 text-right">Max Score</th>
                            <th className="w-28 text-right">Weight</th>
                            <th className="w-32">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="text-center text-ink-muted">
                                    Loading criteria…
                                </td>
                            </tr>
                        ) : criteria.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center text-ink-muted">
                                    No criteria defined yet. Add one above.
                                </td>
                            </tr>
                        ) : (
                            criteria.map((c) =>
                                editingId === c.criterionId ? (
                                    <tr key={c.criterionId}>
                                        <td className="text-ink-secondary">{c.roundName}</td>
                                        <td>
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                className="input h-7 w-full max-w-56 text-xs"
                                                aria-label="Criterion name"
                                                required
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={editMaxScore}
                                                onChange={(e) => setEditMaxScore(Number(e.target.value))}
                                                min={0.01}
                                                max={999.99}
                                                step={0.01}
                                                className="input num h-7 w-20 text-xs"
                                                aria-label="Max score"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={editWeight}
                                                onChange={(e) => setEditWeight(Number(e.target.value))}
                                                min={0}
                                                max={100}
                                                step={0.01}
                                                className="input num h-7 w-20 text-xs"
                                                aria-label="Weight percentage"
                                            />
                                        </td>
                                        <td>
                                            <div className="flex gap-1.5">
                                                <button
                                                    onClick={() => handleSaveEdit(c.criterionId)}
                                                    className="btn btn-primary h-7 px-2.5 text-xs"
                                                >
                                                    Save
                                                </button>
                                                <button onClick={cancelEdit} className="btn btn-secondary h-7 px-2.5 text-xs">
                                                    Cancel
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    <tr key={c.criterionId}>
                                        <td className="text-ink-secondary">{c.roundName}</td>
                                        <td className="font-medium">{c.name}</td>
                                        <td className="num text-right">{c.maxScore}</td>
                                        <td className="num text-right font-medium">{c.weightPercentage}%</td>
                                        <td>
                                            <div className="flex gap-1.5">
                                                <button
                                                    onClick={() => startEdit(c)}
                                                    className="btn btn-secondary h-7 px-2.5 text-xs"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(c.criterionId)}
                                                    className="btn btn-ghost-danger"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};