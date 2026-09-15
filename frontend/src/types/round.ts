export interface Round {
    roundId: number;
    sequence: number;
    name: string;
    isActive: boolean;
}

export interface CreateRoundRequest {
    sequence?: number;
    name: string;
}