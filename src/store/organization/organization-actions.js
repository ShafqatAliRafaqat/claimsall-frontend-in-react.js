import axios from '../../utils/axios';
import * as actionType from './organization-action-types';
import appConfig from '../../config/config.json';
import {message} from 'antd';

let lastRequestData = null;
let lastUrl = null;

const _addOrganization = (args) => {
    return {
        type: actionType.ORGANIZATION_ADD,
        payload: args
    };
};

export const _setProcessing = (processing) => {
    return {
        type: actionType.ORGANIZATION_PROCESSING,
        payload: processing
    };
};


const _setOrganization = (organization) => {
    return {
        type: actionType.ORGANIZATION_SET,
        payload: organization
    };
};

const _setOrganizations = (organizations) => {
    return {
        type: actionType.ORGANIZATIONS_SET,
        payload: organizations
    };
};

const _setError = (error) => {
    return {
        type: actionType.ORGANIZATION_ERROR,
        payload: error
    };
};

export const _reset = () => {
    return {
        type: actionType.ORGANIZATION_RESET,
        payload: null
    };
};

export const setPagination = (pagination) => {
    return {
        type: actionType.ORGANIZATION_PAGINATION_SET,
        payload: pagination
    };
};


export const addOrganization = (_organization) => {
    let organization = {..._organization};
    return (dispatch, getState) => {
        const {serverUrl} = appConfig;
        const config = {
            headers: {'Authorization': `Bearer ${getState().auth.token}`}
        };

        dispatch(_setProcessing(true));

        let url = `${serverUrl}/organization`;

        if (organization.id) {
            organization._method = 'PUT';
            url += `/${organization.id}`;
        }

        axios.post(url, organization, config)
            .then((response) => {
                const {data} = response;

                // Success Add
                if (data && data.message) {
                    message.success(data.message);
                    organization.message = data.message;
                    dispatch(_addOrganization(organization));
                }

            }).catch((err) => {
            let {response} = err;
            console.log('/addOrganization', err.response);

            dispatch(_addOrganization(_organization));

            if (response && response.data && response.data.message) {
                dispatch(_setError(response.data.message));
                message.error(response.data.message);
            }
            else {
                message.error("Some error occurred at server, please try again later");
                dispatch(_setError("Some error occurred at server, please try again later"));
            }

            dispatch(_setProcessing(false));
        });
    };
};

export const deleteOrganization = (id) => {
    return (dispatch, getState) => {
        const {serverUrl} = appConfig;
        const config = {
            headers: {'Authorization': `Bearer ${getState().auth.token}`}
        };

        dispatch(_setProcessing(true));

        let path = Array.isArray(id) ? 'delete-organization' : `organization/${id}`;
        let url = `${serverUrl}/${path}`;

        let axiosPromise = Array.isArray(id) ? axios.post(url, {organization_ids: id}, config) : axios.delete(url, config);

        let respData = {};

        axiosPromise.then((response) => {
            const {data} = response;

            // Success Delete
            if (data && data.message) {
                respData.message = data.message;
            }
            let fetchData = {maintainPage: true};

            if ((Array.isArray(id) && id.length === getState().organization.organizations.length) || (getState().organization.organizations.length === 1)) {
                let currentPage = getState().organization.tablePagination.current;
                if (currentPage > 1) {
                    fetchData.pagination = {current: getState().organization.tablePagination.current - 1};
                }
            }

            message.success(response.data.message);

            dispatch(getOrganizations(fetchData));
        }).catch((err) => {
            let {response} = err;
            console.log('/deleteOrganization', err.response);

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

export const getOrganization = (id) => {
    return (dispatch, getState) => {
        const {serverUrl} = appConfig;
        const config = {
            headers: {'Authorization': `Bearer ${getState().auth.token}`}
        };

        dispatch(_setProcessing(true));

        axios.get(`${serverUrl}/organization/${id}`, config)
            .then((response) => {
                const {data} = response;

                // Success Add
                if (data && data.data) {
                    let organization = data.data;
                    dispatch(_setOrganization(organization));
                }

                dispatch(_setProcessing(false));
            }).catch((err) => {
            let {response} = err;
            console.log('/getOrganization', err.response);

            if (response && response.data && response.data.message) {
                dispatch(_setError(response.data.message));
            } else {
                dispatch(_setError("Some error occurred at server, please try again later"));
            }

            dispatch(_setProcessing(false));
        });
    };
};

export const getOrganizations = (props) => {
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
                url = `${serverUrl}/get-organizations`;
                if (pagination.current > 0) {
                    url += `?page=${pagination.current}`;
                }
                lastUrl = url;
            }
        }
        else {
            url = `${serverUrl}/get-organizations`;
            requestData.searchFilters = searchFilters;
            if (filters) {
                requestData.filters = filters;
            }

            if (sorter) {
                requestData.sorter = sorter;
            }

            if (maintainPage) {
                pagination = getState().organization.tablePagination;
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
                    let organizations = data.data;
                    let payload = {organizations, pagination: data.pagination, tablePagination: pagination};
                    dispatch(_setOrganizations(payload));
                }

                dispatch(_setProcessing(false));
            }).catch((err) => {
            let {response} = err;
            console.log('/getOrganizations', err.response);

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


