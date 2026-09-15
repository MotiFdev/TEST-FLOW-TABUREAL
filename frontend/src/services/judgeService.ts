import type { Judge, CreateJudgeRequest, UpdateJudgeRequest } from '../types/judge';
import { API_ENDPOINTS } from '../config/api';

export const getJudgesApi = async (): Promise<Judge[]> => {
    const response = await fetch(API_ENDPOINTS.JUDGES);
    if (!response.ok) throw new Error('Failed to fetch judges.');
    return response.json();
};

export const createJudgeApi = async (data: CreateJudgeRequest): Promise<Judge> => {
    const response = await fetch(API_ENDPOINTS.JUDGES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to add judge.');
    }
    return response.json();
};

export const updateJudgeApi = async (id: number, data: UpdateJudgeRequest): Promise<Judge> => {
    const response = await fetch(`${API_ENDPOINTS.JUDGES}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update judge.');
    }
    return response.json();
};

export const deleteJudgeApi = async (id: number): Promise<void> => {
    const response = await fetch(`${API_ENDPOINTS.JUDGES}/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete judge.');
    }
};