import React from 'react';
import {Route, Switch, withRouter} from 'react-router-dom';
import View from './View/ACLView';
import Add from './Add/ACLAdd';

class ACL extends React.Component {

    edit = () => {
        return <Add header='Edit' backUrl='/roles/all'/>
    };

    view = () => {
        return <Add header='View' backUrl='/roles/all' readOnly={true}/>
    };

    add = () => {
        return <Add backText='Roles' backUrl='/roles/all'/>
    };

    render() {
        return (
            <Switch>
                <Route path="/roles/all" component={View}/>
                <Route path="/roles/add" component={this.add}/>
                <Route path="/roles/edit" component={this.edit}/>
                <Route path="/roles/view" component={this.view}/>

            </Switch>
        );
    }
}

export default withRouter(ACL);

