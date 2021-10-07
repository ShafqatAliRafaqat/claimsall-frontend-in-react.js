import React from 'react';
import {Row, Col, Spin} from 'antd';
import BarChart from '../Charts/BarChart';
import PieChart from '../Charts/PieChart';
import axios from '../../utils/axios';
import './stats-card.css';
import serverConfig from '../../config/config.json';
import DateRange from '../DateRange/DatePopover';
import moment from 'moment';
import {connect} from 'react-redux';

class StatsCard extends React.Component {

    state = {
        chartData: {},
        statsData: {},
        updating: false
    };

    updateStats = (report) => {
        this.setState({updating: true});

        let postData = {};
        if (!this.props.hideDatePicker) {
            postData = {report};
        }

        axios
            .post(`${serverConfig.serverUrl}/${this.props.api}`, postData, {headers: {'Authorization': `Bearer ${this.props.token}`}})
            .then(resp => {
                if (resp.data && resp.data.data && typeof resp.data.data === 'object') {
                    this.setState({statsData: resp.data.data, updating: false});
                }
            })
            .catch(err => {
                console.log('/stats', err, err.response);
                this.setState({updating: false});
            });
    };

    componentDidMount() {
        let end_date = moment().format('YYYY-MM-DD');
        let start_date = moment().subtract(6, 'months').format('YYYY-MM-DD');
        this.updateStats({start_date, end_date});
    }

    getTotalCount = () => {
        let totalCount = 0;
        if (this.props.chart === 'pie') {
            let data = this.state.statsData;
            for (let key in data) {
                if (data.hasOwnProperty(key)) {
                    totalCount += data[key];
                }
            }
        }
        else {
            let data = this.state.statsData;
            for (let key in data) {
                if (data.hasOwnProperty(key)) {
                    totalCount += data[key];
                }
            }
        }

        return totalCount;
    };

    barChartData = () => {
        let data = this.state.statsData;

        let totalCount = 0;
        let _counts = [];
        let keys = [];
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                totalCount += data[key];
                _counts.push(data[key]);
                keys.push(key);
            }
        }

        let labels = ['Count'];
        let colors = [this.props.iconColor];
        let _data = [_counts];

        return {
            labels: labels,
            keys: keys,
            data: _data,
            colors: colors,
            totalCount
        };
    };

    pieChartData = () => {
        let chartProps = {
            labels: [],
            data: [],
            colors: []
        };

        let {statsData} = this.state;
        for (let key in statsData) {
            if (statsData.hasOwnProperty(key)) {
                chartProps.labels.push(key);
                chartProps.data.push(statsData[key]);
            }
        }

        return chartProps;
    };

    handleChange = (value) => {
        this.updateStats(value);
    };

    onRangeChange = (report) => {
        this.updateStats(report);
    };

    getChart = () => {
        let height = '360px';

        if (this.props.chart === 'pie') {
            return (
                <PieChart {...this.pieChartData()} height={height}/>
            );
        } else {
            return (
                <BarChart header={this.props.chartHeader} height={height} data={this.barChartData()}
                          displayLegend={false}/>
            );
        }
    };

    getDatePicker = () => {
        if (this.state.updating) {
            return (
                <Col span={8} offset={16} style={{padding: '12px'}}>
                    {this.state.updating ? <Spin/> : <DateRange onSubmit={this.onRangeChange}/>}
                </Col>
            );
        }
        else {
            return (
                <Col lg={24} xl={{span: 24}}>
                    {this.state.updating ? <Spin/> :
                        <DateRange hideDatePicker={this.props.hideDatePicker} onSubmit={this.onRangeChange}/>}
                </Col>
            );
        }
    };

    render() {
        let chartData = this.getChart();
        return (
            <div className='shadow'>
                <Row type="flex" justify="space-around" align="middle" style={{padding: '24px'}}>
                    {this.getDatePicker()}
                </Row>
                <Row>
                    <Col span={24}>
                        <div style={{fontSize: '42px'}}>
                            {this.getTotalCount()}
                        </div>
                        <div style={{fontSize: '16px'}}>
                            {this.props.text}
                        </div>
                    </Col>
                    <Col span={24}>
                        {chartData}
                    </Col>
                </Row>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token
    }
};

export default connect(mapStateToProps)(StatsCard);