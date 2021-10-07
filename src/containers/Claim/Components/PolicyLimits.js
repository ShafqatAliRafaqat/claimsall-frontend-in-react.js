import React from 'react';
import {Row, Col, Spin} from 'antd';
import BigBoldSpan from './BigBoldSpan';
import BoldSpan from './BoldSpan';
import {fetchMedicalConsumptions} from '../../../utils/data-fetcher';
import {formatAmount} from '../../../utils/common-utils';

class PolicyLimits extends React.Component {

    state = {
        fetchingConsumption: true,
        policyLimits: {}
    };

    componentDidMount() {
        // Fetch live amount
        if (!this.props.readOnly) {
            fetchMedicalConsumptions()
                .then(policyLimits => {
                    this.setState({policyLimits, fetchingConsumption: false}, () => {
                        this.props.setPolicyLimits(policyLimits);
                    });
                });
        }
        else {
            this.setState({policyLimits: this.props.policyLimits, fetchingConsumption: false}, () => {
                this.props.setPolicyLimits(this.props.policyLimits);
            })
        }
    }


    getRoomData = () => {
        let {claimDetails} = this.props;
        let data = [];
        data.push({name: 'Room Rent Claimed / Day', value: formatAmount(claimDetails['room_rent'])});
        data.push({name: 'No. of Days Stayed', value: claimDetails['room_days']});
        data.push({name: 'Total Room Rent Claimed', value: formatAmount(+claimDetails['room_rent'] * +claimDetails['room_days'])});
        data.push({name: 'Max Allowed Room Rent', value: formatAmount(claimDetails['max_room_rent'])});
        data.push({name: 'Extra Room Rent', value: formatAmount(claimDetails['extra_room_rent'])});
        return data;
    };


    showRoomAmounts = () => {
        if (this.props.claimDetails && this.props.claimDetails['room_rent'] && this.props.claimDetails['room_days']) {
            return true;
        }
    };

    render() {
        let {policyLimits, fetchingConsumption} = this.state;

        if (fetchingConsumption) {
            return <Spin size='large'/>;
        }
        else {
            let limits = [];

            if (policyLimits) {
                for (let key in policyLimits) {
                    if (policyLimits.hasOwnProperty(key)) {
                        let limit = policyLimits[key];

                        const TOTAL_LIMIT = limit['Total'];

                        let totalLimit = +TOTAL_LIMIT === 0 ? 'N/A' : formatAmount(limit['Total']);
                        let consumedLimit = totalLimit === 'N/A' ? 'N/A' : formatAmount(limit['Consumed']);
                        let remainingLimit = totalLimit === 'N/A' ? 'N/A': formatAmount(limit['Remaining']);

                        let jsx = (
                            <Row type="flex" key={key} justify="start" gutter={32} style={{marginBottom: 12}}>
                                <Col span={7} offset={1}>
                                    <BoldSpan text={key}/>
                                </Col>
                                <Col span={4}>
                                    <span>{totalLimit}</span>
                                </Col>
                                <Col span={4}>
                                    <span>{consumedLimit}</span>
                                </Col>
                                <Col span={4}>
                                    <span>{remainingLimit}</span>
                                </Col>
                            </Row>
                        );
                        limits.push(jsx);
                    }
                }
            }

            return (
                <div className='color-background' style={{margin: '24px', padding: '24px'}}>
                    <Row type="flex" justify="start" gutter={32} style={{marginBottom: 12}}>
                        <Col span={7} offset={1}>
                            <BigBoldSpan text='Limits'/>
                        </Col>
                        <Col span={4}>
                            <BigBoldSpan text='Total'/>
                        </Col>
                        <Col span={4}>
                            <BigBoldSpan text='Consumed'/>
                        </Col>
                        <Col span={4}>
                            <BigBoldSpan text='Remaining'/>
                        </Col>
                    </Row>

                    {limits}

                    <hr/>


                    <Row type="flex" justify="center" align="top" gutter={32} style={{marginBottom: 12}}>
                        <Col span={12}>
                            <Row type="flex" justify="middle" gutter={32} style={{marginBottom: 12}}>
                                <Col span={8} offset={1}>
                                    <BoldSpan text='Claim Type'/>
                                </Col>

                                <Col span={12}>
                                    <BigBoldSpan
                                        text={this.props.claimDetails && this.props.claimDetails['claim_type']}/>
                                </Col>
                            </Row>

                            <Row type="flex" justify="middle" gutter={32} style={{marginBottom: 12}}>
                                <Col span={8} offset={1}>
                                    <BoldSpan text='Claim Amount'/>
                                </Col>

                                <Col span={12} style={{color: 'red'}}>
                                    <BigBoldSpan
                                        text={this.props.claimDetails && formatAmount(this.props.claimDetails['claim_amount'])}/>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            {this.showRoomAmounts() &&
                            <Row type="flex" justify="middle" gutter={32} style={{marginBottom: 12}}>
                                <Col span={24}>
                                    <BigBoldSpan text={
                                        <p>Room Rent (Inclusive in Claim Amount)</p>
                                    }/>
                                </Col>

                                <Col span={24} className={'text-center'}>
                                    <Row gutter={32}>
                                        {this.getRoomData().map((data, index) => {
                                            return (
                                                <div key={index}>
                                                    <Col span={15}>
                                                        <BoldSpan text={data.name + " : "}/>
                                                    </Col>
                                                    <Col span={5}>
                                                        {data.value}
                                                    </Col>
                                                </div>
                                            );
                                        })}
                                    </Row>
                                </Col>
                            </Row>}
                        </Col>
                    </Row>
                </div>
            );
        }
    };
}

export default PolicyLimits;