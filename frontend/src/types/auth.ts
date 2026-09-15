export interface AdminLoginRequest {
    username: string;
    password: string;
}

export interface AdminLoginResponse {
    message: string;
    adminId: number;
    username: string;
}

export interface JudgeLoginRequest {
    judgeNumber: number;
    pinCode: string;
}

export interface JudgeLoginResponse {
    judgeId: number;
    judgeNumber: number;
    fullName: string;
    assignedRound: string;
}

/** Persisted in localStorage as `judge_session` to survive offline reconnects. */
export interface JudgeSession extends JudgeLoginResponse {
    authenticatedAt: string;
}