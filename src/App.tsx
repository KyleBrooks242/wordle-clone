import React, {useEffect, useState} from 'react';
import './styles/App.scss';
import 'animate.css';
import { GameTileComponent } from './components/GameTileComponent';
import { KeyboardComponent } from './components/KeyboardComponent';
import { IChurdleLetter } from './interfaces/IChurdleLetter';
import { IAppState } from './interfaces/IAppState';
import { GAME_STATUS } from './interfaces/ICookieState';
import {
    animateCSS,
    customExplosionAnimation,
    getCookie,
    getInitialKeyboardMap,
    getLosingPhrase,
    getSubheaderText,
    getWinningPhrase,
    getWordToGuessAndBombLetter,
    getWordToGuessIndex,
    isWordValid,
    refreshAndSetInvalidCookie,
    scoreGuessedWord, setCookie,
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

const { wordToGuess, bombLetter } = getWordToGuessAndBombLetter();
const keyboard = getInitialKeyboardMap();
const subheader = getSubheaderText();
const winningPhrase = getWinningPhrase();
const losingPhrase = getLosingPhrase();

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
    winningPhrase: winningPhrase,
    losingPhrase: losingPhrase,
    showStats: false,
    bombMode: false,
    bombLetter: bombLetter,
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

    /**
     * This happens once, when the page is loaded/refreshed
     */
    useEffect(() => {
        let churdleCookie = getCookie();
        //Cookie found and not expired
        if (churdleCookie && churdleCookie.gameState.wordToGuess === state.wordToGuess) {
            console.log('VALID COOKIE');
            setState({...state, ...churdleCookie.gameState});
        }
        //Cookie found, but 'expired'
        else if (churdleCookie && churdleCookie.gameState.wordToGuess !== state.wordToGuess) {
            console.log('NOT valid cookie!!')
            const refreshedCookie = refreshAndSetInvalidCookie(churdleCookie, state);

            setState({...refreshedCookie.gameState})
        }
        //No cookie
        else {
            console.log('NO COOKIE')
            churdleCookie = {
                gameState: { ...state },
                gameStatus: GAME_STATUS.NEW,
                lastPlayedTimestamp: dayjs().unix(),
                previousGameTimestamp: dayjs().unix()
            }
            setCookie(churdleCookie)
        }
    }, []);

    const handleOnClick = async (keyPressed: string) => {
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
            let hasWon: boolean = false;
            let hasBomb: boolean = false;

            if (isWordValid(wordGuessed)) {
                if (state.bombMode && wordGuessed.includes(state.bombLetter)) {
                    hasBomb = true;
                    hasWon = scoreGuessedWord(state, true);
                }
                else {
                    hasWon = scoreGuessedWord(state);
                }

                await animateCSS(guess, 'flash',hasBomb ? '0.8s' : '1.6s');

                if (hasBomb) {
                    const elements: Array<any> = [];
                    for (let i = 0; i < 6; i++) {
                        elements.push(document.getElementById(`game-tile_${state.guessIndex}-${i}`));
                        console.log('animating!!');
                    }
                    await customExplosionAnimation(elements, 'particle', '1.2s');

                }
                else {
                    await animateCSS(guess, 'fadeIn','0.8s');
                }
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

        else if (button === 'bombMode')
            setState({...state, bombMode: !state.bombMode})
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

    console.log(state.wordToGuess)
    console.log(state.bombLetter)

    return (
        <Div100vh className={'App'}>
            <Container>

                <StatsDialogComponent state={state} onCloseClick={() => handleHeaderButtonClicked('stats')} handleShareClick={() => handleShareClick()}/>
                <SettingsDialogComponent bombMode={state.bombMode} onBombModeClick={() => handleHeaderButtonClicked('bombMode')} isOpen={showSettings} onCloseClick={() => handleHeaderButtonClicked('settings')}/>
                <HelpDialogComponent hardMode={state.bombMode} isOpen={showHelp} onCloseClick={() => handleHeaderButtonClicked('help')} />

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
