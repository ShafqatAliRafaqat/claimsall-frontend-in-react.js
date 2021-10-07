import axios from '../../utils/axios';
import * as actionType from './user-action-types';
import appConfig from '../../config/config.json';
import {message} from 'antd';

let lastRequestData = null;
let lastUrl = null;

const _addUser = (args) => {
    return {
        type: actionType.USER_ADD,
        payload: args
    };
};


export const _setProcessing = (processing) => {
    return {
        type: actionType.USER_PROCESSING,
        payload: processing
    };
};


export const _setUser = (user) => {
    return {
        type: actionType.USER_SET,
        payload: user
    };
};

const _setUsers = (users) => {
    let filteredUsers = filterUsers(users);
    return {
        type: actionType.USERS_SET,
        payload: filteredUsers
    };
};

const _setError = (error) => {
    return {
        type: actionType.USER_ERROR,
        payload: error
    };
};

export const _reset = () => {
    return {
        type: actionType.USER_RESET,
        payload: null
    };
};

export const setPagination = (pagination) => {
    return {
        type: actionType.USER_PAGINATION_SET,
        payload: pagination
    };
};


export const addUser = (_user) => {
    let user = {..._user};

    return (dispatch, getState) => {
        const {serverUrl} = appConfig;

        const config = {
            headers: {'Authorization': `Bearer ${getState().auth.token}`}
        };

        dispatch(_setProcessing(true));

        if (getState().auth.organization_id) {
            user.organization_id = getState().auth.organization_id;
        }

        let url = `${serverUrl}/user`;
        let axiosPromise = null;

        if (!user.basic_salary) {
            user.basic_salary = 0;
        }

        if (!user.gross_salary) {
            user.gross_salary = 0;
        }

        if (user.id) {
            url += `/${user.id}`;
            axiosPromise = axios.put(url, user, config);
        }
        else {
            axiosPromise = axios.post(url, user, config);
        }

        axiosPromise.then((response) => {
            const {data} = response;

            // Success Add
            if (data && data.message) {
                message.success(data.message);

                user.message = data.message;
                user.id = user.id || data.data;
                dispatch(_addUser(user));
            }
        }).catch((err) => {
            let {response} = err;
            console.log('/addUser', err.response);

            dispatch(_addUser(_user));

            if (response && response.data && response.data.message) {
                message.error(response.data.message);
                dispatch(_setError(response.data.message));
            }
            else {
                dispatch(_setError("Some error occurred at server, please try again later"));
            }

            dispatch(_setProcessing(false));
        });
    };
};

export const deleteUser = (id, _organization_id, role_code) => {
    return (dispatch, getState) => {
        const {serverUrl} = appConfig;
        const config = {
            headers: {'Authorization': `Bearer ${getState().auth.token}`}
        };

        dispatch(_setProcessing(true));

        const organization_id = getState().auth.organization_id || _organization_id;

        const multiDelete = (Array.isArray(id) || organization_id || role_code);
        const path = multiDelete ? 'delete-user' : `user/${id}`;
        let url = `${serverUrl}/${path}`;

        let user_ids = [];
        if (Array.isArray(id)) {
            user_ids = id;
        } else {
            user_ids.push(id);
        }

        let axiosPromise = multiDelete ? axios.post(url, {
            user_ids,
            organization_id,
            role_code
        }, config) : axios.delete(url, config);

        axiosPromise.then((response) => {
            let fetchData = {maintainPage: true};

            if ((Array.isArray(id) && id.length === getState().user.users.length) || (getState().user.users.length === 1)) {
                let currentPage = getState().user.tablePagination.current;
                if (currentPage > 1) {
                    fetchData.pagination = {current: getState().user.tablePagination.current - 1};
                }
            }

            message.success(response.data.message);

            dispatch(getUsers(fetchData));
        }).catch((err) => {
            let {response} = err;
            console.log('/deleteUser', err.response);

            if (response && response.data && response.data.message) {
                message.error(response.data.message);
                dispatch(_setError(response.data.message));
            } else {
                message.error("Some error occurred at server, please try again later");
                dispatch(_setError("Some error occurred at server, please try again later"));
            }

            dispatch(_setProcessing(false));
        });
    };
};

export const getUser = (id) => {
    return (dispatch, getState) => {
        const {serverUrl} = appConfig;
        const config = {
            headers: {'Authorization': `Bearer ${getState().auth.token}`}
        };

        dispatch(_setProcessing(true));

        axios.get(`${serverUrl}/user/${id}`, config)
            .then((response) => {
                const {data} = response;

                // Success Add
                if (data && data.data) {
                    let user = data.data;
                    dispatch(_setUser(user));
                }

                dispatch(_setProcessing(false));
            }).catch((err) => {
            let {response} = err;
            console.log('/getUser', err.response);

            if (response && response.data && response.data.message) {
                dispatch(_setError(response.data.message));
                message.error(response.data.message);
            } else {
                message.error("Some error occurred at server, please try again later");
                dispatch(_setError("Some error occurred at server, please try again later"));
            }

            dispatch(_setProcessing(false));
        });
    };
};

export const getUsers = (props) => {
    let {pagination, searchFilters, filters, maintainPage, sorter} = props;

    return (dispatch, getState) => {
        const {serverUrl} = appConfig;
        const config = {
            headers: {'Authorization': `Bearer ${getState().auth.token}`}
        };

        dispatch(_setProcessing(true));
        let url;
        let requestData = {};

        if (maintainPage) {
            url = lastUrl;
            requestData = lastRequestData;

            if (pagination) {
                url = `${serverUrl}/get-users`;
                if (pagination.current > 0) {
                    url += `?page=${pagination.current}`;
                }
                lastUrl = url;
            }
        }
        else {
            url = `${serverUrl}/get-users`;
            requestData.searchFilters = searchFilters;

            if (getState().auth.organization_id) {
                requestData.organization_id = getState().auth.organization_id;
            }

            if (filters) {
                let _filters = {...filters};
                if (!requestData.organization_id && _filters.organization_id) {
                    requestData.organization_id = _filters.organization_id;
                    requestData.pending = _filters.pending;
                    delete _filters.organization_id;
                }
                requestData.filters = _filters;
            }

            if (sorter) {
                requestData.sorter = sorter;
            }

            if (maintainPage) {
                pagination = getState().user.tablePagination;
            }
            if (pagination.current) {
                url += `?page=${pagination.current}`;
            }

            lastRequestData = requestData;
            lastUrl = url;
        }

        axios.post(url, requestData, config)
            .then((response) => {
                const {data} = response;

                // Success Add
                if (data && data.data) {
                    console.log('data', data);
                    let users = data.data;
                    let payload = {users, pagination: data.pagination, tablePagination: pagination};

                    dispatch(_setUsers(payload));
                }

                dispatch(_setProcessing(false));
            }).catch((err) => {
            let {response} = err;
            console.log('/getUsers', err.response);

            if (response && response.data && response.data.message) {
                dispatch(_setError(response.data.message));
                message.error(response.data.message);
            } else {
                dispatch(_setError("Some error occurred at server, please try again later"));
                message.error("Some error occurred at server, please try again later");
            }

            dispatch(_setProcessing(false));
        });
    };
};

const filterUsers = (data) => {
    let filteredUsers = data.users.filter(user => user.role_codes.indexOf('superAdmin') < 0);
    data.users = filteredUsers;
    return data;
};
