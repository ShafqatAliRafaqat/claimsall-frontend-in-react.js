import React from 'react';
import {Route, Switch, withRouter} from 'react-router-dom';
import Detail from './Detail/ClaimController';
import View from './View/ClaimsView';
import AllView from './View/ClaimsViewAll';

class Claims extends React.Component {

    detail = () => {
        return <Detail backUrl='/claims/all'/>
    };

    render() {
        return (
            <Switch>
                <Route path="/claims/all" component={AllView}/>
                <Route path="/claims/pending" component={View}/>
                <Route path="/claims/view" component={this.detail}/>
            </Switch>
        );
    }
}

export default withRouter(Claims);

