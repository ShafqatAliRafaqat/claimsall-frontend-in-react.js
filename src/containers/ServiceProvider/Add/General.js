import React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {Row, Col, Spin, Alert} from 'antd';
import * as actions from '../../../store/organization/organization-actions';
import GeneralForm from '../../../components/Forms/ServiceProviderGeneralForm';
import {fetchOrganizationTypes} from '../../../utils/data-fetcher.js';

class General extends React.Component {

    state = {
        organizationType: {}
    };

    componentDidMount() {
        this.props.resetReduxState();

        fetchOrganizationTypes(this.props.providerCode)
            .then((organizationTypes => {
                this.setState({organizationType: organizationTypes[0]});
            }))
            .catch(err => {
                console.log(err);
            });


        // load edit form
        if (this.props.location && this.props.location.state && this.props.location.state.id) {
            this.props.editOrganization(this.props.location.state.id);
        }
    };

    onFormSubmit = (form) => {
        if (form) {
            form.organization_type_id = this.state.organizationType.id;
            form.address = [form.address];
        }

        console.log('form', form);

        this.props.addOrganization(form);
    };

    form = () => {
        let jsx;
        if (this.props.processing) {
            jsx = <Spin size='large'/>
        } else {
            let initialValues = {...this.props.organization};
            initialValues.address = this.props.organization.address && this.props.organization.address[0];
            jsx = (
                <GeneralForm disableLocationInfo={this.props.disableLocationInfo} onSubmit={this.onFormSubmit}
                             enableReinitialize={true} initialValues={initialValues} readOnly={this.props.readOnly}/>
            );
        }

        return jsx;
    };

    componentDidUpdate() {
        let {props} = this;
        if (props.message) {
            props.history.push({pathname: `/${this.props.module}/all`, state: {message: props.message}});
        }
    }

    render() {
        return (
            <div>
                <Row style={{borderBottom: '2px solid #777'}}>
                    <Col span={24}>
                        <h2 className='form-headline'>
                            {this.props.singularName} {this.props.header || 'Add'}
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
        message: state.organization.message,
        error: state.organization.error,
        processing: state.organization.processing,
        organization: state.organization.organization,
        jwt: state.auth.token
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addOrganization: (organization) => {
            dispatch(actions.addOrganization(organization))
        },
        editOrganization: (id) => {
            dispatch(actions.getOrganization(id))
        },
        resetReduxState: () => {
            dispatch(actions._reset())
        }
    };
};

const _connectedComponent = connect(mapStateToProps, mapDispatchToProps)(General);
export default withRouter(_connectedComponent);