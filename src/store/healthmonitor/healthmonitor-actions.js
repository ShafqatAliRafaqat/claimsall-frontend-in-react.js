import axios from '../../utils/axios';
import * as actionType from './healthmonitor-action-types';
import appConfig from '../../config/config.json';

let lastRequestData = null;
let lastUrl = null;

const _addHealthmonitor = (args) => {
    return {
        type: actionType.HEALTHMONITOR_ADD,
        payload: args
    };
};

export const _setProcessing = (processing) => {
    return {
        type: actionType.HEALTHMONITOR_PROCESSING,
        payload: processing
    };
};


const _setHealthmonitor = (healthmonitor) => {
    return {
        type: actionType.HEALTHMONITOR_SET,
        payload: healthmonitor
    };
};

const _setHealthmonitors = (healthmonitors) => {
    return {
        type: actionType.HEALTHMONITORS_SET,
        payload: healthmonitors
    };
};

const _setError = (error) => {
    return {
        type: actionType.HEALTHMONITOR_ERROR,
        payload: error
    };
};

export const _reset = () => {
    return {
        type: actionType.HEALTHMONITOR_RESET,
        payload: null
    };
};

export const setPagination = (pagination) => {
    return {
        type: actionType.HEALTHMONITOR_PAGINATION_SET,
        payload: pagination
    };
};


export const addHealthmonitor = (healthmonitor) => {
    return (dispatch, getState) => {
        const {serverUrl} = appConfig;
        const config = {
            headers: {'Authorization': `Bearer ${getState().auth.token}`}
        };

        dispatch(_setProcessing(true));

        let url = `${serverUrl}/health-monitoring-type`;

        if (healthmonitor.id) {
            url += `/${healthmonitor.id}`;
        }

        axios.post(url, healthmonitor, config)
            .then((response) => {
                const {data} = response;

                // Success Add
                if (data && data.message) {
                    healthmonitor.message = data.message;
                    dispatch(_addHealthmonitor(healthmonitor));
                }

            }).catch((err) => {
            let {response} = err;
            console.log('/addHealthmonitor', err.response);

            if (response && response.data && response.data.message) {
                dispatch(_setError(response.data.message));
            } else {
                dispatch(_setError("Some error occurred at server, please try again later"));
            }

            dispatch(_setProcessing(false));
        });
    };
};

export const deleteHealthmonitor = (id) => {
    return (dispatch, getState) => {
        const {serverUrl} = appConfig;
        const config = {
            headers: {'Authorization': `Bearer ${getState().auth.token}`}
        };

        dispatch(_setProcessing(true));

        let path = Array.isArray(id) ? 'delete-healthmonitor' : `health-monitoring-type/${id}`;
        let url = `${serverUrl}/${path}`;

        let axiosPromise = Array.isArray(id) ? axios.post(url, {healthmonitor_ids: id}, config) : axios.delete(url, config);

        let respData = {};

        axiosPromise.then((response) => {
            const {data} = response;

            // Success Delete
            if (data && data.message) {
                respData.message = data.message;
            }
            let fetchData = {maintainPage: true};

            if ((Array.isArray(id) && id.length === getState().healthmonitor.healthmonitors.length) || (getState().healthmonitor.healthmonitors.length === 1)) {
                let currentPage = getState().healthmonitor.tablePagination.current;
                if (currentPage > 1) {
                    fetchData.pagination = {current: getState().healthmonitor.tablePagination.current - 1};
                }
            }

            dispatch(getHealthmonitors(fetchData));
        }).catch((err) => {
            let {response} = err;
            console.log('/deleteHealthmonitor', err.response);

            if (response && response.data && response.data.message) {
                dispatch(_setError(response.data.message));
            } else {
                dispatch(_setError("Some error occurred at server, please try again later"));
            }

            dispatch(_setProcessing(false));
        });
    };
};

export const getHealthmonitor = (id) => {
    return (dispatch, getState) => {
        const {serverUrl} = appConfig;
        const config = {
            headers: {'Authorization': `Bearer ${getState().auth.token}`}
        };

        dispatch(_setProcessing(true));

        axios.get(`${serverUrl}/health-monitoring-type/${id}`, config)
            .then((response) => {
                const {data} = response;

                // Success Add
                if (data && data.data) {
                    let healthmonitor = data.data;
                    dispatch(_setHealthmonitor(healthmonitor));
                }

                dispatch(_setProcessing(false));
            }).catch((err) => {
            let {response} = err;
            console.log('/getHealthmonitor', err.response);

            if (response && response.data && response.data.message) {
                dispatch(_setError(response.data.message));
            } else {
                dispatch(_setError("Some error occurred at server, please try again later"));
            }

            dispatch(_setProcessing(false));
        });
    };
};

export const getHealthmonitors = (props) => {
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
                url = `${serverUrl}/health-monitoring-type`;
                if (pagination.current > 0) {
                    url += `?page=${pagination.current}`;
                }
                lastUrl = url;
            }
        } else {
            url = `${serverUrl}/health-monitoring-type`;
            requestData.searchFilters = searchFilters;
            if (filters) {
                requestData.filters = filters;
            }

            if (sorter) {
                requestData.sorter = sorter;
            }

            if (maintainPage) {
                pagination = getState().healthmonitor.tablePagination;
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
                    let healthmonitors = data.data;
                    let payload = {healthmonitors, pagination: data.pagination, tablePagination: pagination};
                    dispatch(_setHealthmonitors(payload));
                }

                dispatch(_setProcessing(false));
            }).catch((err) => {
            let {response} = err;
            console.log('/getHealthmonitors', err.response);

            if (response && response.data && response.data.message) {
                dispatch(_setError(response.data.message));
            } else {
                dispatch(_setError("Some error occurred at server, please try again later"));
            }

            dispatch(_setProcessing(false));
        });
    };
};


