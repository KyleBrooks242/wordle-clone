export interface ICookieState {
    gameState: {
        guessArray: Array<any>;
        guessIndex: number;
        hasWon: boolean;
        wordToGuess: string;
        showStats: boolean;
        keyboard?: Map<any, number>
    }
    gameStatus: "NEW" | "IN_PROGRESS" | "COMPLETE";
    numberOfGamesPlayed: number;
    stats: Array<number>;
    lastPlayedTimestamp: number

}