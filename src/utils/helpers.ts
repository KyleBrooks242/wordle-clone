import { IWordleLetter } from '../interfaces/IWordleLetter';
import { IAppState } from '../interfaces/IAppState';
import { ValidWords } from '../word-lists/ValidWords';
import { WordleWords } from "../word-lists/WordleWords";
import { WinningPhrases } from "../word-lists/WinningPhrases";
import { LosingPhrases } from '../word-lists/LosingPhrases';


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
    const guessedWord = tempState.guessArray[tempState.guessIndex];
    const actualWord = tempState.wordToGuess;
    const wordMap = actualWord.split('').map(letter => {
        return {
            letter: letter,
            guessed: false
        }
    })
    let correctLetters = 0;

    //Calculate all GREEN first
    guessedWord.forEach((letter: IWordleLetter, position: number) => {
        if (letter.value === wordMap[position].letter) {
            letter.color = 2
            wordMap[position].guessed = true;
            correctLetters++;
            if (tempState.keyboard.get(letter.value) === 0) {
                tempState.keyboard.set(letter.value, 2);
            }
        }
    })

    //Avoid calculating ORANGE if user has already guessed the word.
    if (correctLetters === 6)
        return true;

    //Calculate ORANGE second
    guessedWord.forEach((letter: IWordleLetter) => {
        if (actualWord.includes(letter.value)) {
            for (const item of wordMap) {
                if (item.letter === letter.value && !item.guessed) {
                    letter.color = 1;
                    item.guessed = true;
                    if (tempState.keyboard.get(letter.value) === 0) {
                        tempState.keyboard.set(letter.value, 1);
                    }
                    break;
                }
            }
        }
        else {
            letter.color = 3
            if (tempState.keyboard.get(letter.value) === 0) {
                tempState.keyboard.set(letter.value, 3);
            }
        }
    })

    return false;
}

export const updateKeyboard = (word: string, tempState: IAppState) => {

}

export const isWordValid = (wordGuessed: string): boolean => {
    return ValidWords.includes(wordGuessed);
}

export const getWordToGuess = (): string => {
    return WordleWords[Math.floor(Math.random() * WordleWords.length)];
}

export const getWinningPhrase = (): string => {
    return WinningPhrases[Math.floor(Math.random() * WinningPhrases.length)]
}

export const getLosingPhrase = (): string => {
    return LosingPhrases[Math.floor(Math.random() * LosingPhrases.length)]
}

export const getInitialKeyboardMap = (): Map<string, any> => {

    const map = new Map();
    //ASCII a-z
    for (let i = 97; i < 123; i++) {
        map.set(String.fromCharCode(i), 0);
    }
    map.set('backspace', 0)
    map.set('enter', 0)
    return map;

}