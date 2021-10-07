import React from 'react';
import {withRouter, Route, Switch} from 'react-router-dom';
import Add from './Add/CareServiceAdd';
import View from './View/CareServiceView';

class CareService extends React.Component {

    edit = () => {
        return <Add header='Edit' backUrl='/care-services/pending'/>
    };

    pendingView = () => {
        return <View />
    };

    historyView = () => {
        return <View showHistory={true}/>
    };

    render() {
        return (
            <Switch>
                <Route path="/care-services/pending" component={this.pendingView}/>
                <Route path="/care-services/history" component={this.historyView}/>
                <Route path="/care-services/process" component={this.edit}/>
            </Switch>
        );
    }

}

export default withRouter(CareService);

