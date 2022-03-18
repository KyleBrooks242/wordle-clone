export interface ICookieState {
    gameState: {
        guessArray: Array<any>;
        guessIndex: number;
        hasWon: boolean;
        wordToGuess: string;
        showStats: boolean;
        keyboard: any;
    }
    gameStatus: "NEW" | "IN_PROGRESS" | "COMPLETE";
    numberOfGamesPlayed: number;
    stats: Array<number>;
    lastPlayedTimestamp: number

}