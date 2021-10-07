import axios from '../../utils/axios';
import * as actionType from './careservice-action-types';
import appConfig from '../../config/config.json';
import {message} from 'antd';


let lastRequestData = null;
let lastUrl = null;

const _addCareservice = (args) => {
    return {
        type: actionType.CARESERVICE_ADD,
        payload: args
    };
};

export const _setProcessing = (processing) => {
    return {
        type: actionType.CARESERVICE_PROCESSING,
        payload: processing
    };
};


const _setCareservice = (careservice) => {
    return {
        type: actionType.CARESERVICE_SET,
        payload: careservice
    };
};

const _setCareservices = (careservices) => {
    return {
        type: actionType.CARESERVICES_SET,
        payload: careservices
    };
};

const _setError = (error) => {
    return {
        type: actionType.CARESERVICE_ERROR,
        payload: error
    };
};

export const _reset = () => {
    return {
        type: actionType.CARESERVICE_RESET,
        payload: null
    };
};

export const setPagination = (pagination) => {
    return {
        type: actionType.CARESERVICE_PAGINATION_SET,
        payload: pagination
    };
};


export const addCareservice = (_careservice) => {
    let careservice = {..._careservice};
    return (dispatch, getState) => {
        const {serverUrl} = appConfig;
        const config = {
            headers: {'Authorization': `Bearer ${getState().auth.token}`}
        };

        dispatch(_setProcessing(true));

        let url = `${serverUrl}/change-careservice-status`;

        axios.post(url, careservice, config)
            .then((response) => {
                const {data} = response;

                // Success Add
                if (data && data.message) {
                    careservice.message = data.message;
                    message.success(data.message);
                    dispatch(_addCareservice(careservice));
                }

            }).catch((err) => {
            let {response} = err;
            console.log('/addCareservice', err.response);

            dispatch(_addCareservice(_careservice));

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

export const getCareservice = (id) => {
    return (dispatch, getState) => {
        const {serverUrl} = appConfig;
        const config = {
            headers: {'Authorization': `Bearer ${getState().auth.token}`}
        };

        dispatch(_setProcessing(true));

        axios.get(`${serverUrl}/care-service/${id}`, config)
            .then((response) => {
                const {data} = response;

                // Success Add
                if (data && data.data) {
                    let careservice = data.data;
                    dispatch(_setCareservice(careservice));
                }

                dispatch(_setProcessing(false));
            }).catch((err) => {
            let {response} = err;

            console.log('/getCareservice', err.response);

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

export const getCareservices = (props) => {
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
                url = `${serverUrl}/get-careservices`
                if (pagination.current > 0) {
                    url += `?page=${pagination.current}`;
                }
                lastUrl = url;
            }
        } else {
            url = `${serverUrl}/get-careservices`;
            requestData.searchFilters = searchFilters;
            if (filters) {
                requestData.filters = filters;
            }

            if (sorter) {
                requestData.sorter = sorter;
            }

            if (maintainPage) {
                pagination = getState().careservice.tablePagination;
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
                    let careservices = data.data;
                    let payload = {careservices, pagination: data.pagination, tablePagination: pagination};
                    dispatch(_setCareservices(payload));
                }

                dispatch(_setProcessing(false));
            }).catch((err) => {
            let {response} = err;
            console.log('/getCareservices', err.response);

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


