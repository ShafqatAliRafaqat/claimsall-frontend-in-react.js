import React from 'react';
import {DatePicker, Button, Row, Col} from 'antd';

class DateRange extends React.Component {
    state = {
        startValue: null,
        endValue: null,
        endOpen: false,
    };

    disabledStartDate = (startValue) => {
        const endValue = this.state.endValue;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    };

    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    };

    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    };

    onStartChange = (value) => {
        this.onChange('startValue', value);
    };

    onEndChange = (value) => {
        this.onChange('endValue', value);
    };

    handleStartOpenChange = (open) => {
        if (!open) {
            this.setState({endOpen: true});
        }
    };

    handleEndOpenChange = (open) => {
        this.setState({endOpen: open});
    };

    render() {
        const {startValue, endValue, endOpen} = this.state;
        return (
            <Row>
                <Col span={10}>
                    <DatePicker
                        disabledDate={this.disabledStartDate}
                        showTime
                        format="YYYY-MM-DD"
                        value={startValue}
                        placeholder="Start"
                        onChange={this.onStartChange}
                        onOpenChange={this.handleStartOpenChange}
                    />
                </Col>
                <Col span={10}>
                    <DatePicker
                        disabledDate={this.disabledEndDate}
                        showTime
                        format="YYYY-MM-DD"
                        value={endValue}
                        placeholder="End"
                        onChange={this.onEndChange}
                        open={endOpen}
                        onOpenChange={this.handleEndOpenChange}
                    />
                </Col>
                <Col span={2}>
                    <Button type='primary' onClick={() => {
                        this.props.onSubmit && this.props.onSubmit(this.state)
                    }}>
                        Submit
                    </Button>
                </Col>
            </Row>
        );
    }
}

export default DateRange;