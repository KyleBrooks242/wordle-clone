import React from "react";
import { AppBar, Box, Toolbar} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { IAppState } from '../interfaces/IAppState';
import BarChartIcon from "@mui/icons-material/BarChart";

interface Props {
    state: IAppState;
    onStatsClick: any
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
                        <p>{props.state.subHeader}</p>
                    </Box>

                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ ml: 2 }}
                        onClick={() => props.onStatsClick() }
                    >
                        <BarChartIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
    )
}