import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminLoginApi } from '../services/authService';

export const AdminLogin: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await adminLoginApi({ username, password });

            // Store session details locally
            localStorage.setItem('admin_session', JSON.stringify({
                adminId: response.adminId,
                username: response.username,
                authenticatedAt: new Date().toISOString()
            }));

            // Direct navigation on HTTP 200 OK
            navigate('/admin/leaderboard');
        } catch (err: any) {
            setError(err.message || 'An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-canvas p-4">
            <div className="auth-panel">
                <div className="border-b border-hairline pb-3">
                    <h1 className="page-title">Admin Login</h1>
                    <p className="page-desc">Enter system administrator credentials.</p>
                </div>

                {error && (
                    <div className="alert-error mt-4" role="alert">
                        <span className="font-medium">Error:</span>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleLogin} className="mt-4 space-y-4">
                    <div>
                        <label htmlFor="admin-username" className="field-label">
                            Username <span className="text-danger">*</span>
                        </label>
                        <input
                            id="admin-username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="admin"
                            className="input w-full"
                            disabled={loading}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="admin-password" className="field-label">
                            Password <span className="text-danger">*</span>
                        </label>
                        <input
                            id="admin-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="input w-full"
                            disabled={loading}
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading} className="btn btn-primary w-full">
                        {loading ? 'Authenticating…' : 'Login as Admin'}
                    </button>
                </form>

                <div className="mt-4 border-t border-hairline pt-3 text-center">
                    <Link to="/judge/login" className="text-sm text-primary hover:underline">
                        Switch to Judge Login
                    </Link>
                </div>
            </div>
        </div>
    );
};