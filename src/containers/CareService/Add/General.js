import React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {Alert, Col, Row, Spin} from 'antd';
import * as actions from '../../../store/care-service/careservice-actions';
import CareServiceDetail from '../../../components/Details/CareService/CareServiceDetail';

class General extends React.Component {

    componentDidMount() {
        this.props.resetReduxState();

        // load edit form
        if (this.props.location && this.props.location.state && this.props.location.state.id) {
            this.props.editCareservice(this.props.location.state.id);
        }
    }

    onFormSubmit = (form) => {
        this.props.addCareservice(form);
    };

    form = () => {
        let jsx;
        if (this.props.processing) {
            jsx = <Spin size='large'/>
        } else {
            jsx = (
                <CareServiceDetail onSubmit={this.onFormSubmit} data={this.props.careservice}/>
            );
        }

        return jsx;
    };

    componentDidUpdate() {
        let {props} = this;
        if (props.message) {
            props.history.push({pathname: '/care-services/pending', state: {message: props.message}});
        }
    }

    render() {
        return (
            <div>
                <Row style={{borderBottom: '2px solid #777'}}>
                    <Col span={24}>
                        <h2 className='form-headline'>
                            Care Service Details
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
        message: state.careservice.message,
        error: state.careservice.error,
        processing: state.careservice.processing,
        careservice: state.careservice.careservice,
        jwt: state.auth.token
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addCareservice: (careservice) => {
            dispatch(actions.addCareservice(careservice))
        },
        editCareservice: (id) => {
            dispatch(actions.getCareservice(id))
        },
        resetReduxState: () => {
            dispatch(actions._reset())
        }
    };
};

const _connectedComponent = connect(mapStateToProps, mapDispatchToProps)(General);
export default withRouter(_connectedComponent);