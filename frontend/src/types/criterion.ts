export interface Criterion {
    criterionId: number;
    roundId: number;
    roundName: string;
    name: string;
    maxScore: number;
    weightPercentage: number;
}

export interface CreateCriterionRequest {
    roundId: number;
    name: string;
    maxScore: number;
    weightPercentage: number;
}

export interface UpdateCriterionRequest {
    name: string;
    maxScore: number;
    weightPercentage: number;
}