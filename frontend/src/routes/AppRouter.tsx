import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '../layouts/AdminLayout';
import { LiveLeaderboard } from '../pages/LiveLeaderboard';
import { ScoreMonitor } from '../pages/ScoreMonitor';
import { Rounds } from '../pages/Rounds';
import { Criteria } from '../pages/Criteria';
import { Contestants } from '../pages/Contestants';
import { Judges } from '../pages/Judges';
import { JudgeLogin } from '../pages/JudgeLogin';
import { AdminLogin } from '../pages/AdminLogin';
import { JudgeScoring } from '../pages/JudgeScoring';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRouter: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public / Auth Routes */}
                <Route path="/judge/login" element={<JudgeLogin />} />
                <Route path="/judge/score" element={<JudgeScoring />} />
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Protected Admin Dashboard Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<Navigate to="leaderboard" replace />} />
                        <Route path="leaderboard" element={<LiveLeaderboard />} />
                        <Route path="score-monitor" element={<ScoreMonitor />} />
                        <Route path="rounds" element={<Rounds />} />
                        <Route path="criteria" element={<Criteria />} />
                        <Route path="contestants" element={<Contestants />} />
                        <Route path="judges" element={<Judges />} />
                    </Route>
                </Route>

                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/judge/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
};