import React, {Component} from 'react';
import './App.css';
import {connect} from 'react-redux';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';

import Loadable from 'react-loadable';
import Loading from './components/Loader/Loading';

import superAdminMenu from './config/super-admin-menu.json';
import orgAdminMenu from './config/org-admin-menu.json';

import LoginPage from './containers/Login/LoginPage';

const HomePage = Loadable({
    loader: () => import('./containers/Home/Home'),
    loading: Loading,
    delay: 400,
    timeout: 5000
});

class App extends Component {

    getAuthRedirect = () => {
        return this.props.auth.authenticated
            ? <Redirect to="/"/>
            : <Redirect to="/login"/>;
    };

    getAdminMenu = (acl) => {
        let _orgAdminMenu = [...orgAdminMenu];
        let menuItems = [];

        _orgAdminMenu.forEach(menu => {
            if (menu.children && menu.children.length) {
                let children = menu.children.filter(child => acl.indexOf(child.href) > -1);
                if (children && children.length) {
                    let newMenu = {...menu};
                    newMenu.children = children;
                    menuItems.push(newMenu);
                }
            }
            else if (acl.indexOf(menu.href) > -1 || menu.href === '/') {
                menuItems.push({...menu});
            }
        });

        return menuItems;
    };

    homePage = () => {
        let menuItems = null;
        switch (this.props.auth.role) {
            case 'superAdmin' :
                menuItems = superAdminMenu;
                break;
            default :
                menuItems = this.getAdminMenu(this.props.auth.acl);
                break;
        }

        return <HomePage menuItems={menuItems}/>
    };

    getHome = () => {
        if (this.props.auth.authenticated) {
            return ["/", "/home"].map(path => <Route key={path} path={path} component={this.homePage}/>);
        }
        else {
            return null;
        }
    };

    render() {
        return (
            <div className="App">
                <BrowserRouter>
                    <div className="App">
                        <Switch>
                            <Route path="/login" exact component={LoginPage}/>
                            {this.getHome()}
                            {this.getAuthRedirect()}
                        </Switch>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth
    };
};

export default connect(mapStateToProps)(App);
