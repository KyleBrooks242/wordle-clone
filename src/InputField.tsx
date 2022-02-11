import React from "react";
import Box from "@mui/material/Box";

interface Props {
    value: string;
    color: number;
}
export const InputField = (props: Props) => {

    return(
        <Box className={`guess-box state-${props.color}`}>
            <div>
                <p className={'input-field-text'}>{props.value}</p>
            </div>
        </Box>
    )
}