import axios from "axios";
import {store} from "../index";
import serverConfig from '../config/config.json';
import moment from 'moment';

export const fetchUsers = (requestData) => {
    let users = [];

    let orgId = store.getState().auth.organization_id;

    if (requestData.filters && requestData.filters.organization_id) {
        requestData.organization_id = requestData.filters.organization_id;
        delete requestData.filters.organization_id;
    }
    else if (orgId) {
        requestData.organization_id = orgId;
    }

    return new Promise((resolve, reject) => {
        let url = `${serverConfig.serverUrl}/get-users`;
        axios.post(url, requestData, {headers: {'Authorization': `Bearer ${store.getState().auth.token}`}})
            .then((resp) => {
                let {data} = resp;
                if (data && data.data && data.data.length) {
                    users = data.data.map(user => {
                        let newUser = user;

                        if (user['administrative_role'] && user['administrative_role'].title) {
                            newUser.adminRoleTitle = user['administrative_role'].title;
                        }

                        newUser.age = user.dob ? moment().diff(moment(user.dob), 'years') : null;
                        newUser.isDoctor = (user.role_codes && user.role_codes.indexOf('doctor') > 0) ? 'YES' : 'NO';

                        return newUser;
                    });

                }
                resolve(users);
            })
            .catch(err => {
                console.log(err, err.response);
                reject(err.response);
            });
    });
};

export const fetchCareServices = (requestData) => {
    let careServiceRequests = [];

    return new Promise((resolve, reject) => {
        let url = `${serverConfig.serverUrl}/get-careservices`;
        axios.post(url, requestData, {headers: {'Authorization': `Bearer ${store.getState().auth.token}`}})
            .then((resp) => {
                let {data} = resp;
                if (data && data.data && data.data.length) {
                    careServiceRequests = data.data;
                }

                resolve(careServiceRequests);
            })
            .catch(err => {
                console.log(err, err.response);
                reject(err.response);
            });
    });
};

export const fetchOrganizations = (requestData) => {
    let organizations = [];

    return new Promise((resolve, reject) => {
        let url = `${serverConfig.serverUrl}/get-organizations`;
        axios.post(url, requestData, {headers: {'Authorization': `Bearer ${store.getState().auth.token}`}})
            .then((resp) => {
                let {data} = resp;
                if (data && data.data && data.data.length) {
                    organizations = data.data;
                }
                resolve(organizations);
            })
            .catch(err => {
                console.log(err, err.response);
                reject(err.response);
            });
    });
};