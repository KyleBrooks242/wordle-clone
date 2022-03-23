import React from "react";
import {Dialog, DialogContent, DialogTitle, Divider, IconButton, Button, Box, Container} from "@mui/material";
import ShareIcon from '@mui/icons-material/Share';
import {StatsComponent} from "./StatsComponent";
import {IAppState} from "../interfaces/IAppState";
import Countdown, {zeroPad} from 'react-countdown';
import dayjs from "dayjs";
import {getTimeStampRange} from "../utils/helpers";

interface Props {
    state: IAppState,
    handleStatsClick: any,
    handleShareClick: any,

}

interface RendererProps {
    hours: number
    minutes: number
    seconds: number
    completed: boolean
    zeroPadTime: number
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

    const renderer: any = (renderer: RendererProps) => {
        if (renderer.completed) {
            return <span>CHURDLE TIME</span>;
        } else {
            return <span>{zeroPad(renderer.hours)}:{zeroPad(renderer.minutes)}:{zeroPad(renderer.seconds)}</span>;
        }
    };

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
                            <p>Next churdle in:</p>
                            <Countdown
                                date={getTimeStampRange(true)}
                                zeroPadTime={2}
                                renderer={renderer}
                            >
                                <p>Hello!</p>
                            </Countdown>
                        </Box>

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