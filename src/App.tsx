import React, {useEffect, useState} from 'react';
import './styles/App.scss';
import {GameTileComponent} from './components/GameTileComponent';
import {KeyboardComponent} from './components/KeyboardComponent';
import {IChurdleLetter} from './interfaces/IChurdleLetter';
import {IAppState} from './interfaces/IAppState';
import {GAME_STATUS, ICookieState} from './interfaces/ICookieState';
import {
    animateCSS,
    getInitialKeyboardMap, getLosingPhrase,
    getSubheaderText, getTimeStampRange, getWinningPhrase,
    getWordToGuess, getWordToGuessIndex,
    isWordValid,
    JSONFromMap,
    mapFromData, refreshInvalidCookie,
    scoreGuessedWord,
    updateCookie
} from "./utils/helpers";
import Container from '@mui/material/Container';
import {Divider, Snackbar, Stack} from '@mui/material';
import Div100vh from 'react-div-100vh';
import {GameHeaderComponent} from './components/GameHeaderComponent';
import dayjs from 'dayjs';
import {SQUARE_MAP} from "./utils/constants";
import {StatsDialogComponent} from "./components/StatsDialogComponent";
import clipboard from 'clipboardy';
import {SettingsDialogComponent} from "./components/SettingsDialogComponent";
import {HelpDialogComponent} from "./components/HelpDialogComponent";
import { WORD_LENGTH, NUMBER_OF_GUESSES } from "./utils/constants";
import {IAnimationOptions} from "./interfaces/IAnimationOptions";

