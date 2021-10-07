import React from 'react';
import {withRouter, Route, Switch} from 'react-router-dom';
import View from './View/MedicalPoliciesView';
import Add from './Add/MedicalPolicyAdd';

class MedicalPolicy extends React.Component {

    edit = () => {
        return <Add header='Edit' backUrl='/policies/all'/>
    };

    details = () => {
        return <Add header='Details' backUrl='/policies/all' readOnly={true}/>
    };

    add = () => {
        return <Add backText='Policies' backUrl='/policies/all'/>
    };

    render() {
        return (
            <Switch>
                <Route path="/policies/all" component={View}/>
                <Route path="/policies/add" component={this.add}/>
                <Route path="/policies/edit" component={this.edit}/>
                <Route path="/policies/details" component={this.details}/>
            </Switch>
        );
    }
}

export default withRouter(MedicalPolicy);

