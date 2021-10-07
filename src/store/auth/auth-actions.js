import axios from '../../utils/axios';
import * as actionType from './auth-action-types';
import appConfig from '../../config/config.json';
import {validValues} from '../../utils/common-utils';
import {message} from 'antd';
import _axios from 'axios';

const loginUser = (args) => {
    return {
        type: actionType.LOGIN,
        payload: args
    };
};

const logoutUser = () => {
    return {
        type: actionType.LOGOUT
    };
};

const setProcessing = (processing) => {
    return {
        type: actionType.PROCESSING,
        payload: processing
    };
};


export const login = (loginData) => {
    return (dispatch) => {
        const {email, password, remember} = loginData;

        const {vpnKey, serverUrl} = appConfig;

        let result = {};

        dispatch(setProcessing(true));

        _axios.post(`${serverUrl}/web-login`, {email, password, vpnKey, remember})
            .then((response) => {

                const {data} = response;

                // Success login
                if (data && data.authorization) {
                    let token = data.authorization;
                    let role = data.data.userRole;
                    let {adminPanelMenu} = data.data;
                    let organization_id = data.data.organization && data.data.organization.id ? data.data.organization.id : null;
                    let organizationName = data.data.organization && data.data.organization.name ? data.data.organization.name : null
                    let acl = [];

                    if (adminPanelMenu && adminPanelMenu.length) {
                        acl = processAcl(adminPanelMenu);
                        console.log('acl', acl);
                    }

                    if (!validValues(token, role)) {
                        result.error = 'Invalid authorization response from server.';
                    }
                    else {
                        result = {
                            token,
                            role,
                            organization_id,
                            remember,
                            acl,
                            organizationName,
                            name: `${data.data.first_name} ${data.data.last_name}`
                        };
                    }

                    console.log('loginResult', result);
                    dispatch(loginUser(result));
                } else {
                    console.log(response.data);
                    result.error = "Invalid Credentials";
                    dispatch(loginUser(result));
                }

                dispatch(setProcessing(false));

            }).catch((err) => {
            console.log('/login', err.response);

            if (err.response && err.response.data && err.response.data.message) {
                result.error = err.response.data.message;
            } else {
                result.error = "Invalid Credentials";
            }
            dispatch(setProcessing(false));
            dispatch(loginUser(result));
        });
    };
};


const addToAcl = (href, acl) => {
    if (href && acl) {
        if (href.indexOf(",") < 0) {
            acl.push(href);
        } else {
            let hrefs = href.split(",");
            hrefs.forEach(link => {
                acl.push(link.trim());
            });
        }
    }
};

const processAcl = (adminPanelMenu) => {
    let acl = [];

    adminPanelMenu.forEach(menu => {
            if (menu.href && acl.indexOf(menu.href) < 0) {
                addToAcl(menu.href, acl);
            }

            if (menu.childern) {
                let {childern} = menu;

                for (let key in childern) {
                    if (childern.hasOwnProperty(key)) {
                        let _child = childern[key];
                        if (_child.href && acl.indexOf(_child.href) < 0) {
                            addToAcl(_child.href, acl);
                        }
                    }
                }
            }
        }
    );

    return acl;
};

export const logout = (msg) => {
    return (dispatch, getState) => {
        const config = {
            headers: {'Authorization': `Bearer ${getState().auth.token}`}
        };

        if (msg) {
            message.error(msg);
            dispatch(logoutUser());
            dispatch({type: 'RESET_REDUX'});
        }
        else {
            axios.get(`${appConfig.serverUrl}/logout?admin=y`, config)
                .then(() => {
                    // logout success
                    dispatch(logoutUser());
                    dispatch({type: 'RESET_REDUX'});
                }).catch(() => {
                dispatch(logoutUser());
            });
        }
    };
};
