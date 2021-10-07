import React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {Row, Col, Spin, Alert, message} from 'antd';
import * as actions from '../../../store/user/user-actions';
import QualificationsForm from '../../../components/Forms/QualificationsForm';
import axios from '../../../utils/axios';
import serverConfig from '../../../config/config.json';


class Qualifications extends React.Component {

    state = {};


    fetchUserMeta = () => {
        const config = {
            headers: {'Authorization': `Bearer ${this.props.jwt}`}
        };

        axios.post(`${serverConfig.serverUrl}/get-user-meta`, {
            user_id: this.props.user.id,
            type: this.props.name
        }, config)
            .then(resp => {
                let newState = {};
                newState[this.props.name] = resp.data.data;
                this.setState(newState);
                this.props.setProcessing(false);
            })
            .catch(err => {
                console.log(err.response);
            });
    };

    componentDidMount() {
        if (!this.props.user || !this.props.user.id) {
            this.props.history.push({pathname: this.props.backUrl});
        } else {
            this.fetchUserMeta();
        }
    }

    onFormSubmit = (form) => {
        const config = {
            headers: {'Authorization': `Bearer ${this.props.jwt}`}
        };

        form.user_id = this.props.user.id;

        console.log(form);

        this.props.setProcessing(true);

        axios.post(`${serverConfig.serverUrl}/add-user-meta`, form, config)
            .then(resp => {
                this.showSuccessMessage('Request processed successfully ');
                this.fetchUserMeta();
            })
            .catch(err => {
                console.log(err.response);
                this.props.setProcessing(false);
            });
    };

    showSuccessMessage = (msg) => {
        console.log(msg);
        message.success(msg);
    };

    form = () => {
        let jsx;
        if (this.props.processing) {
            jsx = <Spin size='large'/>
        } else {
            jsx = (
                <QualificationsForm {...this.props} onSubmit={this.onFormSubmit} enableReinitialize={true}
                                    initialValues={{...this.state}}/>
            );
        }

        return jsx;
    };

    render() {
        return (
            <div>
                <Row style={{borderBottom: '2px solid #777'}}>
                    <Col span={24}>
                        <h2 className='form-headline'>
                            {this.props.label}
                        </h2>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <div style={{padding: '12px'}}>
                            {this.props.message ? (
                                <Alert message={"Success"} description={'Request processed successfully'} type="success"
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
        jwt: state.auth.token
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
        },
        setProcessing: (val) => {
            dispatch(actions._setProcessing(val))
        }
    };
};

const _connectedComponent = connect(mapStateToProps, mapDispatchToProps)(Qualifications);
export default withRouter(_connectedComponent);