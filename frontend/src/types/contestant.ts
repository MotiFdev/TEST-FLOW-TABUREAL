export type ContestantStatus = 'Active' | 'Inactive' | 'Disqualified';

export interface Contestant {
    contestantId: number;
    contestantNumber: number;
    fullName: string;
    category: string;
    status: ContestantStatus;
}

export interface CreateContestantRequest {
    contestantNumber: number;
    fullName: string;
    category: string;
    status: ContestantStatus;
}

export interface UpdateStatusRequest {
    status: ContestantStatus;
}