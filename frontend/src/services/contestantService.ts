import type { Contestant, CreateContestantRequest, ContestantStatus } from '../types/contestant';
import { API_ENDPOINTS } from '../config/api';

export const getContestantsApi = async (): Promise<Contestant[]> => {
    const response = await fetch(API_ENDPOINTS.CONTESTANTS);
    if (!response.ok) throw new Error('Failed to fetch contestants.');
    return response.json();
};

export const createContestantApi = async (data: CreateContestantRequest): Promise<Contestant> => {
    const response = await fetch(API_ENDPOINTS.CONTESTANTS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create contestant.');
    }
    return response.json();
};

export const updateContestantStatusApi = async (id: number, status: ContestantStatus): Promise<void> => {
    const response = await fetch(`${API_ENDPOINTS.CONTESTANTS}/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update contestant status.');
    }
};

export const deleteContestantApi = async (id: number): Promise<void> => {
    const response = await fetch(`${API_ENDPOINTS.CONTESTANTS}/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete contestant.');
    }
};