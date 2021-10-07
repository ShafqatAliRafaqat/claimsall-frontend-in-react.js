import React from 'react';
import {withRouter, Route, Switch} from 'react-router-dom';
import Add from './Management/Add/OrganizationAdd';
import View from './View/OrganizationsView';

import UsersView from '../../containers/User/View/UsersView';
import UserAdd from '../../containers/User/Add/UserAdd';

class Organizations extends React.Component {

    edit = () => {
        return <Add header='Edit' backUrl='/organizations/all'/>
    };

    add = () => {
        return <Add backUrl='/organizations/all'/>
    };

    usersView = () => {
        return <UsersView/>
    };

    usersAdd = () => {
        return <UserAdd
            backText={this.props.location.state && this.props.location.state.organization ? this.props.location.state.organization.name : "Users"}
            backUrl='/organizations/users/all'/>
    };

    usersEdit = () => {
        return <UserAdd header='Edit'
                        backText={this.props.location.state && this.props.location.state.organization ? this.props.location.state.organization.name : "Users"}
                        backUrl='/organizations/users/all'/>
    };

    usersDetails = () => {
        return <UserAdd header='Employee Details'
                        backText={this.props.location.state && this.props.location.state.organization ? this.props.location.state.organization.name : "Users"}
                        backUrl='/organizations/users/all' readOnly={true}/>
    };

    details = () => {
        return <Add header='Details' backUrl='/organizations/users/all' readOnly={true}/>
    };

    render() {
        return (
            <Switch>
                <Route path="/organizations/add" component={this.add}/>
                <Route path="/organizations/all" component={View}/>
                <Route path="/organizations/edit" component={this.edit}/>
                <Route path="/organizations/details" component={this.details}/>
                <Route path="/organizations/users/add" component={this.usersAdd}/>
                <Route path="/organizations/users/all" component={this.usersView}/>
                <Route path="/organizations/users/edit" component={this.usersEdit}/>
                <Route path="/organizations/users/details" component={this.usersDetails}/>

            </Switch>
        );
    }

}

export default withRouter(Organizations);

