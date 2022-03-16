import React from "react";
import { IAppState } from '../interfaces/IAppState';
import { Stack, Button } from "@mui/material";
import { BackspaceOutlined, InputOutlined } from '@mui/icons-material';

interface Props {
    state: IAppState
    onClick: any
}

const keyboardRows = [
    ['q','w','e','r','t','y','u','i','o','p'],
    ['a','s','d','f','g','h','j','k','l'],
    ['enter','z','x','c','v','b','n','m','delete']
]
export const KeyboardComponent = (props: Props) => {

    const generateKeyboard = () => {
        const stateKeyboard = props.state.keyboard;
        const keyboard: Array<any> = [];
        for (let i = 0; i < keyboardRows.length; i++) {
            const row:Array<any> = [];
            for (let j = 0; j < keyboardRows[i].length; j++) {
                const letter = keyboardRows[i][j];

                if (letter === 'delete') {
                    row.push(<Button
                        className={`state-${stateKeyboard.get(letter)}`}
                        variant={'contained'}
                        key={letter}
                        onClick={() => { props.onClick(letter) }}
                    >
                        <BackspaceOutlined />
                    </Button>)
                }
                else if (letter === 'enter') {
                    row.push(<Button
                        className={`state-${stateKeyboard.get(letter)}`}
                        variant={'contained'}
                        key={letter}
                        onClick={() => { props.onClick(letter) }}
                    >
                        <InputOutlined />
                    </Button>)
                }
                else {
                    row.push(<Button
                        className={`state-${stateKeyboard.get(letter)}`}
                        variant={'contained'}
                        key={letter}
                        onClick={() => { props.onClick(letter) }}
                    >{letter}
                    </Button>)
                }
            }
            keyboard.push(<Stack className={`keyboard-stack`} direction={'row'} spacing={.5} alignItems={'center'} key={i}>{row}</Stack>)
        }

        return keyboard;
    }

    return(
        <div className={'keyboard-grid'}>
            {generateKeyboard()}
        </div>

    )
}