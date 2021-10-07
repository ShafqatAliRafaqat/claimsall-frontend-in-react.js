import React from 'react';
import { Doughnut } from 'react-chartjs-2';


const getChartData = (props) => {
    let data = {};
    let datasets = [];
    let _obj = {};

    _obj.data = props.data;
    _obj.backgroundColor = props.colors;
    datasets.push(_obj);

    data.labels = props.labels;
    data.datasets = datasets;

    return data;
};

const doughnut = (props) => {
    if (props.data && props.labels && props.colors) {
        return (
                <div style={{ height: props.height, marginBottom: '12px' }}>
                    <Doughnut
                        data={getChartData(props)}
                        options={{
                            maintainAspectRatio: false,
                            legend: {
                                position: 'right'
                            },
                            cutoutPercentage: 50
                        }}
                    />
                </div>
        );
    }
    else {
        return null;
    }
};

export default doughnut;