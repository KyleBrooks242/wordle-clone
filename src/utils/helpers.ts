import { IWordleLetter } from '../interfaces/IWordleLetter';
import { IAppState } from '../interfaces/IAppState';
import { GuessScore } from './constants';
import { ValidWords } from '../word-lists/ValidWords';
import { WordleWords } from "../word-lists/WordleWords";
import { WinningPhrases } from "../word-lists/WinningPhrases";
import { LosingPhrases } from '../word-lists/LosingPhrases';
import {SubheaderPhrases} from "../word-lists/SubheaderPhrases";

//Convenience flag for debugging
export const isDebug = false;

/**
 * There may be a more efficient way to do this. Looping over the word twice - first to calculate GREEN tiles, then
 * to calculate ORANGE tiles seems inefficient. However, this avoids bugs in tricky scenarios.
 *
 * For example- Say the word to guess is 'BECAME' and the user guesses 'ACCENT'. If we try to mark both oranges and greens
 * in a single loop, when we come to the first 'C' in 'ACCENT' we will mark it ORANGE. Then we will come to the next 'C' and
 * mark it GREEN. This is a problem, because the first 'C' should not be marked at all.
 * @param tempState
 */
export const scoreGuessedWord = (tempState: IAppState) => {
    const userGuessedWord = tempState.guessArray[tempState.guessIndex];
    const actualWord = tempState.wordToGuess;
    const wordMap = actualWord.split('').map(letter => {
        return {
            letter: letter,
            guessed: false
        }
    })
    let correctLetters = 0;

    //Calculate all GREEN first
    userGuessedWord.forEach((letter: IWordleLetter, position: number) => {
        if (letter.value === wordMap[position].letter) {
            letter.color = GuessScore.CORRECT
            wordMap[position].guessed = true;
            correctLetters++;
            tempState.keyboard.set(letter.value, GuessScore.CORRECT);
        }
    })

    //Avoid calculating ORANGE if user has already guessed the word.
    if (correctLetters === 6)
        return true;

    //Calculate ORANGE second
    userGuessedWord.forEach((userGuessedLetter: IWordleLetter, index) => {
        if (actualWord.includes(userGuessedLetter.value)) {
            for (const wordMapItem of wordMap) {
                if (wordMapItem.letter === userGuessedLetter.value && !wordMapItem.guessed) {
                    let shouldBreak = false;
                    if (userGuessedLetter.color === GuessScore.NOT_GUESSED) {
                        wordMapItem.guessed = true;
                        userGuessedLetter.color = GuessScore.WRONG_POSITION;
                        shouldBreak = true;
                    }
                    if (tempState.keyboard.get(userGuessedLetter.value) === GuessScore.NOT_GUESSED) {
                        wordMapItem.guessed = true;
                        tempState.keyboard.set(userGuessedLetter.value, GuessScore.WRONG_POSITION);
                        shouldBreak = true;
                    }
                    if (shouldBreak) break;
                }
            }
        }
        else {
            userGuessedLetter.color = GuessScore.INCORRECT
            if (tempState.keyboard.get(userGuessedLetter.value) === GuessScore.NOT_GUESSED) {
                tempState.keyboard.set(userGuessedLetter.value, GuessScore.INCORRECT);
            }
        }
    })

    //Final loop. Mark everything that is not GREEN or ORANGE as INCORRECT
    userGuessedWord.forEach((letter: IWordleLetter) => {
        if (letter.color === GuessScore.NOT_GUESSED)
            letter.color = GuessScore.INCORRECT;
    })

    return false;
}

export const isWordValid = (wordGuessed: string): boolean => {

    if (isDebug) {
        console.log("***DEBUG*** isWordValid blindly returning true!!")
        return true;
    }
    return ValidWords.includes(wordGuessed);
}

export const getWordToGuess = (): string => {

    if (isDebug) {
        return 'treaty';

    }
    return WordleWords[Math.floor(Math.random() * WordleWords.length)];
}

export const getWinningPhrase = (): string => {
    return WinningPhrases[Math.floor(Math.random() * WinningPhrases.length)]
}

export const getLosingPhrase = (): string => {
    return LosingPhrases[Math.floor(Math.random() * LosingPhrases.length)]
}

export const getSubheaderText = (): string => {
    return SubheaderPhrases[Math.floor(Math.random() * SubheaderPhrases.length)]
}

export const getInitialKeyboardMap = (): Map<string, any> => {

    const map = new Map();
    //ASCII a-z
    for (let i = 97; i < 123; i++) {
        map.set(String.fromCharCode(i), 0);
    }
    map.set('delete', 0)
    map.set('enter', 0)
    return map;
}

