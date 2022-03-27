import React from "react";
import Paper from "@mui/material/Paper";

interface Props {
    id: string;
    value: string;
    color: number;
    isSelected: boolean;
}
export const GameTileComponent = (props: Props) => {

    return(
        <Paper id={props.id} className={`game-tile state-${props.color}`} >
            <div className={'game-tile-text'}>{props.value}</div>
        </Paper>
    )
}