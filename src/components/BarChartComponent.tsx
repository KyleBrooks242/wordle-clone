import React from "react";
import {
    Box
} from '@mui/material';
import { IGameStats } from '../interfaces/IGameStats';



interface Props {
    stats: IGameStats;
}
export const BarChartComponent = (props: Props) => {
    const distribution = props.stats.guessDistribution;
    const totalGames = props.stats.gamesWon + props.stats.gamesLost;

    const createBarChart = (data: Array<number>) => {
        const chart:Array<any> = [];

        for (let i = 0; i < data.length; i++) {
            const timesWon = data[i];
            const style = (timesWon > 0) ? `calc(100% / ${totalGames / timesWon})` : 0;

            chart.push(
                <div className={'bar-chart-rectangle'} style={{'width': `${style}`}} key={i}>
                    <div className={'bar-chart-outer-label'}>{i + 1}|</div>
                    <div className={'bar-chart-inner-value'}>{timesWon}</div>
                </div>
            )
        }
        return chart
    }

    return(
        <Box>
            { createBarChart(distribution) }
        </Box>
    )
}