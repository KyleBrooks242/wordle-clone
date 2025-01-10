import React from "react";
import Paper from "@mui/material/Paper";

interface Props {
    id: string;
    value: string;
    color: number;
    isSelected: boolean;
    className?: string;
}
export const GameTileComponent = (props: Props) => {

    return(
        <Paper id={props.id} className={`game-tile state-${props.color} ${props.className}`} >
            <div className={'game-tile-text'}>{props.value}</div>
        </Paper>
    )
}