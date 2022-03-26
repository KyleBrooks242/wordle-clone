import React from "react";
import {Box, Button, Container, Dialog, DialogContent, DialogTitle, Divider} from "@mui/material";

interface Props {
    isOpen: boolean
    onCloseClick: any
}

export const SettingsDialogComponent = (props: Props) => {
    return (
        <Dialog
            open={props.isOpen}
            onBackdropClick={() => props.onCloseClick()}
        >
            <DialogTitle>SETTINGS</DialogTitle>
            <DialogContent>
                Here is were the settings content wil go!
            </DialogContent>
        </Dialog>
    )
}