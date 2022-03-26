import React from "react";
import {Box, Button, Container, Dialog, DialogContent, DialogTitle, Divider} from "@mui/material";

interface Props {
    isOpen: boolean
    onCloseClick: any
}

export const HelpDialogComponent = (props: Props) => {
    return (
        <Dialog
            open={props.isOpen}
            onBackdropClick={() => props.onCloseClick()}
        >
            <DialogTitle>ABOUT CHURDLE</DialogTitle>
            <DialogContent>
                Here is were the help content will go.
            </DialogContent>
        </Dialog>
    )
}