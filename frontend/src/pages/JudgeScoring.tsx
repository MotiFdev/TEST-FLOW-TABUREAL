import React, { useState, useEffect } from 'react';
import { JudgeHeader } from '../components/JudgeHeader';
import { WaitingForRound } from '../components/WaitingForRound';

/* ------------------------------------------------------------------ */
/* Static demo flag — replaced by real active-round state at wiring    */
/* time (API/SignalR). Toggle to false to preview the waiting state.  */
/* ------------------------------------------------------------------ */
const ROUND_OPEN = true;

/* ------------------------------------------------------------------ */
/* Static mock data — UI/layout review only. API wiring comes next.   */
/* ------------------------------------------------------------------ */

interface MockContestant {
    contestantId: number;
    contestantNumber: number;
    fullName: string;
    category: string;
    imageUrl?: string;
    scored?: boolean;
}

interface MockCriterion {
    criterionId: number;
    name: string;
    maxScore: number;
    weightPercentage: number;
}

const PLACEHOLDER_IMAGE =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 160'%3E%3Crect width='120' height='160' fill='%23efeeea'/%3E%3Ccircle cx='60' cy='56' r='24' fill='%23d2d1ca'/%3E%3Cpath d='M18 160c0-27 19-42 42-42s42 15 42 42' fill='%23d2d1ca'/%3E%3C/svg%3E";

const MOCK_CONTESTANTS: MockContestant[] = [
    { contestantId: 1, contestantNumber: 1, fullName: 'Maria Santos', category: 'Category A' },
    { contestantId: 2, contestantNumber: 2, fullName: 'Angelica Reyes', category: 'Category A', scored: true },
    { contestantId: 3, contestantNumber: 3, fullName: 'Sofia Dela Cruz', category: 'Category A' },
    { contestantId: 4, contestantNumber: 4, fullName: 'Isabella Garcia', category: 'Category A' },
    { contestantId: 5, contestantNumber: 5, fullName: 'Camille Mendoza', category: 'Category A' },
    { contestantId: 6, contestantNumber: 6, fullName: 'Rafaela Villanueva', category: 'Category A' },
    { contestantId: 7, contestantNumber: 7, fullName: 'Gabriela Torres', category: 'Category B' },
    { contestantId: 8, contestantNumber: 8, fullName: 'Lucia Fernandez', category: 'Category B' },
    { contestantId: 9, contestantNumber: 9, fullName: 'Carmela Aquino', category: 'Category B' },
    { contestantId: 10, contestantNumber: 10, fullName: 'Beatriz Salazar', category: 'Category B' },
    { contestantId: 11, contestantNumber: 11, fullName: 'Valerie Domingo', category: 'Category B' },
    { contestantId: 12, contestantNumber: 12, fullName: 'Patricia Ramos', category: 'Category B' },
];

const MOCK_CRITERIA: MockCriterion[] = [
    { criterionId: 1, name: 'Poise & Bearing', maxScore: 100, weightPercentage: 40 },
    { criterionId: 2, name: 'Elegance & Carriage', maxScore: 100, weightPercentage: 40 },
    { criterionId: 3, name: 'Overall Impact', maxScore: 100, weightPercentage: 20 },
];

const DENSITY_OPTIONS = [6, 5, 4, 3, 2] as const;

/* ------------------------------------------------------------------ */

