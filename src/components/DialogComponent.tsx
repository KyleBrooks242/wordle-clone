import React from "react";
import {Dialog, DialogContent, DialogTitle, Divider, IconButton, Button, Box, Container} from "@mui/material";
import ShareIcon from '@mui/icons-material/Share';
import CloseIcon from "@mui/icons-material/Close";
import {StatsComponent} from "./StatsComponent";
import {getLosingPhrase, getWinningPhrase} from "../utils/helpers";
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
            return getWinningPhrase()
        }
        else if (!state.hasWon && state.guessIndex === 6) {
            return getLosingPhrase()
        }
        else {
            return "KEEP ON CHURDLING..."
        }
    }

    const shareButtonProps = {
        url: "https://kylebrooks242.github.io/churdle/",
        network: "Facebook",
        text: "Give Churdle a Try!",
        longtext:
            "Here is where we will put your churdle score"
    };

    return (
        <Dialog
            open={state.showStats || (!state.hasWon && state.guessIndex === 6)}
            onBackdropClick={() => props.handleStatsClick()}
        >
            <IconButton
                onClick={() => props.handleStatsClick()}
                sx={{
                    position: 'absolute',
                    right: 4,
                    top: 4,
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogTitle>{getStatsDialogTitle().toUpperCase()}</DialogTitle>
            <DialogContent>
                {(!state.hasWon && state.guessIndex === 6) && <p>Answer: {wordToGuess.toUpperCase()}</p>}
                <Divider/>
                <StatsComponent stats={state.gameStats} />
                { (state.hasWon || state.guessIndex === 6) &&
                    <Container className={'share-content'}>
                        <Button
                            className={'share-button'}
                            variant={'contained'}
                            endIcon={<ShareIcon />}
                            onClick={() => props.handleShareClick()}
                        >
                        Share
                        </Button>
                    </Container>
                }
            </DialogContent>
        </Dialog>
    )
}