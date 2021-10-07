import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import {applyMiddleware, combineReducers, createStore} from 'redux';
import {reducer as formReducer} from 'redux-form'
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';

import auth from './store/auth/auth-reducer';
import menu from './store/menu/menu-reducer';
import organization from './store/organization/organization-reducer';
import user from './store/user/user-reducer';
import grade from './store/grade/grade-reducer';
import policy from './store/policy/policy-reducer';
import careservice from './store/care-service/careservice-reducer';
import healthmonitor from './store/healthmonitor/healthmonitor-reducer';
import acl from './store/acl/acl-reducer';
import claim from './store/claim/claim-reducer';

const combinedReducers = combineReducers({
    auth,
    menu,
    organization,
    user,
    grade,
    policy,
    careservice,
    healthmonitor,
    acl,
    claim,
    form: formReducer
});

export const store = createStore(combinedReducers, applyMiddleware(thunk));

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>, document.getElementById('root')
);
