import React from 'react';
import {withRouter, Route, Switch} from 'react-router-dom';
import Add from './Add/HealthMonitorAdd';
import View from './View/HealthMonitorView';

class HealthMonitor extends React.Component {

    edit = () => {
        return <Add header='Edit' backUrl='/health-monitor-fields/all'/>
    };


    add = () => {
        return <Add header='Add' backUrl='/health-monitor-fields/all'/>
    };

    view = () => {
        return <View/>
    };

    render() {
        return (
            <Switch>
                <Route path="/health-monitor-fields/all" component={this.view}/>
                <Route path="/health-monitor-fields/add" component={this.add}/>
                <Route path="/health-monitor-fields/edit" component={this.edit}/>
            </Switch>
        );
    }

}

export default withRouter(HealthMonitor);

