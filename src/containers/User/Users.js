import React from 'react';
import {withRouter, Route, Switch} from 'react-router-dom';
import View from './View/UsersView';
import Add from './Add/UserAdd';

class Users extends React.Component {

    view = () => {
        return <View {...this.props} employee_status={'Active'} user_status={'Approved'}/>
    };

    roles = () => {
        return <View {...this.props}/>
    };

    pending = () => {
        return <View user_status={'Pending'} employee_status={'Pending'}/>
    };


    edit = () => {
        return <Add header='Edit' backUrl='/users/all'/>
    };

    add = () => {
        return <Add backUrl='/users/all'/>
    };

    review = () => {
        return <Add header='Review' backUrl='/users/pending'/>
    };

    details = () => {
        return <Add header='Details' backUrl='/users/all' readOnly={true}/>
    };


    render() {
        return (
            <Switch>
                <Route path="/users/all" component={this.view}/>
                <Route path="/users/roles" component={this.roles}/>
                <Route path="/users/add" component={this.add}/>
                <Route path="/users/details" component={this.details}/>
                <Route path="/users/edit" component={this.edit}/>
                <Route path="/users/review" component={this.review}/>
                <Route path="/users/pending" component={this.pending}/>
            </Switch>
        );
    }

}

export default withRouter(Users);

