import React from 'react';
import {Col, Row, Spin} from 'antd';
import CountsCard from '../CountsCard/CountsCard';
import {withRouter} from 'react-router-dom';
import DateRange from '../DateRange/DatePopover';
import moment from "moment/moment";
import axios from "axios/index";
import serverConfig from '../../config/config.json';

class ReqsCard extends React.Component {

    state = {
        chartData: {},
        countsData: [
            {
                id: 1,
                text: 'Requests Submitted',
                color: 'orange',
                count: 912,
                href: '/care-services/pending'
            },
            {
                id: 2,
                text: 'Requests Approved',
                color: 'green',
                count: 4,
                href: '/care-services/history'
            },
            {
                id: 3,
                text: 'Requests Declined',
                color: 'red',
                count: 38,
                href: '/care-services/history'
            }
        ]
    };

    updateStats = (report) => {
        this.setState({updating: true});
        axios
            .post(`${serverConfig.serverUrl}/${this.props.api}`, {report})
            .then(resp => {
                if (resp.data && resp.data.data && typeof resp.data.data === 'object') {
                    let newState = {...this.state};
                    newState.countsData = [...this.state.countsData];

                    this.props.mapReqs(newState, resp);
                    newState.updating = false;

                    this.setState(newState);
                }
            })
            .catch(err => {
                console.log('/stats', err, err.response);
                this.setState({updating: false});
            });
    };

    componentDidMount() {
        this.setState({countsData: this.props.countsData}, () => {
            let end_date = moment().format('YYYY-MM-DD');
            let start_date = moment().subtract(6, 'months').format('YYYY-MM-DD');
            let report = {start_date, end_date};

            this.updateStats(report);
        });
    }

    onRangeChange = (report) => {
        this.updateStats(report);
    };

    getCountCards = () => {
        return this.state.countsData.map(count => {
            return (
                <Col key={count.id} sm={{span: 24}} md={{span: Math.floor(24 / this.state.countsData.length)}}>
                    <CountsCard {...count} onClick={() => {
                        this.props.history.push({pathname : count.href, state : count.state})
                    }}/>
                </Col>
            );
        });
    };

    handleChange = (value) => {
        this.setState({value});
    };

    getDatePicker = () => {
        if (this.props.hideDatePicker) {
            return <Col span={8} offset={16} style={{padding: '12px'}}/>
        }

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
                    {this.state.updating ? <Spin/> : <DateRange onSubmit={this.onRangeChange}/>}
                </Col>
            );
        }
    };

    render() {
        return (
            <div className='shadow' style={{background: 'linear-gradient(to bottom, #323232 60%, #fff 50%)'}}>
                <Row type="flex" justify="space-around" align="middle">
                    <Col span={5}>
                        <h2 className='menu-bar-h2' style={{padding: '24px'}}>
                            {this.props.headerText}
                        </h2>
                    </Col>

                    <Col span={14} offset={5} style={{padding: '24px'}}>
                        <Row type="flex" justify="space-around" align="middle">
                            {this.getDatePicker()}
                        </Row>
                    </Col>
                </Row>

                <Row gutter={8} type="flex" justify="space-between" align="bottom">
                    <Col span={24}>
                        <div style={{height: '15vh'}}/>
                    </Col>
                    {this.getCountCards()}
                </Row>
            </div>
        );
    }
}

export default withRouter(ReqsCard);