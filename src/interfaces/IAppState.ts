import { IWordleLetter } from "./IWordleLetter";
import {IGameStats} from "./IGameStats";

export interface IAppState  {
    guessArray: Array<Array<IWordleLetter>>
    guessIndex: number
    letterIndex: number
    wordToGuess: string
    hasWon: boolean
    keyboard : any //Not typed because it is either a stringified array or map
    subHeader: string
    showStats: boolean
    gameStats: IGameStats
}