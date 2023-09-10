export interface Game {
    firstPlayer: {
        UserName: string;
    };
    secondPlayer: {
        UserName: string;
    };
    firstPlayerScore: number;
    secondPlayerScore: number;
    createdAt: string;
    id: number;
}
