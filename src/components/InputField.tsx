import React from "react";
import Paper from "@mui/material/Paper";

interface Props {
    value: string;
    color: number;
    isSelected: boolean;
}
export const InputField = (props: Props) => {

    return(
        <Paper elevation={props.isSelected ? 3 : 0} className={`guess-paper state-${props.color}`}>
            <p className={'input-field-text'}>{props.value}</p>
        </Paper>
    )
}