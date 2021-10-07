import React from 'react';
import {Popover, DatePicker, Button, Row, Col, Icon, Spin} from 'antd';

class DatePopover extends React.Component {

    state = {
        visible: false,
        start_date: null,
        end_date: null,
        reportDownloading: false
    };

    hide = () => {
        this.setState({visible: false});
    };

    content = () => {
        return (
            <div>

                <DatePicker placeholder="Start Date" onChange={(date) => {
                    this.setState({start_date: date})
                }}/>

                <DatePicker placeholder="End Date" onChange={(date) => {
                    this.setState({end_date: date})
                }}/>

                <Button type="primary" onClick={() => {
                    let params = {};
                    if (this.state.start_date) {
                        params.start_date = this.state.start_date.format('YYYY-MM-DD');
                    }

                    if (this.state.end_date) {
                        params.end_date = this.state.end_date.format('YYYY-MM-DD');
                    }

                    if (this.props.onSubmit) {
                        this.props.onSubmit(params);
                    }

                    this.setState({visible: false, start_date: null, end_date: null});
                }}
                        disabled={this.state.start_date && this.state.end_date && this.state.start_date.isAfter(this.state.end_date)}
                >
                    Submit
                </Button>
            </div>
        );
    };

    popOver = () => {
        if (this.state.visible)
            return (
                <Popover content={this.content()} placement="right"
                         title={
                             <Row>
                                 <Col span={12} className='text-left'>
                                     Select Dates
                                 </Col>
                                 <Col span={12} className='text-right'>
                                     <Icon type="close" className='hover' onClick={this.hide}/>
                                 </Col>
                             </Row>
                         }
                         visible={true}
                />
            );
        return null;
    };

    getButton = () => {
        return (
            <Button style={{visibility: this.props.hideDatePicker ? 'hidden' : 'visible'}}
                    onClick={() => this.setState({visible: !this.state.visible})}>
                Select Range
            </Button>
        );
    };

    render() {
        return (
            <Row type="flex" justify="space-around" align="middle">
                <Col span={24} className={'text-right'} style={{padding: 6}}>
                    {this.state.reportDownloading ? <Spin/> : this.getButton()}
                    {this.popOver()}
                </Col>
            </Row>
        );
    }
}

export default DatePopover;