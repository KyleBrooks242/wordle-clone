import React, {useEffect, useState} from 'react';
import './styles/App.scss';
import { InputField } from './InputField'
import { Stack } from '@mui/material';
import {IWordleLetter} from './interfaces/IWordleLetter';
import { ValidWords } from './word-lists/ValidWords';
import { WordleWords } from './word-lists/WordleWords';

const WORD_LENGTH = 6;
const NUMBER_OF_GUESSES = 6;

interface IState  {
    guessArray: Array<Array<IWordleLetter>>
    guessIndex: number
    letterIndex: number
    wordToGuess: string
}

const wordToGuess = WordleWords[Math.floor(Math.random() * 501)];

const App = () => {

    //TODO Don't double mark letters
    //Don't allow more than 6 guesses (display a 'You lose' screen of some sort)
    useEffect(() => {
        window.addEventListener('keydown', (event) => {
            const tempState: IState = state;
            const guessArray: Array<Array<IWordleLetter>> = tempState.guessArray;
            //TODO could this be .reduce?
            const wordGuessed = guessArray[tempState.guessIndex].map((letter) => {
                return letter.value
            }).join('');


            if (event.key === 'Enter' && state.letterIndex === WORD_LENGTH) {
                // console.log("Enter Key Pressed and word length met");
                console.log(`tempState.wordToGuess: ${tempState.wordToGuess}`)
                if (isWordValid(wordGuessed)) {
                    calculateCorrectLetters(state);
                    tempState.guessIndex += 1;
                    tempState.letterIndex = 0;
                    setState({...tempState} )
                    //TODO PREVENT GOING OVER MAX NUMBER OF GUESSES
                }
                else {
                    console.log(`Not a valid word!`);
                }

            }
            else if (event.key === 'Backspace') {
                tempState.letterIndex = ( state.letterIndex === 0 ) ? state.letterIndex : state.letterIndex - 1;
                guessArray[state.guessIndex][state.letterIndex].value = '';
                console.log(tempState.letterIndex);
                setState({...tempState})
            }
            else if (event.which >= 65 && event.which <= 90) {
                if (state.letterIndex >= 0 && state.letterIndex <= WORD_LENGTH - 1) {
                    guessArray[state.guessIndex][state.letterIndex].value = event.key;
                    tempState.letterIndex = ( state.letterIndex + 1 > WORD_LENGTH ) ? WORD_LENGTH : state.letterIndex + 1;
                    setState({...tempState});
                }
            }
            // console.log(`LEAVING EVENT LISTENER: tempState.letterIndex: ${tempState.letterIndex}`);

        });
    }, []);


    const isWordValid = (wordGuessed: string) => {
        return ValidWords.includes(wordGuessed);
    }

    const calculateCorrectLetters = (tempState: IState) => {
        const guess = tempState.guessArray[state.guessIndex];
        const word = tempState.wordToGuess;
        const wordMap = tempState.wordToGuess.split('').map(letter => {
            return {
                letter: letter,
                guessed: false
            }
        })
        guess.forEach((letter, index) => {
            console.log(`LETTER: ${letter.value} word[index]: ${wordMap[index].letter}`);
            if (letter.value === wordMap[index].letter && !wordMap[index].guessed) {
                letter.color = 2
                wordMap[index].guessed = true;
            }
            //TODO this is messed up :(
            else if (word.includes(letter.value)) {
                console.log("THIS HAPPENS")
                const index = wordMap.findIndex((element: any) => (element.letter = letter.value && !element.guessed))
                if (index >= 0) {
                    console.log(`${JSON.stringify(wordMap[index])}`)
                    console.log("THIS ALSO HAPPENS")
                    letter.color = 1
                    wordMap[index].guessed = true;

                }
            }
            console.log(JSON.stringify(wordMap[index]));
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
            // wordToGuess: wordToGuess
            wordToGuess: "pickle"
        }
    )

    console.log("Word to guess: ", wordToGuess)

    return (
        <div className={'App'}>
          <header className={'App-header'}>
                <h2>CHURDLE</h2>
                <h4>WORDLE, BUT WORSE</h4>
                { generateGuessInputs() }
          </header>
        </div>
    );
}

export default App;
