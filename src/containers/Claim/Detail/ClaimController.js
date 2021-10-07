import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Row, Col, Button, Icon, Timeline, Spin} from 'antd';
import General from './ClaimDetail';

import {getClaim, setActiveClaim, _setProcessing} from '../../../store/claim/claim-actions';

class ClaimController extends React.Component {

    componentWillMount() {
        this.props.setProcessing();
    }

    componentDidMount() {
        this.props.fetchClaim(this.props.location.state.id);
    }

    timeline = () => {
        let {claim, timeLine, setActiveClaim} = this.props;

        let timeLineJsx = [];

        for (let key in timeLine) {
            if (timeLine.hasOwnProperty(key) && typeof timeLine[key] === 'object') {
                timeLineJsx.push(
                    <Timeline.Item key={key}
                                   color={(+key === +claim.id) ? 'red' : 'green'}>
                        <a className='hover' onClick={() => {
                            console.log('setActiveClaim');
                            this.props.setProcessing();
                            setActiveClaim(key);
                        }}>
                            {timeLine[key]['administrator']['role_title']}
                        </a>
                    </Timeline.Item>
                );
            }
        }

        return (
            <Timeline>
                {timeLineJsx}
            </Timeline>
        );
    };


    details = () => {
        if (this.props.processing) {
            return <Spin size='large'/>;
        }
        else {
            return (
                <Row>
                    <Col span={3} className=''>
                        {this.timeline()}
                    </Col>
                    <Col span={16} offset={1} className='shadow'>
                        <General {...this.props}/>
                    </Col>
                </Row>
            );
        }
    };

    render() {
        return (
            <div>
                <Row type="flex" justify="start" style={{marginBottom: 42}}>
                    <Col span={1} offset={1}>
                        <Button className='shadow' onClick={() => {
                            this.props.history.push({
                                pathname: this.props.backUrl || this.props.location.state.backUrl,
                                state: {...this.props.location.state}
                            })
                        }} size='large' style={{marginBottom: 8, fontWeight: 'bold'}}>
                            <Icon type="arrow-left"/>{this.props.backText || "Claims"}
                        </Button>
                    </Col>
                </Row>
                <Row gutter={32}>
                    <Col span={23} offset={1}>
                        {this.details()}
                    </Col>
                </Row>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        timeLine: state.claim.timeLine,
        claim: state.claim.claim,
        processing: state.claim.processing
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchClaim: (claim_id) => dispatch(getClaim(claim_id)),
        setActiveClaim: (timeLineId) => dispatch(setActiveClaim(timeLineId)),
        setProcessing: () => dispatch(_setProcessing(true))
    };
};

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(ClaimController);

export default withRouter(connectedComponent);