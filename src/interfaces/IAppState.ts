import { IWordleLetter } from "./IWordleLetter";

export interface IAppState  {
    guessArray: Array<Array<IWordleLetter>>
    guessIndex: number
    letterIndex: number
    wordToGuess: string
    hasWon: boolean
    keyboard : Map<any, number>;
    subHeader: string
}