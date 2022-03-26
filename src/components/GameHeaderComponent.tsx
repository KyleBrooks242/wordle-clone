import React from "react";
import { AppBar, Box, Toolbar} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { IAppState } from '../interfaces/IAppState';
import BarChartIcon from "@mui/icons-material/BarChart";
import HelpIcon from '@mui/icons-material/Help';
import SettingsIcon from '@mui/icons-material/Settings';

interface Props {
    state: IAppState;
    onButtonClick: any
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
                        onClick={() => props.onButtonClick('help') }
                    >
                        <HelpIcon />
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }}>
                        <h2>Churdle</h2>
                        <p>{props.state.subHeader}</p>
                    </Box>

                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="stats"
                        sx={{ ml: 2 }}
                        onClick={() => props.onButtonClick('stats') }
                    >
                        <BarChartIcon />
                    </IconButton>

                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="settings"
                        sx={{ ml: 2 }}
                        onClick={() => props.onButtonClick('settings') }
                    >
                        <SettingsIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
    )
}