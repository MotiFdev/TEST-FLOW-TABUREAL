import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Judge } from '../types/judge';
import type { JudgeSession } from '../types/auth';
import { judgeLoginApi } from '../services/authService';
import { getJudgesApi } from '../services/judgeService';

export const JudgeLogin: React.FC = () => {
    const [judges, setJudges] = useState<Judge[]>([]);
    const [judgesLoading, setJudgesLoading] = useState(true);
    const [judgesError, setJudgesError] = useState<string | null>(null);
    const [judgeNumber, setJudgeNumber] = useState<number>(0);
    const [pinCode, setPinCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJudges = async () => {
            setJudgesLoading(true);
            setJudgesError(null);
            try {
                const data = await getJudgesApi();
                setJudges(data);
                if (data.length > 0) {
                    setJudgeNumber(data[0].judgeNumber);
                }
            } catch (err: any) {
                setJudgesError(err.message || 'Could not reach the scoring server.');
            } finally {
                setJudgesLoading(false);
            }
        };
        fetchJudges();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!pinCode.trim()) {
            setError('Please enter your assigned PIN code.');
            return;
        }

        setLoading(true);
        try {
            const session = await judgeLoginApi({ judgeNumber, pinCode });

            // Persist judge session locally to handle offline reconnects
            const sessionData: JudgeSession = {
                ...session,
                authenticatedAt: new Date().toISOString(),
            };
            localStorage.setItem('judge_session', JSON.stringify(sessionData));

            // Navigate to scoring panel
            navigate('/judge/score');
        } catch (err: any) {
            setError(err.message || 'Invalid judge number or PIN.');
        } finally {
            setLoading(false);
        }
    };

    const formDisabled = judgesLoading || judgesError !== null || judges.length === 0;

    return (
        <div className="flex min-h-screen items-center justify-center bg-canvas p-4">
            <div className="auth-panel">
                <div className="border-b border-hairline pb-3">
                    <h1 className="page-title">Judge Login</h1>
                    <p className="page-desc">Offline-enabled scoring terminal.</p>
                </div>

                {judgesError && (
                    <div className="alert-error mt-4" role="alert">
                        <span className="font-medium">Error:</span>
                        <span>{judgesError}</span>
                    </div>
                )}

                {error && (
                    <div className="alert-error mt-4" role="alert">
                        <span className="font-medium">Error:</span>
                        <span>{error}</span>
                    </div>
                )}

                {!judgesLoading && !judgesError && judges.length === 0 ? (
                    <p className="mt-4 text-sm text-ink-secondary">
                        No judge accounts exist yet. Ask the administrator to register judges on the
                        setup console.
                    </p>
                ) : (
                    <form onSubmit={handleLogin} className="mt-4 space-y-4">
                        <div>
                            <label htmlFor="judge-select" className="field-label">Judge</label>
                            <select
                                id="judge-select"
                                value={judgeNumber}
                                onChange={(e) => setJudgeNumber(Number(e.target.value))}
                                className="input num w-full"
                                disabled={formDisabled}
                            >
                                {judges.map((j) => (
                                    <option key={j.judgeId} value={j.judgeNumber}>
                                        #{j.judgeNumber} — {j.fullName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="judge-pin" className="field-label">Access PIN</label>
                            <input
                                id="judge-pin"
                                type="password"
                                maxLength={6}
                                value={pinCode}
                                onChange={(e) => setPinCode(e.target.value)}
                                placeholder="e.g. 1234"
                                className="input num w-full tracking-[0.4em]"
                                autoFocus
                                disabled={formDisabled || loading}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={formDisabled || loading}
                        >
                            {loading ? 'Verifying…' : 'Enter Scoring Panel'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};