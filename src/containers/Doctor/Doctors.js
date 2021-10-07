import React from 'react';
import {withRouter, Route, Switch} from 'react-router-dom';
import Add from './Add/DoctorsAdd';
import View from './View/DoctorsView';

class Doctors extends React.Component {

    add = () => {
        return <Add {...this.props} backUrl={`/${this.props.module}/all`} prefix={'add'} backText={this.props.name}/>
    };

    view = () => {
        return <View {...this.props} />
    };

    details = () => {
        return <Add {...this.props} backUrl={`/${this.props.module}/all`} prefix={'details'} backText={this.props.name}
                    readOnly={true}/>
    };

    render() {
        return (
            <Switch>
                <Route path={`/${this.props.module}/add`} component={this.add}/>
                <Route path={`/${this.props.module}/all`} component={this.view}/>
                <Route path={`/${this.props.module}/edit`} component={this.add}/>
                <Route path={`/${this.props.module}/details`} component={this.details}/>
            </Switch>
        );
    }

}

export default withRouter(Doctors);

