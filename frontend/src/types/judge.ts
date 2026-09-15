export interface Judge {
    judgeId: number;
    judgeNumber: number;
    fullName: string;
    pinCode: string;
    assignedRound: string;
}

export interface CreateJudgeRequest {
    fullName: string;
    assignedRound: string;
}

export interface UpdateJudgeRequest {
    fullName: string;
    assignedRound: string;
}