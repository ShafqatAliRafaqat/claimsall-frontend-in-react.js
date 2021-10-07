import React from 'react';
import { Bar } from 'react-chartjs-2';

const getBarData = (props) => {
    let { labels, data, colors, keys } = props;

    let datasets = [];
    labels.forEach((label, index) => {
        datasets.push({
            label: label,
            backgroundColor: `rgb(${colors[index]})`,
            borderWidth: 1,
            hoverBackgroundColor: `rgba(${colors[index]}, 0.8)`,
            data: data[index]
        });
    });

    let chartData = {
        labels: keys,
        datasets
    };

    return chartData;
  };

const bar = (props) => {
    if (props.data && props.data.labels) {
        return (
            <div style={{ height: props.height, paddingBottom: '10px' }}>
                <h2>{props.data.mainLabel}</h2>
                <Bar
                    data={getBarData(props.data)}
                    options={{
                        maintainAspectRatio: false,
                        legend: {
                            display: props.displayLegend
                        },
                        scales: {
                            xAxes: [{
                                barPercentage: 1.0,
                                categoryPercentage: 0.5,
                                gridLines: {
                                    display: true
                                }
                            }],
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    callback: function (value) { if (Number.isInteger(value)) { return value; } },
                                    stepSize: 5
                                },
                                gridLines: {
                                    display: true
                                }
                            }]
                        }
                    }}
                />
            </div>
        );
    }
    else {
        return null;
    }
};

export default bar;
