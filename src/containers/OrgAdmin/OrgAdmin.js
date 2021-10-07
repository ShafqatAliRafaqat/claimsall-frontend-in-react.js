import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Loadable from 'react-loadable';
import Loading from '../../components/Loader/Loading';
import {aclAllowed} from '../../utils/common-utils';

const Dashboard = Loadable({loader: () => import('./Dashboard'), loading: Loading, delay: 400, timeout: 5000});
const Users = Loadable({loader: () => import('../User/Users'), loading: Loading, delay: 400, timeout: 5000});
const Grades = Loadable({loader: () => import('../Grade/Grades'), loading: Loading, delay: 400, timeout: 5000});
const MedicalPolicy = Loadable({
    loader: () => import('../MedicalPolicy/MedicalPolicy'),
    loading: Loading,
    delay: 400,
    timeout: 5000
});
const ACL = Loadable({loader: () => import('../ACL/ACL'), loading: Loading, delay: 400, timeout: 5000});
const ProcessFlow = Loadable({
    loader: () => import('../ProcessFlow/Add/ProcessFlowAdd'),
    loading: Loading,
    delay: 400,
    timeout: 5000
});

const Claims = Loadable({
    loader: () => import('../Claim/Claims'),
    loading: Loading,
    delay: 400,
    timeout: 5000
});


class OrgAdmin extends React.Component {

    getRoute(path, component, exact = false) {
        if (!aclAllowed(path)) {
            return null;
        }

        return <Route path={path} component={component} exact={exact}/>;
    }

    render() {
        return (
            <Switch>
                <Route path="/" exact component={Dashboard}/>
                {this.getRoute('/users', Users)}
                {this.getRoute('/grades', Grades)}
                {this.getRoute('/policies', MedicalPolicy)}
                {this.getRoute('/roles', ACL)}
                {this.getRoute('/process-flow', ProcessFlow)}
                {this.getRoute('/claims', Claims)}
            </Switch>
        );
    }
}

export default OrgAdmin;
