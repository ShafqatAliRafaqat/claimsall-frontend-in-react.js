import React from 'react';
import {withRouter, Route, Switch} from 'react-router-dom';
import Add from './Add/ProcessFlowAdd';

class ProcessFlow extends React.Component {

    add = () => {
        return <Add {...this.props} />
    };

    render() {
        return (
            <Switch>
                <Route path={`/process-flow`} component={<Add/>}/>
            </Switch>
        );
    }
}

export default withRouter(ProcessFlow);

