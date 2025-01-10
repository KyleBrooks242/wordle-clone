import { IChurdleLetter } from "./IChurdleLetter";
import {IGameStats} from "./IGameStats";

export interface IAppState  {
    guessArray: Array<Array<IChurdleLetter>>
    guessIndex: number
    letterIndex: number
    wordToGuess: string
    hasWon: boolean
    keyboard : any //Not typed because it is either a stringified array or map
    subHeader: string
    winningPhrase: string
    losingPhrase: string
    showStats: boolean
    gameStats: IGameStats
    bombMode: boolean;
    bombLetter: string;
}