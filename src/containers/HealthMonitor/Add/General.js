import React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {Alert, Col, Row, Spin} from 'antd';
import * as actions from '../../../store/healthmonitor/healthmonitor-actions';
import GeneralForm from '../../../components/Forms/HealthMonitorTypeForm';

class General extends React.Component {

    componentDidMount() {
        this.props.resetReduxState();

        // load edit form
        if (this.props.location && this.props.location.state && this.props.location.state.id) {
            this.props.editHealthmonitor(this.props.location.state.id);
        }
    }

    onFormSubmit = (formData) => {
          this.props.addHealthmonitor(formData);
    };

    form = () => {
        let jsx;
        if (this.props.processing) {
            jsx = <Spin size='large'/>
        } else {
            jsx = (
                <GeneralForm onSubmit={this.onFormSubmit} initialValues={this.props.healthmonitor}/>
            );
        }

        return jsx;
    };

    componentDidUpdate() {
        let {props} = this;
        if (props.message) {
            props.history.push({pathname: '/health-monitor-fields/all', state: {message: props.message}});
        }
    }

    render() {
        return (
            <div>
                <Row style={{borderBottom: '2px solid #777'}}>
                    <Col span={24}>
                        <h2 className='form-headline'>
                            Health Monitor Type
                        </h2>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <div style={{padding: '12px'}}>
                            {this.props.message ? (
                                <Alert message={"Success"} description={this.props.message} type="success"
                                       showIcon/>) : null}
                            {this.props.error ? (
                                <Alert message={"Error"} description={this.props.error} type="error" showIcon/>) : null}
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <div style={{padding: '12px'}}>
                            {this.form()}
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        message: state.healthmonitor.message,
        error: state.healthmonitor.error,
        processing: state.healthmonitor.processing,
        healthmonitor: state.healthmonitor.healthmonitor,
        jwt: state.auth.token
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addHealthmonitor: (healthmonitor) => {
            dispatch(actions.addHealthmonitor(healthmonitor))
        },
        editHealthmonitor: (id) => {
            dispatch(actions.getHealthmonitor(id))
        },
        resetReduxState: () => {
            dispatch(actions._reset())
        }
    };
};

const _connectedComponent = connect(mapStateToProps, mapDispatchToProps)(General);
export default withRouter(_connectedComponent);