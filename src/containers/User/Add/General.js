import React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {Row, Col, Spin, Alert} from 'antd';
import axios from '../../../utils/axios';
import serverConfig from '../../../config/config.json';
import * as actions from '../../../store/user/user-actions';
import GeneralForm from '../../../components/Forms/UserGeneralForm';

class General extends React.Component {

    state = {
        orgTypes: []
    };

    getOrganizationId = () => {
        let {location, organization_id} = this.props;
        return organization_id || (location.state ? location.state.organization_id : null);
    };

    isPendingUser = () => {
        return this.props.location && this.props.location.state && (this.props.location.state.pendingUser || this.props.location.state.pendingDoctor);
    };

    componentDidMount() {
        this.props.resetReduxState();

        if (!this.getOrganizationId()) {
            axios.get(`${serverConfig.serverUrl}/lookup-orgs`, {headers: {'Authorization': `Bearer ${this.props.jwt}`}})
                .then((resp) => {
                    let {data} = resp;
                    if (data && data.data && data.data.length) {
                        this.setState({orgTypes: data.data});
                    }
                })
                .catch(err => {
                    console.log(err, err.response);
                });
        }

        // load edit form
        if (this.props.location && this.props.location.state && this.props.location.state.id) {
            this.props.editUser(this.props.location.state.id);
        }
    }

    onFormSubmit = (form) => {
        if (form.cnic) {
            form.cnic = form.cnic.replace(/-/g, '');
        }
        if (form.password) {
            form.updatePassword = 'Y';
        }

        if (this.props.serviceProviderForm && this.props.providerCode) {
            form.role_code = this.props.providerCode;
        }

        this.props.addUser(form);
    };

    form = () => {
        let jsx;
        if (this.props.processing) {
            jsx = <Spin size='large'/>
        }
        else {
            let hideOrganization = false;

            let user = {...this.props.user};

            if(user.gross_salary){
                if(parseFloat(user.gross_salary)==0){
                    user.gross_salary = '';
                }
            }
            if(user.basic_salary){
                if(parseFloat(user.basic_salary)==0){
                    user.basic_salary = '';
                }
            }
            user.organization_id = user.organization_id || this.getOrganizationId();

            if (user.organization_id) {
                hideOrganization = true;
            }

            jsx = (
                <GeneralForm onSubmit={this.onFormSubmit}
                             enableReinitialize={true}
                             initialValues={user}
                             orgTypes={this.state.orgTypes}
                             hideOrganization={hideOrganization}
                             serviceProviderForm={this.props.serviceProviderForm}
                             isOrgAdmin={this.props.organization_id}
                             readOnly={this.props.readOnly}
                             pendingUser={this.isPendingUser()}
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
                            {this.props.user &&
                            this.props.user.first_name && this.props.user.last_name ?
                                `${this.props.user.first_name} ${this.props.user.last_name}` :
                                'Add ' + (this.props.singularName || (this.props.organization_id ? 'Employee' : 'User'))}
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
        message: state.user.message,
        error: state.user.error,
        processing: state.user.processing,
        user: state.user.user,
        jwt: state.auth.token,
        organization_id: state.auth.organization_id
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addUser: (user) => {
            dispatch(actions.addUser(user))
        },
        editUser: (id) => {
            dispatch(actions.getUser(id))
        },
        resetReduxState: () => {
            dispatch(actions._reset())
        }
    };
};

const _connectedComponent = connect(mapStateToProps, mapDispatchToProps)(General);
export default withRouter(_connectedComponent);