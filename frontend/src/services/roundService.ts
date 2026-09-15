import type { Round, CreateRoundRequest } from '../types/round';
import { API_ENDPOINTS } from '../config/api';

export const getRoundsApi = async (): Promise<Round[]> => {
    const response = await fetch(API_ENDPOINTS.ROUNDS);
    if (!response.ok) throw new Error('Failed to fetch competition rounds.');
    return response.json();
};

export const createRoundApi = async (data: CreateRoundRequest): Promise<Round> => {
    const response = await fetch(API_ENDPOINTS.ROUNDS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create round.');
    }
    return response.json();
};

export const setActiveRoundApi = async (id: number): Promise<void> => {
    const response = await fetch(`${API_ENDPOINTS.ROUNDS}/${id}/set-active`, {
        method: 'PATCH',
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to set active round.');
    }
};

export const deleteRoundApi = async (id: number): Promise<void> => {
    const response = await fetch(`${API_ENDPOINTS.ROUNDS}/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete round.');
    }
};