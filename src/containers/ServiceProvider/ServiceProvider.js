import React from 'react';
import {withRouter, Route, Switch} from 'react-router-dom';
import View from './View/ServiceProviderView';
import Add from './Add/ServiceProviderAdd';

class InsuranceCompanies extends React.Component {

    edit = () => {
        return <Add {...this.props} header='Edit' backUrl={`/${this.props.module}/all`} backText={this.props.name}/>
    };

    add = () => {
        return <Add {...this.props} backUrl={`/${this.props.module}/all`} backText={this.props.name}/>
    };

    view = () => {
        return <View {...this.props} />
    };

    details = () => {
        return <Add {...this.props} header='Details' backUrl={`/${this.props.module}/all`}
                    backText={this.props.name} readOnly={true}/>
    };

    render() {
        return (
            <Switch>
                <Route path={`/${this.props.module}/all`} component={this.view}/>
                <Route path={`/${this.props.module}/add`} component={this.add}/>
                <Route path={`/${this.props.module}/edit`} component={this.edit}/>
                <Route path={`/${this.props.module}/details`} component={this.details}/>
            </Switch>
        );
    }
}

export default withRouter(InsuranceCompanies);
