import React from "react";
import Paper from "@mui/material/Paper";

interface Props {
    value: string;
    color: number;
    isSelected: boolean;
}
export const InputComponent = (props: Props) => {

    return(
        <Paper className={`guess-paper state-${props.color}`}>
            <div className={'input-field-text'}>{props.value}</div>
        </Paper>
    )
}