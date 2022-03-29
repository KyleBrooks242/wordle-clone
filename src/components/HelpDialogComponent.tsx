import React from "react";
import {Box, Button, Container, Dialog, DialogContent, DialogTitle, Divider, Stack} from "@mui/material";
import {WORD_LENGTH} from "../utils/constants";
import {GameTileComponent} from "./GameTileComponent";

interface Props {
    isOpen: boolean
    onCloseClick: any
    hardMode: boolean
}

export const HelpDialogComponent = (props: Props) => {
    return (
        <Dialog
            open={props.isOpen}
            onBackdropClick={() => props.onCloseClick()}
        >
            <DialogTitle>RULES</DialogTitle>
            <DialogContent className={'help-content'}>
                <Divider/>
                <p>Guess the <b>CHURDLE</b> in {WORD_LENGTH} tries.</p>
                <br/>
                <p>Each guess must be a valid {WORD_LENGTH} letter word.</p>
                <br/>
                <p>After each guess, the color of the tile will indicate how close your guess was to the correct word.</p>
                <br/>
                { props.hardMode &&
                <div>
                    <p>In bomb mode, a <b>bomb</b> letter is randomly selected. Guessing the bomb letter will result in the entire guess
                        not being scored.
                    </p>
                    <br/>
                </div>
                }
                <Divider/>
                <p style={{fontWeight: "bold"}}>Examples</p>
                <Stack id={`guess-stack_1`} className={`guess-stack`} direction={'row'} spacing={.5} alignItems={'center'} key={1}>
                    <GameTileComponent className={'example-guess'} id={'example1-1'} value={'P'} color={2} isSelected={false}/>
                    <GameTileComponent className={'example-guess'} id={'example1-2'} value={'O'} color={0} isSelected={false}/>
                    <GameTileComponent className={'example-guess'} id={'example1-3'} value={'C'} color={0} isSelected={false}/>
                    <GameTileComponent className={'example-guess'} id={'example1-4'} value={'K'} color={0} isSelected={false}/>
                    <GameTileComponent className={'example-guess'} id={'example1-5'} value={'E'} color={0} isSelected={false}/>
                    <GameTileComponent className={'example-guess'} id={'example1-6'} value={'T'} color={0} isSelected={false}/>
                </Stack>
                <p style={{fontSize: '.75rem'}}>The letter <b>P</b> is in the word and in the correct spot.</p>

                <Stack id={`guess-stack_2`} className={`guess-stack`} direction={'row'} spacing={.5} alignItems={'center'} key={1}>
                    <GameTileComponent className={'example-guess'} id={'example1-1'} value={'W'} color={0} isSelected={false}/>
                    <GameTileComponent className={'example-guess'} id={'example1-2'} value={'A'} color={0} isSelected={false}/>
                    <GameTileComponent className={'example-guess'} id={'example1-3'} value={'N'} color={1} isSelected={false}/>
                    <GameTileComponent className={'example-guess'} id={'example1-4'} value={'D'} color={0} isSelected={false}/>
                    <GameTileComponent className={'example-guess'} id={'example1-5'} value={'E'} color={0} isSelected={false}/>
                    <GameTileComponent className={'example-guess'} id={'example1-6'} value={'R'} color={0} isSelected={false}/>
                </Stack>
                <p style={{fontSize: '.75rem'}}>The letter <b>N</b> is in the word but in the wrong spot.</p>

                <Stack id={`guess-stack_3`} className={`guess-stack`} direction={'row'} spacing={.5} alignItems={'center'} key={1}>
                    <GameTileComponent className={'example-guess'} id={'example1-1'} value={'R'} color={0} isSelected={false}/>
                    <GameTileComponent className={'example-guess'} id={'example1-2'} value={'A'} color={0} isSelected={false}/>
                    <GameTileComponent className={'example-guess'} id={'example1-3'} value={'N'} color={0} isSelected={false}/>
                    <GameTileComponent className={'example-guess'} id={'example1-4'} value={'D'} color={0} isSelected={false}/>
                    <GameTileComponent className={'example-guess'} id={'example1-5'} value={'O'} color={3} isSelected={false}/>
                    <GameTileComponent className={'example-guess'} id={'example1-6'} value={'M'} color={0} isSelected={false}/>
                </Stack>
                <p style={{fontSize: '.75rem'}}>The letter <b>O</b> is not in the word in any spot.</p>

                { props.hardMode &&
                    <div>
                        <Stack id={`guess-stack_4`} className={`guess-stack`} direction={'row'} spacing={.5} alignItems={'center'} key={1}>
                            <GameTileComponent className={'example-guess'} id={'example1-1'} value={'B'} color={4} isSelected={false}/>
                            <GameTileComponent className={'example-guess'} id={'example1-2'} value={'R'} color={4} isSelected={false}/>
                            <GameTileComponent className={'example-guess'} id={'example1-3'} value={'I'} color={4} isSelected={false}/>
                            <GameTileComponent className={'example-guess'} id={'example1-4'} value={'G'} color={4} isSelected={false}/>
                            <GameTileComponent className={'example-guess'} id={'example1-5'} value={'H'} color={4} isSelected={false}/>
                            <GameTileComponent className={'example-guess'} id={'example1-6'} value={'T'} color={4} isSelected={false}/>
                        </Stack>
                        <p style={{fontSize: '.75rem'}}>One of the letters in <b>BRIGHT</b> was a bomb!</p>
                        <br/>
                    </div>
                }

            <Divider/>
            <br/>
                <p>A new <b>CHURDLE</b> is available at <b>8AM</b>, <b>4PM</b>, and <b>12AM</b> <b>EST</b></p>
            </DialogContent>
        </Dialog>
    )
}