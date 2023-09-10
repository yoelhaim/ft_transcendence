
export class CreateGameDto {
    firstPlayerId: number;
    secondPlayerId: number;
}

export class UpdateGameDto {
    id: number;
    firstPlayerScore: number;
    secondPlayerScore: number;
}