export const JudgeScoring: React.FC = () => {
    const [columns, setColumns] = useState<number>(6);
    const [selected, setSelected] = useState<MockContestant | null>(null);
    const [scores, setScores] = useState<Record<number, number>>({});
    const [scoredIds, setScoredIds] = useState<Set<number>>(
        () => new Set(MOCK_CONTESTANTS.filter((c) => c.scored).map((c) => c.contestantId))
    );

    // Close the drawer with Escape
    useEffect(() => {
        if (!selected) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelected(null);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [selected]);

    const openDrawer = (contestant: MockContestant) => {
        setSelected(contestant);
        setScores({});
    };

    const totalEntered = MOCK_CRITERIA.reduce((sum, c) => sum + (scores[c.criterionId] ?? 0), 0);
    const allFilled = MOCK_CRITERIA.every((c) => scores[c.criterionId] !== undefined);

    const handleSubmitScore = () => {
        if (!selected || !allFilled) return;
        // Static demo: mark locally, no API yet
        setScoredIds((prev) => new Set(prev).add(selected.contestantId));
        setSelected(null);
    };

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-canvas">
            <JudgeHeader
                judgeLabel="Judge 1 (John)"
                roundLabel={ROUND_OPEN ? 'Active: Evening Gown' : 'No active round'}
            >
                {/* Card density toggle: 6 → 2 columns */}
                <div
                    className="flex items-center overflow-hidden rounded-md border border-edge"
                    role="group"
                    aria-label="Cards per row"
                >
                    {DENSITY_OPTIONS.map((n) => (
                        <button
                            key={n}
                            onClick={() => setColumns(n)}
                            aria-pressed={columns === n}
                            title={`${n} per row`}
                            className={`num flex h-7 w-8 items-center justify-center border-l border-edge text-xs font-medium transition-colors duration-150 first:border-l-0 ${columns === n
                                ? 'bg-primary-soft text-primary'
                                : 'bg-surface text-ink-secondary hover:bg-canvas'
                                }`}
                        >
                            {n}
                        </button>
                    ))}
                </div>
            </JudgeHeader>

            {/* Contestant card grid — hidden entirely while no round is open */}
            <main className="flex-1 overflow-y-auto p-6">
                {!ROUND_OPEN && <WaitingForRound />}
                {ROUND_OPEN && (
                    <div
                        className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]"
                        style={{ '--cols': columns } as React.CSSProperties}
                    >
                        {MOCK_CONTESTANTS.map((c) => {
                            const isScored = scoredIds.has(c.contestantId);
                            return (
                                <button
                                    key={c.contestantId}
                                    onClick={() => openDrawer(c)}
                                    className="group flex flex-col overflow-hidden rounded-lg border border-edge bg-surface text-left transition-colors duration-150 hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                                >
                                    <div className="relative aspect-[3/4] bg-canvas">
                                        <img
                                            src={c.imageUrl ?? PLACEHOLDER_IMAGE}
                                            alt={`Portrait of ${c.fullName}`}
                                            className="h-full w-full object-cover"
                                        />
                                        <span className="num absolute left-2 top-2 rounded-md bg-ink px-2 py-0.5 text-sm font-semibold text-white">
                                            #{c.contestantNumber}
                                        </span>
                                        {isScored && (
                                            <span className="badge badge-success absolute right-2 top-2">
                                                Scored
                                            </span>
                                        )}
                                    </div>
                                    <div className="border-t border-hairline px-3 py-2">
                                        <p className="truncate text-sm font-medium text-ink">{c.fullName}</p>
                                        <p className="truncate text-xs text-ink-muted">{c.category}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Scoring drawer */}
            {selected && (
                <div className="fixed inset-0 z-40">
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-ink/30"
                        onClick={() => setSelected(null)}
                        aria-hidden="true"
                    />
                    {/* Panel */}
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-label={`Score ${selected.fullName}`}
                        className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col border-l border-edge bg-surface shadow-lg"
                    >
                        <div className="flex items-start justify-between border-b border-hairline px-4 py-3">
                            <div className="flex items-center gap-3">
                                <span className="num rounded-md bg-ink px-2 py-0.5 text-sm font-semibold text-white">
                                    #{selected.contestantNumber}
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-ink">{selected.fullName}</p>
                                    <p className="text-xs text-ink-muted">{selected.category}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelected(null)}
                                className="btn btn-secondary h-7 w-7 p-0 text-xs"
                                aria-label="Close scoring panel"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
                            <p className="text-xs text-ink-secondary">
                                Enter a score per criterion (max shown beside each). Weights are applied
                                automatically during tabulation.
                            </p>
                            {MOCK_CRITERIA.map((criterion) => (
                                <div key={criterion.criterionId}>
                                    <label
                                        htmlFor={`score-${criterion.criterionId}`}
                                        className="field-label flex items-center justify-between"
                                    >
                                        <span>{criterion.name}</span>
                                        <span className="num text-ink-muted">
                                            max {criterion.maxScore} · {criterion.weightPercentage}%
                                        </span>
                                    </label>
                                    <input
                                        id={`score-${criterion.criterionId}`}
                                        type="number"
                                        min={0}
                                        max={criterion.maxScore}
                                        step={0.01}
                                        value={scores[criterion.criterionId] ?? ''}
                                        onChange={(e) =>
                                            setScores((prev) => ({
                                                ...prev,
                                                [criterion.criterionId]: Number(e.target.value),
                                            }))
                                        }
                                        className="input num w-full"
                                        placeholder="0.00"
                                    />
                                </div>
                            ))}

                            <div className="flex items-center justify-between border-t border-hairline pt-3">
                                <span className="text-sm font-medium text-ink-secondary">Total entered</span>
                                <span className="num text-base font-semibold text-ink">
                                    {totalEntered.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 border-t border-hairline px-4 py-3">
                            <button onClick={() => setSelected(null)} className="btn btn-secondary">
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitScore}
                                className="btn btn-primary"
                                disabled={!allFilled}
                                title={allFilled ? 'Save score locally, sync when online' : 'Fill every criterion first'}
                            >
                                Submit Score
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};