import React, {useEffect, useState} from 'react';
import './styles/App.scss';
import { InputField } from './components/InputField';
import { Keyboard } from './components/Keyboard';
import { IWordleLetter } from './interfaces/IWordleLetter';
import { IAppState } from './interfaces/IAppState';
import Snackbar from "@mui/material/Snackbar";
import {
    scoreGuessedWord,
    getWinningPhrase,
    getLosingPhrase,
    isWordValid,
    getInitialKeyboardMap, getSubheaderText, getWordToGuess,
} from "./utils/helpers";
import Container from "@mui/material/Container";
import { Stack } from '@mui/material';

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
    subHeader: getSubheaderText()
}

const App = () => {

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
                console.log('Invalid Word!');
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


    const generateGuessInputs = () => {
        const guessList:Array<any> = [];
        for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
            const isSelected =  i === state.guessIndex;
            const guessArray:Array<any> = [];
            for (let j = 0; j < WORD_LENGTH; j++) {
                const value = state.guessArray[i][j].value.toUpperCase();
                const color = state.guessArray[i][j].color;
                guessArray.push(<InputField value={value} color={color} isSelected={isSelected} key={j}/>)
            }
            guessList.push(<Stack className={`guess-stack`} direction={'row'} spacing={.5} alignItems={'center'} key={i}>{guessArray}</Stack>)

        }
        return guessList;
    }

    const displayInvalidWord = () => {
        return 'TODO'
    }

    const [state, setState] = useState(
        initialState
    )

    console.log("Word to guess: ", wordToGuess)

    return (
        <header className={'App'}>
            <Container>
               <Snackbar
                   open={state.hasWon || state.guessIndex === 6}
                   message={ state.hasWon ? getWinningPhrase() : getLosingPhrase()}
                   anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
               />
                <h1>CHURDLE</h1>
                <h3>{state.subHeader}</h3>
                <Container>
                    { generateGuessInputs() }
                </Container>
                <Keyboard state={state} onClick={handleOnClick} />
            </Container>
        </header>
    )
}

export default App;
