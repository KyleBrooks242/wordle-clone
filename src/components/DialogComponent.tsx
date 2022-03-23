import React from "react";
import {Dialog, DialogContent, DialogTitle, Divider, IconButton, Button, Box, Container} from "@mui/material";
import ShareIcon from '@mui/icons-material/Share';
import {StatsComponent} from "./StatsComponent";
import {IAppState} from "../interfaces/IAppState";

interface Props {
    state: IAppState,
    handleStatsClick: any,
    handleShareClick: any,

}

export const DialogComponent = (props: Props) => {
    const state = props.state;
    const wordToGuess = state.wordToGuess;

    const getStatsDialogTitle = ():string => {
        if (state.hasWon) {
            return state.winningPhrase;
        }
        else if (!state.hasWon && state.guessIndex === 6) {
            return state.losingPhrase;
        }
        else {
            return "KEEP ON CHURDLING..."
        }
    }

    return (
        <Dialog
            open={state.showStats}
            onBackdropClick={() => props.handleStatsClick()}
        >
            <DialogTitle>{getStatsDialogTitle().toUpperCase()}</DialogTitle>
            <DialogContent>
                {(!state.hasWon && state.guessIndex === 6) && <p>Answer: {wordToGuess.toUpperCase()}</p>}
                <Divider/>
                <StatsComponent stats={state.gameStats} />
                { (state.hasWon || state.guessIndex === 6) &&
                    <Container className={'share-content'}>
                        <Box className={'churdle-timer'}>
                            <p>Next churdle in...</p>
                            <p>02:15</p>
                        </Box>
                        <Box>
                            <Button
                                className={'share-button'}
                                variant={'contained'}
                                endIcon={<ShareIcon />}
                                onClick={() => props.handleShareClick()}
                            >
                            Share
                            </Button>
                        </Box>
                    </Container>
                }
            </DialogContent>
        </Dialog>
    )
}