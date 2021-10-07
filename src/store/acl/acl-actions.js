import axios from '../../utils/axios';
import * as actionType from './acl-action-types';
import appConfig from '../../config/config.json';
import {message} from 'antd';

let lastRequestData = null;
let lastUrl = null;

const _addAcl = (args) => {
    return {
        type: actionType.ACL_ADD,
        payload: args
    };
};

export const _setProcessing = (processing) => {
    return {
        type: actionType.ACL_PROCESSING,
        payload: processing
    };
};


const _setAcl = (acl) => {
    return {
        type: actionType.ACL_SET,
        payload: acl
    };
};

const _setAcls = (acls) => {
    return {
        type: actionType.ACLS_SET,
        payload: acls
    };
};

const _setError = (error) => {
    return {
        type: actionType.ACL_ERROR,
        payload: error
    };
};

export const _reset = () => {
    return {
        type: actionType.ACL_RESET,
        payload: null
    };
};

export const setPagination = (pagination) => {
    return {
        type: actionType.ACL_PAGINATION_SET,
        payload: pagination
    };
};


export const addAcl = (acl) => {
    return (dispatch, getState) => {
        const {serverUrl} = appConfig;
        const config = {
            headers: {'Authorization': `Bearer ${getState().auth.token}`}
        };

        dispatch(_setProcessing(true));

        let url = `${serverUrl}/module`;

        if (acl.role && acl.role.id) {
            url = `${serverUrl}/update-module`;
        }

        axios.post(url, acl, config)
            .then((response) => {
                const {data} = response;

                // Success Add
                if (data && data.message) {
                    acl.message = data.message;
                    message.success(data.message);
                    dispatch(_addAcl(acl));
                }

            }).catch((err) => {
            let {response} = err;
            console.log('/addAcl', err.response);

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

export const deleteAcl = (id) => {
    return (dispatch, getState) => {
        const {serverUrl} = appConfig;
        const config = {
            headers: {'Authorization': `Bearer ${getState().auth.token}`}
        };

        dispatch(_setProcessing(true));

        let path = Array.isArray(id) ? 'delete-acl' : `role/${id}`;
        let url = `${serverUrl}/${path}`;

        let axiosPromise = Array.isArray(id) ? axios.post(url, {acl_ids: id}, config) : axios.delete(url, config);

        let respData = {};

        axiosPromise.then((response) => {
            const {data} = response;

            // Success Delete
            if (data && data.message) {
                respData.message = data.message;
            }
            let fetchData = {maintainPage: true};

            if ((Array.isArray(id) && id.length === getState().acl.acls.length) || (getState().acl.acls.length === 1)) {
                let currentPage = getState().acl.tablePagination.current;
                if (currentPage > 1) {
                    fetchData.pagination = {current: getState().acl.tablePagination.current - 1};
                }
            }

            message.success(response.data.message);

            dispatch(getAcls(fetchData));
        }).catch((err) => {
            let {response} = err;
            console.log('/deleteAcl', err.response);

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

export const getAcl = (id) => {
    return (dispatch, getState) => {
        const {serverUrl} = appConfig;
        const config = {
            headers: {'Authorization': `Bearer ${getState().auth.token}`}
        };

        dispatch(_setProcessing(true));

        axios.get(`${serverUrl}/module/${id}`, config)
            .then((response) => {
                const {data} = response;

                // Success Add
                if (data && data.data) {
                    let acl = data.data;
                    dispatch(_setAcl(acl));
                }

                dispatch(_setProcessing(false));
            }).catch((err) => {
            let {response} = err;
            console.log('/getAcl', err.response);

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

export const getAcls = (props) => {
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
                url = `${serverUrl}/role`;
                if (pagination.current > 0) {
                    url += `?page=${pagination.current}`;
                }
                lastUrl = url;
            }
        } else {
            url = `${serverUrl}/role`;
            requestData.searchFilters = searchFilters;
            if (filters) {
                requestData.filters = filters;
            }

            if (sorter) {
                requestData.sorter = sorter;
            }

            if (maintainPage) {
                pagination = getState().acl.tablePagination;
            }
            if (pagination.current) {
                url += `?page=${pagination.current}`;
            }

            lastRequestData = requestData;
            lastUrl = url;
        }

        axios.get(url, config)
            .then((response) => {
                const {data} = response;

                // Success Add
                if (data && data.data) {
                    let acls = data.data;
                    let payload = {acls, pagination: data.pagination, tablePagination: pagination};
                    dispatch(_setAcls(payload));
                }

                dispatch(_setProcessing(false));
            }).catch((err) => {
            let {response} = err;
            console.log('/getAcls', err.response);

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


