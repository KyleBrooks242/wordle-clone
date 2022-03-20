export interface IGameStats {
    currentStreak: number;
    longestStreak: number;
    gamesWon: number;
    gamesLost: number
    guessDistribution: Array<number>
}