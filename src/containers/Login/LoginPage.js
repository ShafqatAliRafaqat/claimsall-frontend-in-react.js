import React, {Component} from 'react';
import LoginForm from '../../components/Forms/LoginForm';
import './login-page.css';
import {connect} from 'react-redux';
import {Spin, Alert} from 'antd';

import * as authActions from '../../store/auth/auth-actions';

class LoginPage extends Component {

    componentDidMount() {
        if (this.props.userAuthenticated) {
            this.props.logout();
        }
    }

    componentDidUpdate() {
        console.log(this.props);
        if (this.props.userAuthenticated) {
            this.props.history.push("/");

            //this.props.history
            this.props.history.push({pathname: '/', state: {organizationId: 1}});

            // this.props.location.state;


        }
    }

    onFormSubmit = (data) => {
        if (data) {
            this.props.login(data);
        }
    };


    getServerError = () => {
        if (this.props.serverError) {
            return (
                <Alert message={"Error"} description={this.props.serverError} type="error" showIcon/>
            );
        } else {
            return null;
        }
    };

    getForm = () => {
        if (this.props.processing) {
            return <Spin size="large"/>
        } else {
            return (
                <div>
                    {this.getServerError()}
                    <LoginForm onSubmit={this.onFormSubmit}/>
                </div>
            );
        }
    };

    render() {
        return (
            <div className="container font-quicksand">
                <div className='row'>
                    <div className='col-sm-5 col-sm-offset-3'>
                        <img style={{maxHeight: '30vh'}} src={'/assets/icons/hospitAll-login.svg'}
                             alt={"HospitALL icon"}/>
                    </div>
                </div>

                <div className='row'>
                    <div className='col-sm-3 col-sm-offset-4'>
                        <h1 style={{fontSize: '56px'}}>HospitALL</h1>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-sm-3 col-sm-offset-4'>
                        <h1 style={{fontSize: '16px'}}>Admin Portal</h1>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-sm-3 col-sm-offset-4'>
                        {this.getForm()}
                    </div>
                </div>
            </div>
        );
    };

}

const mapStateToProps = (state) => {
    return {
        serverError: state.auth.error,
        processing: state.auth.processing,
        userAuthenticated: state.auth.authenticated
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        login: (loginData) => dispatch(authActions.login(loginData)),
        logout: () => dispatch(authActions.logout())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);