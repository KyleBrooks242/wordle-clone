import { IAppState } from './IAppState';
import { IGameStats } from './IGameStats';

export enum GAME_STATUS {
    NEW,
    IN_PROGRESS,
    COMPLETE
}

export interface ICookieState {
    gameState: IAppState
    gameStatus: GAME_STATUS
    gameStats: IGameStats
    lastPlayedTimestamp: number
    previousGameTimestamp: number
}