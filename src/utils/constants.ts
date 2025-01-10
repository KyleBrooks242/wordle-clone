export const WORD_LENGTH = 6;

export const NUMBER_OF_GUESSES = 6;

export enum GuessScore {
    NOT_GUESSED,
    WRONG_POSITION,
    CORRECT,
    INCORRECT,
    BOMB
}

export enum SQUARE_MAP {
    '⬜',
    '🟧',
    '🟩',
    '⬛️',
    '🟥'
}

export const SECONDS_IN_A_DAY = 86400;

export const SECONDS_PER_GAME = 28800;

export const DAY_SECTIONS = {
    SECTION_ONE_START: 0,
    SECTION_ONE_END: 28800,
    SECTION_TWO_START: 28801,
    SECTION_TWO_END: 57600,
    SECTION_THREE_START: 57601,
    SECTION_THREE_END: 86400
}