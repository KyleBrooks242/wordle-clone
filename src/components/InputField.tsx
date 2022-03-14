import React from "react";
import Paper from "@mui/material/Paper";

interface Props {
    value: string;
    color: number;
    isSelected: boolean;
}
export const InputField = (props: Props) => {

    return(
        <Paper elevation={props.isSelected ? 2 : 0} className={`guess-paper state-${props.color}`}>
            <div className={'input-field-text'}>{props.value}</div>
        </Paper>
    )
}