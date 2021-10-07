import React from 'react';
import {withRouter, Route, Switch} from 'react-router-dom';
import Add from './Add/GradeAdd';
import View from './View/GradesView';

class Grades extends React.Component {

    edit = () => {
        return <Add header='Edit' backUrl='/grades/all'/>
    };

    details = () => {
        return <Add header='Details' readOnly={true} backUrl='/grades/all'/>
    };

    add = () => {
        return <Add backUrl='/grades/all'/>
    };

    render() {
        return (
            <Switch>
                <Route path="/grades/add" component={this.add}/>
                <Route path="/grades/all" component={View}/>
                <Route path="/grades/edit" component={this.edit}/>
                <Route path="/grades/details" component={this.details}/>
            </Switch>
        );
    }

}

export default withRouter(Grades);

