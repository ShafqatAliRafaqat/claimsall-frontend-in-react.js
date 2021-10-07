import React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {Alert, Col, Row, Spin} from 'antd';
import * as actions from '../../../store/policy/policy-actions';
import GeneralForm from '../../../components/Forms/PolicyForm';
import {fetchCoveredTypes, fetchOrganizationGrades} from "../../../utils/data-fetcher";


class General extends React.Component {

    state = {
        orgTypes: [],
        organizationGrades: []
    };

    componentDidMount() {
        this.props.resetReduxState();

        // load edit form
        if (this.props.location && this.props.location.state && this.props.location.state.id) {
            this.props.editPolicy(this.props.location.state.id);
        }

        fetchOrganizationGrades()
            .then(organizationGrades => this.setState({organizationGrades}, () => {
                fetchCoveredTypes()
                    .then(coveredTypes => this.setState({coveredTypes}))
                    .catch(err => console.log(err));
            }))
            .catch(err => console.log(err));
    }

    onFormSubmit = (form) => {
        this.props.addPolicy(form);
    };

    form = () => {
        let jsx;
        if (this.props.processing) {
            jsx = <Spin size='large'/>
        } else {
            jsx = (
                <GeneralForm onSubmit={this.onFormSubmit} grades={this.state.organizationGrades}
                             coveredTypes={this.state.coveredTypes}
                             initialValues={this.props.policy}
                             readOnly={this.props.readOnly}
                />
            );
        }

        return jsx;
    };

    componentDidUpdate() {
        let {props} = this;
        if (props.message) {
            if (props.callBack) {
                props.callBack();
            } else {
                props.prevPage({message: props.message});
            }
        }
    }

    render() {
        return (
            <div>
                <Row style={{borderBottom: '2px solid #777'}}>
                    <Col span={24}>
                        <h2 className='form-headline'>
                            {this.props.policy && this.props.policy.name ? this.props.policy.name : 'Medical Policy'}
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
        message: state.policy.message,
        error: state.policy.error,
        processing: state.policy.processing,
        policy: state.policy.policy,
        jwt: state.auth.token,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addPolicy: (policy) => {
            dispatch(actions.addPolicy(policy))
        },
        editPolicy: (id) => {
            dispatch(actions.getPolicy(id))
        },
        resetReduxState: () => {
            dispatch(actions._reset())
        }
    };
};

const _connectedComponent = connect(mapStateToProps, mapDispatchToProps)(General);
export default withRouter(_connectedComponent);