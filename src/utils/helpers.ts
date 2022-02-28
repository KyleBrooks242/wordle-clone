import { IWordleLetter } from '../interfaces/IWordleLetter';
import { IAppState } from '../interfaces/IAppState';
import { GuessScore } from './constants';
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
    guessedWord.forEach((letter: IWordleLetter, index) => {
        console.log(`LETTER: ${letter.value}`);
        if (actualWord.includes(letter.value)) {
            console.log(`IS INCLUDED IN WORD`);
            for (const item of wordMap) {
                console.log(`ITEM: ${JSON.stringify(item)}`);
                if (item.letter === letter.value && !item.guessed) {
                    console.log(`CONDITION MET!! ${item.letter}`);
                    if (letter.color === GuessScore.NOT_GUESSED &&
                        tempState.keyboard.get(letter.value) === GuessScore.NOT_GUESSED)
                    {
                        console.log(`FINAL CONDITION MET!!!`);
                        letter.color = GuessScore.WRONG_POSITION;
                        item.guessed = true;
                        tempState.keyboard.set(letter.value, GuessScore.WRONG_POSITION);
                    }

                    break;
                }
            }
        }
        else {
            letter.color = GuessScore.INCORRECT
            if (tempState.keyboard.get(letter.value) === GuessScore.NOT_GUESSED) {
                tempState.keyboard.set(letter.value, GuessScore.INCORRECT);
            }
        }
    })

    //Final loop. Mark everything that is not GREEN or ORANGE as INCORRECT
    guessedWord.forEach((letter: IWordleLetter) => {
        if (letter.color === GuessScore.NOT_GUESSED)
            letter.color = GuessScore.INCORRECT;
    })

    return false;
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
    map.set('delete', 0)
    map.set('enter', 0)
    return map;

}