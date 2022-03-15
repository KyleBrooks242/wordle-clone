export enum GuessScore {
    NOT_GUESSED,
    WRONG_POSITION,
    CORRECT,
    INCORRECT
}

export interface Stats {
    boardState: Array<string>;
    gameStatus: "NEW" | "IN_PROGRESS" | "WIN" | "LOSE";
    numberOfGamesPlayed: number;

}