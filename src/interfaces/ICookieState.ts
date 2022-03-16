export interface ICookieState {
    gameState: {
        guessArray: Array<any>;
        guessIndex: number;
        hasWon: boolean;
        wordToGuess: string;
        showStats: boolean;
    }
    gameStatus: "NEW" | "IN_PROGRESS" | "WIN" | "LOSE";
    numberOfGamesPlayed: number;
    stats: Array<number>;

}