import React from 'react';
import {connect} from 'react-redux';
import {withRouter, Switch, Route} from 'react-router-dom';
import {Row, Col, Button, Icon} from 'antd';
import General from '../../User/Add/General';
import Qualifications from './Qualifications';
import * as actions from '../../../store/user/user-actions';
import './style.css';


class DoctorsAdd extends React.Component {

    prevPage = (state) => {
        this.props.history.push({pathname: this.props.backUrl, state: {...this.props.location.state, ...state}});
    };


    menu = () => {
        let data = [
            {name: 'General', href: `/${this.props.module}/${this.props.prefix}/general`},
            {name: 'Qualifications', href: `/${this.props.module}/${this.props.prefix}/qualification`},
            {name: 'Specializations', href: `/${this.props.module}/${this.props.prefix}/specialization`}
        ];

        let jsx = data.map(item => {
            let className = this.props.location.pathname.includes(item.href) ? 'hover sub-menu-active' : 'hover sub-menu';
            return (
                <Row type="flex" justify="space-around" align="middle" key={item.name} className={className}>
                    <Col span={24} onClick={() => {
                        this.props.history.push({pathname: item.href, state: {id: this.props.user.id}})
                    }}>
                        {item.name}
                    </Col>
                </Row>
            );
        });

        return jsx;
    };


    general = () => {
        return <General {...this.props} prevPage={this.prevPage}
                        serviceProviderForm={true} providerCode={this.props.providerCode}/>;
    };

    qualifications = () => <Qualifications type='Qualification' name='Qualification' label='Qualifications'
                                           backUrl={`/${this.props.module}/${this.props.prefix}/general`}
                                           readOnly={this.props.readOnly}/>;

    specializations = () => <Qualifications type='Specialization' name='Specialization' label='Specializations'
                                            backUrl={`/${this.props.module}/${this.props.prefix}/general`}
                                            readOnly={this.props.readOnly}/>;

    form = () => {
        return (
            <Switch>
                <Route path={`/${this.props.module}/${this.props.prefix}/general`} component={this.general}/>
                <Route path={`/${this.props.module}/${this.props.prefix}/qualification`}
                       component={this.qualifications}/>
                <Route path={`/${this.props.module}/${this.props.prefix}/specialization`}
                       component={this.specializations}/>
            </Switch>
        );
    };

    render() {
        console.log(this.props);
        return (
            <div>
                <Row type="flex" justify="space-around" align="middle">
                    <Col span={1}/>
                    <Col span={23}>
                        {/*<h3 className='text-left'*/}
                        {/*style={{fontWeight: 900}}>{this.props.singularName} Management</h3>*/}
                    </Col>
                </Row>
                <Row type="flex" justify="start" style={{marginBottom: 12}}>
                    <Col span={1}/>
                    <Col span={1}>
                        <Button className='shadow' onClick={() => {
                            this.prevPage()
                        }}>
                            <Icon type="arrow-left"/>{this.props.backText || "Doctors"}
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col span={1}/>
                    <Col span={23}>
                        <Row>
                            <Col span={5} className='shadow'>
                                {this.menu()}
                            </Col>
                            <Col span={1}/>
                            <Col span={18} className='shadow'>
                                {this.form()}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user.user,
        jwt: state.auth.token
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        stopProcessing: () => dispatch(actions._setProcessing(false))
    };
};

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(DoctorsAdd);
export default withRouter(connectedComponent);