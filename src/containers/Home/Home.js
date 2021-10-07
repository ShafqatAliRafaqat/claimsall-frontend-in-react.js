import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {Row, Col, Dropdown, Icon, Menu} from 'antd';
import MenuBar from '../../containers/MenuBar/MenuBar';
import SuperAdmin from '../../containers/SuperAdmin/SuperAdmin';
import OrgAdmin from '../../containers/OrgAdmin/OrgAdmin';

import './home.css';

class Home extends React.Component {

    state = {
        menuExpanded: true
    };

    toggleMenuExpanded = () => {
        this.setState({menuExpanded: !this.state.menuExpanded});
    };

    menuBarGridSize = () => {
        let gridSize;
        if (this.state.menuExpanded) {
            gridSize = 4;
        } else {
            gridSize = 1;
        }

        return gridSize;
    };

    contentPageGridSize = () => {
        let gridSize;
        if (this.state.menuExpanded) {
            gridSize = 20;
        } else {
            gridSize = 23;
        }

        return gridSize;
    };

    home = () => {
        let {role} = this.props.auth;
        switch (role) {
            case 'superAdmin': {
                return <SuperAdmin/>;
            }
            default:
                return <OrgAdmin acl={this.props.auth.acl}/>;
        }
    };

    menu = () => {
        return (
            <Menu>
                <Menu.Item>
                    <a className='hover' onClick={() => {
                        this.props.history.push('/login')
                    }}>
                        <Icon type="logout"/> Logout
                    </a>
                </Menu.Item>
            </Menu>
        );
    };

    navBar = () => {
        return (
            <Row className='shadow' style={{height: '56px', backgroundColor: 'white'}} type="flex"
                 justify="space-around" align="middle">
                <Col span={6} className={'text-left'}>
                    <b>{this.props.auth.organizationName}</b>
                </Col>
                <Col className='hover text-right' span={6} offset={10}>
                    <b>{this.props.auth.name}</b>
                </Col>

                <Col className='hover' span={1}>
                    <Dropdown overlay={this.menu()}>
                        <i className="fas fa-user fa-lg" />
                    </Dropdown>
                </Col>
            </Row>
        );
    };

    render() {
        return (
            <div className='home-page font-quicksand color-background'>
                <Row>
                    <Col sm={{span: 24}} md={{span: this.menuBarGridSize()}} style={{position : 'sticky', top : 0}}>
                        <MenuBar menuExpanded={this.state.menuExpanded} onExpanderClick={this.toggleMenuExpanded}
                                 menuItems={this.props.menuItems}/>
                    </Col>

                    <Col sm={{span: 24}} md={{span: this.contentPageGridSize()}}>
                        <Row>
                            <Col span={24}>
                                {this.navBar()}
                            </Col>

                            <Col span={24} style={{padding: '24px'}}>
                            <div>
                                {this.home()}
                            </div>
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
        auth: state.auth
    };
};

const connectedHome = connect(mapStateToProps)(Home);
export default withRouter(connectedHome);