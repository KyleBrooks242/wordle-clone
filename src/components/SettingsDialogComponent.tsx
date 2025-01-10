import React from "react";
import {
    Box,
    Button,
    Container,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    FormControlLabel, FormGroup,
    Switch
} from "@mui/material";

interface Props {
    isOpen: boolean
    onCloseClick: any
    onBombModeClick: any
    bombMode: boolean
}

export const SettingsDialogComponent = (props: Props) => {
    return (
        <Dialog
            open={props.isOpen}
            onBackdropClick={() => props.onCloseClick()}
        >
            <DialogTitle>SETTINGS</DialogTitle>
            <DialogContent>
                <Divider/>
                <FormGroup>
                    <FormControlLabel control={<Switch onClick={() => props.onBombModeClick()} checked={props.bombMode} />} label="Bomb Mode (WIP)" />
                </FormGroup>
            </DialogContent>
        </Dialog>
    )
}