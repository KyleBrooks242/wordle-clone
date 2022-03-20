import React, {useEffect, useState} from 'react';
import './styles/App.scss';
import {InputComponent} from './components/InputComponent';
import {KeyboardComponent} from './components/KeyboardComponent';
import {IWordleLetter} from './interfaces/IWordleLetter';
import {IAppState} from './interfaces/IAppState';
import {GAME_STATUS, ICookieState} from './interfaces/ICookieState';
import {
    getInitialKeyboardMap,
    getLosingPhrase,
    getSubheaderText,
    getWinningPhrase,
    getWordToGuess,
    isWordValid,
    JSONFromMap,
    mapFromData,
    scoreGuessedWord,
    updateCookie,
} from "./utils/helpers";
import Container from '@mui/material/Container';
import {Dialog, DialogContent, DialogTitle, Divider, Snackbar, Stack} from '@mui/material';
import Div100vh from 'react-div-100vh';
import {GameHeaderComponent} from './components/GameHeaderComponent';
import dayjs from 'dayjs';
import {StatsComponent} from "./components/StatsComponent";
import {TEST_COOKIE} from "./utils/constants";

const LocalStorage = require('localStorage');

const WORD_LENGTH = 6;
const NUMBER_OF_GUESSES = 6;

const wordToGuess = getWordToGuess();
const keyboard = getInitialKeyboardMap();
const subheader = getSubheaderText()

const initialState: IAppState = {
    guessArray : [
        Array.from({length:WORD_LENGTH},()=> ({value: '', color: 0})),
        Array.from({length:WORD_LENGTH},()=> ({value: '', color: 0})),
        Array.from({length:WORD_LENGTH},()=> ({value: '', color: 0})),
        Array.from({length:WORD_LENGTH},()=> ({value: '', color: 0})),
        Array.from({length:WORD_LENGTH},()=> ({value: '', color: 0})),
        Array.from({length:WORD_LENGTH},()=> ({value: '', color: 0}))

    ],
    guessIndex: 0,
    letterIndex: 0,
    wordToGuess: wordToGuess,
    hasWon: false,
    keyboard: keyboard,
    subHeader: subheader,
    showStats: false,
    gameStats: {
        currentStreak: 0,
        longestStreak: 0,
        gamesWon: 0,
        gamesLost: 0,
        guessDistribution: [0,0,0,0,0,0]
    }
}

const App = () => {
    const [state, setState] = useState(
        initialState
    )

    const [invalidWord, setInvalidWord] = useState(false);

    useEffect(() => {
        let churdleCookie: ICookieState  = JSON.parse(LocalStorage.getItem('churdleCookie'));
        const startTime = dayjs().startOf('day').unix();
        const endTime = dayjs().endOf('day').unix();
        const isValidCookie = (churdleCookie?.lastPlayedTimestamp > startTime && churdleCookie?.lastPlayedTimestamp < endTime)
        if (churdleCookie && isValidCookie) {
            churdleCookie.gameState.keyboard = mapFromData(churdleCookie.gameState.keyboard)
            setState({...state, ...churdleCookie.gameState, gameStats: {...churdleCookie.gameStats}});
        }
        else {
            churdleCookie = {
                gameState: {...state, keyboard: JSONFromMap(state.keyboard)},
                gameStatus: GAME_STATUS.NEW,
                gameStats: {
                    currentStreak: 0,
                    longestStreak: 0,
                    gamesWon: 0,
                    gamesLost: 0,
                    guessDistribution: [0,0,0,0,0,0]
                },
                lastPlayedTimestamp: dayjs().unix(),
                previousGameTimestamp: dayjs().unix()
            }
            LocalStorage.setItem('churdleCookie', JSON.stringify(churdleCookie))
        }
    }, []);


    const handleOnClick = (letter: string) => {
        const tempState: IAppState = state;
        const guessArray: Array<Array<IWordleLetter>> = tempState.guessArray;
        const wordGuessed = guessArray[tempState.guessIndex].map((letter) => {
            return letter.value
        }).join('');

        if (state.guessIndex === 6 || state.hasWon) {
            return;
        }

        if (letter === 'enter' && state.letterIndex === WORD_LENGTH) {
            if (isWordValid(wordGuessed)) {
                const hasWon = scoreGuessedWord(state);
                tempState.showStats = hasWon;
                tempState.guessIndex += 1;
                tempState.letterIndex = 0;
                tempState.hasWon = hasWon;
                updateCookie(tempState);
                setState({...tempState} )
            }
            else {
                displayInvalidWord();
            }

        }
        else if (letter === 'delete') {
            tempState.letterIndex = ( state.letterIndex === 0 ) ? state.letterIndex : state.letterIndex - 1;
            guessArray[state.guessIndex][state.letterIndex].value = '';
            setState({...tempState})
        }
        else if (letter >= 'a' && letter <= 'z' && letter !== 'enter') {
            if (state.letterIndex >= 0 && state.letterIndex <= WORD_LENGTH - 1) {
                guessArray[state.guessIndex][state.letterIndex].value = letter.toLowerCase();
                tempState.letterIndex = ( state.letterIndex + 1 > WORD_LENGTH ) ? WORD_LENGTH : state.letterIndex + 1;
                setState({...tempState});
            }
        }
    }

    const handleStatsClick = () => {
        setState({ ...state, showStats: !state.showStats });
    }

    const generateGuessInputs = () => {
        const guessList:Array<any> = [];
        for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
            const isSelected =  i === state.guessIndex;
            const guessArray:Array<any> = [];
            for (let j = 0; j < WORD_LENGTH; j++) {
                const value = state.guessArray[i][j].value.toUpperCase();
                const color = state.guessArray[i][j].color;
                guessArray.push(<InputComponent value={value} color={color} isSelected={isSelected} key={j}/>)
            }
            guessList.push(<Stack className={`guess-stack`} direction={'row'} spacing={.5} alignItems={'center'} key={i}>{guessArray}</Stack>)

        }
        return guessList;
    }

    const displayInvalidWord = () => {
        setInvalidWord(false);
    }

    const getStatsDialogTitle = ():string => {
        if (state.hasWon) {
            return getWinningPhrase()
        }
        else if (!state.hasWon && state.guessIndex === 6) {
            return getLosingPhrase()
        }
        else {
            return "KEEP ON CHURDLING..."
        }
    }

    return (
        <Div100vh className={'App'}>
            <Container>
               <Dialog
                   open={state.showStats || (!state.hasWon && state.guessIndex ===6)}
                   onBackdropClick={() => handleStatsClick()}
               >
                   <DialogTitle>{getStatsDialogTitle().toUpperCase()}</DialogTitle>
                   <DialogContent>
                       {(!state.hasWon && state.guessIndex === 6) && <p>Answer: {wordToGuess.toUpperCase()}</p>}
                       <Divider/>
                       <StatsComponent stats={state.gameStats} />
                   </DialogContent>
               </Dialog>

                <Snackbar
                    className={'snackbar failure'}
                    open={invalidWord}
                    message={`Invalid Word!`}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    autoHideDuration={400}
                    onClose={() => setInvalidWord(false)}
                />

                <GameHeaderComponent state={state} onStatsClick={handleStatsClick}/>

                <Divider/>
                <Container>
                    { generateGuessInputs() }
                </Container>
                <KeyboardComponent state={state} onClick={handleOnClick} />
            </Container>
        </Div100vh>
    )
}

export default App;
