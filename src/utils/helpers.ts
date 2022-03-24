import {IChurdleLetter} from '../interfaces/IChurdleLetter';
import {IAppState} from '../interfaces/IAppState';
import {DAY_SECTIONS, GuessScore, SECONDS_IN_A_DAY, SECONDS_PER_GAME, SQUARE_MAP} from './constants';
import {ValidWords} from '../word-lists/ValidWords';
import {ChurdleWords} from '../word-lists/ChurdleWords';
import {WinningPhrases} from '../word-lists/WinningPhrases';
import {LosingPhrases} from '../word-lists/LosingPhrases';
import {SubheaderPhrases} from '../word-lists/SubheaderPhrases';
import {GAME_STATUS, ICookieState} from '../interfaces/ICookieState';
import {IGameStats} from '../interfaces/IGameStats';
import clipboard from "clipboardy";

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
    userGuessedWord.forEach((letter: IChurdleLetter, position: number) => {
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
    userGuessedWord.forEach((userGuessedLetter: IChurdleLetter, index) => {
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
    userGuessedWord.forEach((letter: IChurdleLetter) => {
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

/**
 * The simplest way I can think to do this is set a hard 'initial date'
 * and count up from there. To get 3 Churdles a day, we can divide a day into 3 sections and calculate
 * an additional offset based on what the current time is when the user plays.
 */
export const getWordToGuess = ():string => {

    if (isDebug) {
        return 'treaty';
    }

    const initialDate = dayjs('2022-03-15').unix();
    const index = Math.floor((dayjs().subtract(initialDate, 's').unix()) / SECONDS_IN_A_DAY);
    const offset = _calculateOffset();

    return ChurdleWords[index + offset];
}

export const getWordToGuessIndex = () => {
    const initialDate = dayjs('2022-03-15').unix();
    const index = Math.floor((dayjs().subtract(initialDate, 's').unix()) / SECONDS_IN_A_DAY);
    const offset = _calculateOffset();

    return index + offset;
}

/**
 * Takes timestamp and determines which section of the day it falls within
 */
export const getTimeStampRange = (forCountdown: boolean = false) => {
    const offset = _calculateOffset();
    let startTime, endTime;

    if (offset === 0 ) {
        startTime = dayjs().startOf('day').unix();
        endTime = dayjs().startOf('day').add(DAY_SECTIONS.SECTION_ONE_END, 's').unix();
    }
    else if (offset === 1) {
        startTime = dayjs().startOf('day').add(DAY_SECTIONS.SECTION_TWO_START, 's').unix();
        endTime = dayjs().startOf('day').add(DAY_SECTIONS.SECTION_TWO_END, 's').unix();
    }
    else {
        startTime = dayjs().startOf('day').add(DAY_SECTIONS.SECTION_THREE_START, 's').unix();
        endTime = dayjs().endOf('day').unix();
    }
    console.log(dayjs(endTime * 1000).format('YYYY-MM-DD_T_HH:mm:ss'));

    return forCountdown ? dayjs(endTime * 1000).valueOf() :  { startTime, endTime }
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

export const refreshInvalidCookie = (cookie: ICookieState, newInitialState: IAppState) => {
    //Update stats with existing data to correctly calculate winning streaks
    const gameState: IAppState = cookie.gameState;
    updateStats(cookie.gameState, cookie, true);

    gameState.guessArray= newInitialState.guessArray;
    gameState.guessIndex = newInitialState.guessIndex;
    gameState.letterIndex = newInitialState.letterIndex;
    gameState.wordToGuess = newInitialState.wordToGuess;
    gameState.hasWon = false;
    gameState.keyboard = newInitialState.keyboard;
    gameState.subHeader = newInitialState.subHeader;
    gameState.winningPhrase = newInitialState.winningPhrase;
    gameState.losingPhrase = newInitialState.losingPhrase;
    gameState.showStats = false;
    gameState.gameStats = cookie.gameState.gameStats

    cookie.gameState = gameState;
    cookie.gameStatus = GAME_STATUS.NEW;
    cookie.lastPlayedTimestamp = dayjs().unix();
    cookie.previousGameTimestamp = dayjs().unix();

    return cookie;

}

export const updateStats = (state: IAppState, cookie: ICookieState, isRefreshCookie: boolean = false) => {
    const gameStats: IGameStats = cookie.gameState.gameStats;
    const timeDiff = dayjs().unix() - cookie.lastPlayedTimestamp;

    //In the scenario fo a refresh cookie where the user has not played the previous game at all,
    //we don't want to add a win or a loss. We just want to reset the streaks
    if (isRefreshCookie && (timeDiff > (SECONDS_PER_GAME * 2)) ) {
        gameStats.longestStreak = _calculateLongestStreak(gameStats.currentStreak, gameStats.longestStreak);
        gameStats.currentStreak = 0;
    }

    else if (state.hasWon && (timeDiff <= SECONDS_PER_GAME) ) {
        gameStats.gamesWon += 1;
        gameStats.guessDistribution[state.guessIndex - 1] += 1;

        if (cookie.lastPlayedTimestamp - cookie.previousGameTimestamp <= SECONDS_PER_GAME) {
            gameStats.currentStreak += 1;
            gameStats.longestStreak = _calculateLongestStreak(gameStats.currentStreak, gameStats.longestStreak);
        }
        else {
            gameStats.longestStreak = _calculateLongestStreak(gameStats.currentStreak, gameStats.longestStreak);
            gameStats.currentStreak = 0;
        }
    }
    else {
        gameStats.gamesLost +=1;
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

/**
 * A day is 86400 seconds. This divides that into 3 sections and returns the section the current time
 * falls within
 * @private
 */
const _calculateOffset = () => {
    const timeDifference = dayjs().unix() - dayjs().startOf('day').unix();

    let offset;
    if (timeDifference <= DAY_SECTIONS.SECTION_ONE_END) {
        offset = 0;
    }
    else if (timeDifference >= DAY_SECTIONS.SECTION_TWO_START && timeDifference <= DAY_SECTIONS.SECTION_TWO_END) {
        offset = 1;
    }
    else {
        offset = 2;
    }

    return offset;
}
