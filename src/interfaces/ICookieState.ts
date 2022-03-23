import { IAppState } from './IAppState';

export enum GAME_STATUS {
    NEW,
    IN_PROGRESS,
    COMPLETE
}

export interface ICookieState {
    gameState: IAppState
    gameStatus: GAME_STATUS
    lastPlayedTimestamp: number
    previousGameTimestamp: number
}