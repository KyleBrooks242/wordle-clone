import React from "react";
import BarChartIcon from '@mui/icons-material/BarChart';
import IconButton from '@mui/material/IconButton';

interface Props {
    stats: any;
    onClick: any;
}
export const StatsComponent = (props: Props) => {
    return(
        <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ ml: 2 }}
            onClick={() => props.onClick() }
        >
            <BarChartIcon />
        </IconButton>
    )
}