import type { Criterion, CreateCriterionRequest, UpdateCriterionRequest } from '../types/criterion';
import { API_ENDPOINTS } from '../config/api';

export const getCriteriaApi = async (): Promise<Criterion[]> => {
    const response = await fetch(API_ENDPOINTS.CRITERIA);
    if (!response.ok) throw new Error('Failed to fetch criteria.');
    return response.json();
};

export const createCriterionApi = async (data: CreateCriterionRequest): Promise<Criterion> => {
    const response = await fetch(API_ENDPOINTS.CRITERIA, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to add criterion.');
    }
    return response.json();
};

export const updateCriterionApi = async (id: number, data: UpdateCriterionRequest): Promise<Criterion> => {
    const response = await fetch(`${API_ENDPOINTS.CRITERIA}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update criterion.');
    }
    return response.json();
};

export const deleteCriterionApi = async (id: number): Promise<void> => {
    const response = await fetch(`${API_ENDPOINTS.CRITERIA}/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete criterion.');
    }
};