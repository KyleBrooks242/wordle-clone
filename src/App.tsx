import React, {useEffect, useState} from 'react';
import './styles/App.scss';
import { InputComponent } from './components/InputComponent';
import { KeyboardComponent } from './components/KeyboardComponent';
import { IWordleLetter } from './interfaces/IWordleLetter';
import { IAppState } from './interfaces/IAppState';
import { ICookieState } from './interfaces/ICookieState';
import {
    scoreGuessedWord,
    getWinningPhrase,
    getLosingPhrase,
    isWordValid,
    getInitialKeyboardMap,
    getSubheaderText,
    getWordToGuess,
} from "./utils/helpers";
import Container from "@mui/material/Container";
import {
    Stack,
    Snackbar,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent
} from '@mui/material';
import Div100vh from 'react-div-100vh';
import {GameHeaderComponent} from "./components/GameHeaderComponent";
const LocalStorage = require('localStorage');

const WORD_LENGTH = 6;
const NUMBER_OF_GUESSES = 6;

const wordToGuess = getWordToGuess();

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
    keyboard: getInitialKeyboardMap(),
    subHeader: getSubheaderText(),
    showStats: false
}

const App = () => {
    const [state, setState] = useState(
        initialState
    )

    useEffect(() => {
        let churdleCookie: ICookieState  = JSON.parse(LocalStorage.getItem('churdleCookie'));
        if (churdleCookie) {
            console.log("Setting Churdle cookie!");
            console.log("Churdle Cookie: ");
            console.log(churdleCookie);
            setState({...state, ...churdleCookie.gameState});
        }
        else {
            console.log("Creating churdle Cookie!");
            churdleCookie = {
                gameState: {
                    guessArray : [
                        Array.from({length:WORD_LENGTH},()=> ({value: '', color: 0})),
                        Array.from({length:WORD_LENGTH},()=> ({value: '', color: 0})),
                        Array.from({length:WORD_LENGTH},()=> ({value: '', color: 0})),
                        Array.from({length:WORD_LENGTH},()=> ({value: '', color: 0})),
                        Array.from({length:WORD_LENGTH},()=> ({value: '', color: 0})),
                        Array.from({length:WORD_LENGTH},()=> ({value: '', color: 0}))

                    ],
                    guessIndex: 0,
                    wordToGuess: wordToGuess,
                    hasWon: false,
                    showStats: false

                },
                gameStatus: "NEW",
                numberOfGamesPlayed: 0,
                stats: [0,0,0,0,0,0]
            }
            LocalStorage.setItem('churdleCookie', JSON.stringify(churdleCookie))
        }
    }, [])


    const [invalidWord, setInvalidWord] = useState(false);

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
                tempState.guessIndex += 1;
                tempState.letterIndex = 0;
                tempState.hasWon = hasWon;
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

    // const handleStatsClick = () => {
    //     setState({ ...state, showStats: true });
    // }

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

    console.log("Word to guess: ", wordToGuess);

    return (
        <Div100vh className={'App'}>
            <Container>
               {/*<Snackbar*/}
               {/*    className={'snackbar success'}*/}
               {/*    open={state.hasWon || state.guessIndex === 6}*/}
               {/*    message={ state.hasWon ? getWinningPhrase().toUpperCase() : `${getLosingPhrase().toUpperCase()} /\n Word: ${wordToGuess}`}*/}
               {/*    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}*/}
               {/*/>*/}
               <Dialog
                   open={state.showStats}
                   onBackdropClick={() => setState({...state, showStats: false})}
               >
                   <DialogTitle>{ state.hasWon ? getWinningPhrase().toUpperCase() : getLosingPhrase().toUpperCase()}</DialogTitle>
                   <DialogContent>
                       <p>Answer: {wordToGuess.toUpperCase()}</p>

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

                <GameHeaderComponent onClick={() => setState({...state, showStats: true})}/>

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
