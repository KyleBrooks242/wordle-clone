import React from "react";
import { AppBar, Box, Toolbar, Typography, Button} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {getSubheaderText} from "../utils/helpers";
import {StatsComponent} from "./StatsComponent";

interface Props {
    onClick: any
}

export const  GameHeaderComponent = (props: Props) => {
    return (
        <Box sx={{ flexGrow: 1}} className={'game-header'}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }}>
                        <h2>Churdle</h2>
                        <p>{getSubheaderText()}</p>
                    </Box>

                    <StatsComponent stats={'blah'} onClick={props.onClick}/>
                </Toolbar>
            </AppBar>
        </Box>
    )
}