const LocalStorage = require('localStorage');

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
    winningPhrase: getWinningPhrase(),
    losingPhrase: getLosingPhrase(),
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
    const [copied, setCopied] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        let churdleCookie: ICookieState  = JSON.parse(LocalStorage.getItem('churdleCookie'));
        const { startTime, endTime } = getTimeStampRange();
        const isActiveChurdleWord = (churdleCookie?.lastPlayedTimestamp > startTime && churdleCookie?.lastPlayedTimestamp < endTime)
        //Cookie found and not expired
        if (churdleCookie && isActiveChurdleWord) {
            churdleCookie.gameState.keyboard = mapFromData(churdleCookie.gameState.keyboard)
            setState({...state, ...churdleCookie.gameState});
        }
        //Cookie found, but 'expired'
        else if (churdleCookie && !isActiveChurdleWord) {
            const refreshedCookie = refreshInvalidCookie(churdleCookie, state);

            LocalStorage.setItem('churdleCookie', JSON.stringify(refreshedCookie));
            setState({...refreshedCookie.gameState})
        }
        //No cookie
        else {
            churdleCookie = {
                gameState: {...state, keyboard: JSONFromMap(state.keyboard)},
                gameStatus: GAME_STATUS.NEW,
                lastPlayedTimestamp: dayjs().unix(),
                previousGameTimestamp: dayjs().unix()
            }
            LocalStorage.setItem('churdleCookie', JSON.stringify(churdleCookie))
        }
    }, []);

    // useEffect(() => {
    //     console.log("RUNNING THIS CODE");
    //
    //     document.addEventListener("keyup", (e) => {
    //         let keyPressed = String(e.key)
    //         handleOnClick(keyPressed);
    //     })
    // }, []);


    const handleOnClick = (keyPressed: string) => {
        const tempState: IAppState = state;
        const guessArray: Array<Array<IChurdleLetter>> = tempState.guessArray;
        const wordGuessed = guessArray[tempState.guessIndex].map((letter) => {
            return letter.value
        }).join('');

        if (state.guessIndex === 6 || state.hasWon) {
            return;
        }

        if (keyPressed === 'Enter' && state.letterIndex === WORD_LENGTH) {
            const guess = document.getElementById(`guess-stack_${state.guessIndex}`);
            //TODO this is where we check for the 'bomb' letter!
            // if (state.hardMode && wordGuessed.includes(state.bombLetter)) {
            //     const options: IAnimationOptions = {
            //         prefix: 'animate__',
            //         repeatTimes: "animate__repeat-2",
            //         duration: '0.8s'
            //     }
            //     animateCSS(guess, 'flash', options);
            // }

            if (isWordValid(wordGuessed)) {
                const hasWon = scoreGuessedWord(state);
                tempState.guessIndex += 1;
                tempState.showStats = (hasWon || state.guessIndex === 6);
                tempState.letterIndex = 0;
                tempState.hasWon = hasWon;
                updateCookie(tempState);
                setState({...tempState} )
            }
            else {
                animateCSS(guess, 'shakeX')
                displayInvalidWord();
            }

        }
        else if (keyPressed === 'Backspace') {
            tempState.letterIndex = ( state.letterIndex === 0 ) ? state.letterIndex : state.letterIndex - 1;
            guessArray[state.guessIndex][state.letterIndex].value = '';
            setState({...tempState})
        }
        else if (keyPressed >= 'a' && keyPressed <= 'z' && keyPressed !== 'Enter') {
            const element = document.getElementById(`game-tile_${state.guessIndex}-${state.letterIndex}`);
            animateCSS(element, 'pulse');
            if (state.letterIndex >= 0 && state.letterIndex <= WORD_LENGTH - 1) {
                guessArray[state.guessIndex][state.letterIndex].value = keyPressed.toLowerCase();
                tempState.letterIndex = ( state.letterIndex + 1 > WORD_LENGTH ) ? WORD_LENGTH : state.letterIndex + 1;
                setState({...tempState});
            }
        }
    }

    const handleHeaderButtonClicked = (button: string) => {

        if (button === 'stats') {
            setState({ ...state, showStats: !state.showStats });
        }
        else if (button === 'help') {
            setShowHelp(!showHelp)
        }
        else if (button === 'settings') {
            setShowSettings(!showSettings)
        }
    }

    const getShareTextHeader = () => {
        const churdleNumber = getWordToGuessIndex();
        return `Churdle #${churdleNumber} ${state.guessIndex}/6\n`
    }

    const handleShareClick = async () => {
        const shareTextHeader = getShareTextHeader()

        let data = `${shareTextHeader}`
        let done = false;
        for (let guesses of state.guessArray) {
            data += '\n';
            for (let guess of guesses) {
                if (done) break;
                if (guess.value === '') {
                    done = true;
                    break;
                }
                else {
                    data += SQUARE_MAP[guess.color]
                }
            }
        }

        data += `\nkylebrooks242.github.io/churdle`
        await clipboard.write(data);
        setCopied(true);
    }

    const generateGuessInputs = () => {
        const guessList:Array<any> = [];
        for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
            const isSelected =  i === state.guessIndex;
            const guessArray:Array<any> = [];
            for (let j = 0; j < WORD_LENGTH; j++) {
                const value = state.guessArray[i][j].value.toUpperCase();
                const color = state.guessArray[i][j].color;
                guessArray.push(<GameTileComponent id={`game-tile_${i}-${j}`} value={value} color={color} isSelected={isSelected} key={j}/>)
            }
            guessList.push(<Stack id={`guess-stack_${i}`} className={`guess-stack`} direction={'row'} spacing={.5} alignItems={'center'} key={i}>{guessArray}</Stack>)

        }
        return guessList;
    }

    const displayInvalidWord = () => {
        setInvalidWord(true);
    }

    return (
        <Div100vh className={'App'}>
            <Container>

                <StatsDialogComponent state={state} onCloseClick={() => handleHeaderButtonClicked('stats')} handleShareClick={() => handleShareClick()}/>
                <SettingsDialogComponent isOpen={showSettings} onCloseClick={() => handleHeaderButtonClicked('settings')}/>
                <HelpDialogComponent isOpen={showHelp} onCloseClick={() => handleHeaderButtonClicked('help')} />

                <Snackbar
                    className={'snackbar failure'}
                    open={invalidWord}
                    message={`Invalid Word!`}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    autoHideDuration={400}
                    onClose={() => setInvalidWord(false)}
                />

                <Snackbar
                    className={'snackbar success'}
                    open={copied}
                    message={`Copied to Clipboard!`}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    autoHideDuration={1000}
                    onClose={() => setCopied(false)}
                />

                <GameHeaderComponent state={state} onButtonClick={(button: string) => handleHeaderButtonClicked(button)}/>

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
