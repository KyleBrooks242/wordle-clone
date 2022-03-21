import React from "react";
import {
    Box,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from '@mui/material';
import { IGameStats } from '../interfaces/IGameStats';
//@ts-ignore
import {Graph} from 'as-basic-bar-chart';
import {BarChartComponent} from "./BarChartComponent";

interface Props {
    stats: IGameStats;
}
export const StatsComponent = (props: Props) => {
    const { gamesWon, gamesLost, currentStreak, longestStreak } = props.stats;
    const totalGames = gamesWon + gamesLost;
    const winPercentage = totalGames > 0 ? (gamesWon / totalGames) * 100 : 0;

    return(
        <Box>
            <h4 className={'stats-header'}>STATS</h4>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Played</TableCell>
                            <TableCell>Win %</TableCell>
                            <TableCell>Current Streak</TableCell>
                            <TableCell>Max Streak</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>{totalGames}</TableCell>
                            <TableCell>{winPercentage}</TableCell>
                            <TableCell>{currentStreak}</TableCell>
                            <TableCell>{longestStreak}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <h4 className={'stats-header'}>GUESS DISTRIBUTION</h4>
            <BarChartComponent stats={props.stats} />
        </Box>
    )
}