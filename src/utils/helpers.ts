import {IWordleLetter} from '../interfaces/IWordleLetter';
import {IAppState} from '../interfaces/IAppState';
import {GuessScore, SECONDS_IN_A_DAY} from './constants';
import {ValidWords} from '../word-lists/ValidWords';
import {ChurdleWords} from '../word-lists/ChurdleWords';
import {WinningPhrases} from '../word-lists/WinningPhrases';
import {LosingPhrases} from '../word-lists/LosingPhrases';
import {SubheaderPhrases} from '../word-lists/SubheaderPhrases';
import {GAME_STATUS, ICookieState} from '../interfaces/ICookieState';
import {IGameStats} from '../interfaces/IGameStats';

const LocalStorage = require('localStorage');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

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

    const initialDate = dayjs('2022-03-15').unix();
    const index = Math.floor((dayjs().subtract(initialDate, 's').unix()) / SECONDS_IN_A_DAY);

    return ChurdleWords[index];
}

export const getWinningPhrase = (): string => {
    return WinningPhrases[Math.floor(Math.random() * WinningPhrases.length)];
}

export const getLosingPhrase = (): string => {
    return LosingPhrases[Math.floor(Math.random() * LosingPhrases.length)];
}

export const getSubheaderText = (): string => {
    return SubheaderPhrases[Math.floor(Math.random() * SubheaderPhrases.length)];
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

export const updateCookie = (state: IAppState) => {
    const churdleCookie: ICookieState  = JSON.parse(LocalStorage.getItem('churdleCookie'));

    churdleCookie.gameState = {...state, keyboard: JSONFromMap(state.keyboard)}
    churdleCookie.gameStatus = (state.hasWon || state.guessIndex === 6) ? GAME_STATUS.COMPLETE : GAME_STATUS.IN_PROGRESS
    churdleCookie.lastPlayedTimestamp = dayjs().unix();

    if (state.hasWon || state.guessIndex === 6) {
        updateStats(state, churdleCookie)
        //Have to update timestamps after calculating stats so streaks are calculated correctly
        churdleCookie.previousGameTimestamp = churdleCookie.lastPlayedTimestamp
    }

    LocalStorage.setItem('churdleCookie', JSON.stringify(churdleCookie));
    return;
}

export const updateStats = (state: IAppState, cookie: ICookieState) => {
    const gameStats: IGameStats = cookie.gameStats;

    if (state.hasWon) {
        gameStats.gamesWon += 1;
        gameStats.guessDistribution[state.guessIndex - 1] += 1;

        if (cookie.lastPlayedTimestamp - cookie.previousGameTimestamp < SECONDS_IN_A_DAY) {
            gameStats.currentStreak += 1;
            gameStats.longestStreak = _calculateLongestStreak(gameStats.currentStreak, gameStats.longestStreak);
        }
        else {
            gameStats.longestStreak = _calculateLongestStreak(gameStats.currentStreak, gameStats.longestStreak);
            gameStats.currentStreak = 0;
        }
    }
    else {
        gameStats.gamesLost += 1;
        gameStats.longestStreak = _calculateLongestStreak(gameStats.currentStreak, gameStats.longestStreak);
        gameStats.currentStreak = 0;
    }

    state.gameStats = gameStats;
    return gameStats;
}

export const JSONFromMap = (map: Map<any, number>) => {
    return Array.from(map);
}

export const mapFromData = (JsonData: any) => {
    return new Map(JsonData);
}

//Quick helper function to return the greater of the two values provided... used as a setter for longestStreak
const _calculateLongestStreak = (currentStreak: number, longestStreak: number): number => {
    return (longestStreak >= currentStreak) ? longestStreak : currentStreak;
}
