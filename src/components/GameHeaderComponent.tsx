import React from "react";
import {AppBar, Box, Grid, Toolbar} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { IAppState } from '../interfaces/IAppState';
import BarChartIcon from "@mui/icons-material/BarChart";
import HelpIcon from '@mui/icons-material/Help';
import SettingsIcon from '@mui/icons-material/Settings';
import 'animate.css';

interface Props {
    state: IAppState;
    onButtonClick: any
}

export const  GameHeaderComponent = (props: Props) => {
    return (
        <Box sx={{ flexGrow: 1}} className={'game-header'}>
            <AppBar position="static">
                <Toolbar>
                    <Grid container spacing={2} alignContent={'center'}>
                        <Grid item xs={2} justifyContent={'center'}>
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
                        </Grid>

                        <Grid item xs={8}>
                                <h2>Churdle</h2>
                                <p>{props.state.subHeader}</p>
                        </Grid>

                        <Grid item xs={2}>
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
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </Box>
    )
}
