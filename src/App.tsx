import React, {useEffect, useState} from 'react';
import './styles/App.scss';
import { InputField } from './InputField'
import { Stack } from "@mui/material";
import {IWordleLetter} from "./interfaces/IWordleLetter";

const WORD_LENGTH = 6;
const NUMBER_OF_GUESSES = 6;

interface IState  {
    guessArray: Array<Array<IWordleLetter>>
    guessIndex: number
    letterIndex: number
    wordToGuess: string
}

const App = () => {

    // useEffect(() => {
    //     async function getWordList() {
    //         await getFullWordList();
    //     }
    //
    //     getWordList();
    // }, []);

    useEffect(() => {
        window.addEventListener('keydown', (event) => {
            let tempState: IState = state;
            let guessArray: Array<Array<IWordleLetter>> = tempState.guessArray

            if (event.key === 'Enter' && state.letterIndex === WORD_LENGTH) {
                //Check if word is valid
                //If valid, score word
                console.log("Enter Key Pressed and word length met");
                calculateCorrectLetters(tempState);
                tempState.guessIndex += 1;
                tempState.letterIndex = 0;
                setState({...tempState} )
                //TODO PREVENT GOING OVER MAX NUMBER OF GUESSES

            }
            else if (event.key === 'Backspace') {
                tempState.letterIndex = ( state.letterIndex === 0 ) ? state.letterIndex : state.letterIndex - 1;
                guessArray[state.guessIndex][state.letterIndex].value = '';
                console.log(tempState.letterIndex);
                console.log("DONE BACKSPACE");
                setState({...tempState})
            }
            else if (event.which >= 65 && event.which <= 90) {
                if (state.letterIndex >= 0 && state.letterIndex <= WORD_LENGTH - 1) {
                    guessArray[state.guessIndex][state.letterIndex].value = event.key;
                    tempState.letterIndex = ( state.letterIndex + 1 > WORD_LENGTH ) ? WORD_LENGTH : state.letterIndex + 1;
                    setState({...tempState});
                }
            }
            console.log(`LEAVING EVENT LISTENER: tempState.letterIndex: ${tempState.letterIndex}`);

        });
    }, [null])


    const calculateCorrectLetters = (tempState: IState) => {
        console.log("Calculating...!")
        const guess = tempState.guessArray[state.guessIndex];
        const word = state.wordToGuess;
        guess.forEach((letter, index) => {
            console.log(`LETTER: ${letter.value} word[index]: ${word[index]}`);
            if (letter.value === word[index]) {
                letter.color = 2
            }
            else if (word.includes(letter.value)) {
                letter.color = 1
            }
        })
    }

    const generateGuessInputs = () => {
        const guessList:Array<any> = [];
        for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
            const guessArray:Array<any> = [];
            for (let j = 0; j < WORD_LENGTH; j++) {
                const value = state.guessArray[i][j].value.toUpperCase()
                const color = state.guessArray[i][j].color
                guessArray.push(<InputField value={value} color={color} key={j}/>)
            }
            guessList.push(<Stack className={'guess-stack'} direction={'row'} spacing={.5} alignItems={'center'} key={i}>{guessArray}</Stack>)

        }
        return guessList;
    }

    const wordToGuess = 'tumors'; //TODO get from random list

    const [state, setState] = useState(
        {
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
            wordToGuess: wordToGuess
        }
    )

    return (
        <div className="App">
          <header className="App-header">
              <body>
                { generateGuessInputs() }
              </body>
          </header>
        </div>
    );
}

export default App;
