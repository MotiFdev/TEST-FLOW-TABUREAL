import type {
    AdminLoginRequest,
    AdminLoginResponse,
    JudgeLoginRequest,
    JudgeLoginResponse,
} from '../types/auth';
import { API_ENDPOINTS } from '../config/api';

export const adminLoginApi = async (credentials: AdminLoginRequest): Promise<AdminLoginResponse> => {
    const response = await fetch(`${API_ENDPOINTS.AUTH}/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Invalid username or password');
    }

    return response.json();
};

export const judgeLoginApi = async (credentials: JudgeLoginRequest): Promise<JudgeLoginResponse> => {
    const response = await fetch(`${API_ENDPOINTS.AUTH}/judge-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Invalid judge number or PIN.');
    }

    return response.json();
};