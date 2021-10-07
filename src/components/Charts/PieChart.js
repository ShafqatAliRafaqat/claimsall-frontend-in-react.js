import React from 'react';
import {Pie} from 'react-chartjs-2';
import './charts.css';

const getData = (data, props) => {
    const chartColors = ['#4B7EFE', '#E5E9F2', '#5EC3AB', '#45A7E6', '#3A75AD', '#FFA701', '#F5524C', '#E06476', '#E36AEF', '#B6985C', '#6D6E8A', '#FCCE00', '#F964A0'];
    let colors = [...chartColors];

    let colorIndex = 0;
    while (colors.length < props.labels.length) {
        colors.push(colors[colorIndex]);
        colorIndex = (colorIndex + 1) % chartColors.length;
    }

    return {
        labels: props.labels,
        datasets: [{
            data: data,
            backgroundColor: colors,
            hoverBackgroundColor: colors
        }]
    }
};

const pie = (props) => {
    let options = {maintainAspectRatio: false};

    if (props.labels.length > 2) {
        options.legend = {
            position: 'bottom',
        };
    }

    return (
        <div style={{height: props.height, paddingBottom: '24px'}}>
            <h2>{props.data.mainLabel}</h2>
            <Pie data={getData(props.data, props)} options={options}/>
        </div>
    );
};

export default pie;