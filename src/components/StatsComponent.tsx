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

interface Props {
    stats: IGameStats;
}
export const StatsComponent = (props: Props) => {
    const { gamesWon, gamesLost, currentStreak, longestStreak, guessDistribution } = props.stats;
    const totalGames = gamesWon + gamesLost;
    const winPercentage = totalGames > 0 ? (gamesWon / totalGames) * 100 : 0;

    // const data = {
    //     '1': guessDistribution[0],
    //     '2': guessDistribution[1],
    //     '3': guessDistribution[2],
    //     '4': guessDistribution[3],
    //     '5': guessDistribution[4],
    //     '6': guessDistribution[5],
    // }

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

            {/*<Graph*/}
            {/*    title='Horizontal Bars'*/}
            {/*    width='50%'*/}
            {/*    data={data}*/}
            {/*    horizontal={true}*/}
            {/*/>*/}

        </Box>
    )
}