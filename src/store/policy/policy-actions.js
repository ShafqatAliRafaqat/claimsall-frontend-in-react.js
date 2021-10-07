import axios from '../../utils/axios';
import * as actionType from './policy-action-types';
import appConfig from '../../config/config.json';
import {message} from 'antd';

let lastRequestData = null;
let lastUrl = null;

const _addPolicy = (args) => {
    return {
        type: actionType.POLICY_ADD,
        payload: args
    };
};

export const _setProcessing = (processing) => {
    return {
        type: actionType.POLICY_PROCESSING,
        payload: processing
    };
};


const _setPolicy = (policy) => {
    return {
        type: actionType.POLICY_SET,
        payload: policy
    };
};

const _setPolicies = (policies) => {
    return {
        type: actionType.POLICIES_SET,
        payload: policies
    };
};

const _setError = (error) => {
    return {
        type: actionType.POLICY_ERROR,
        payload: error
    };
};

export const _reset = () => {
    return {
        type: actionType.POLICY_RESET,
        payload: null
    };
};

export const setPagination = (pagination) => {
    return {
        type: actionType.POLICY_PAGINATION_SET,
        payload: pagination
    };
};

const transformForSend = (_formData) => {
    let formData = {..._formData};

    if (formData.policy_type === 'in_patient') {
        formData['policy_covered_persons'] = formData['1'];
        formData['policy_covered_persons']['claim_type_id'] = '1';
    } else if (formData.policy_type === 'out_patient') {
        formData['policy_covered_persons'] = formData['2'];
        formData['policy_covered_persons']['claim_type_id'] = '2';
    }
    else if (formData.policy_type === 'maternity') {
        formData['policy_covered_persons'] = formData['3'];
        formData['policy_covered_persons']['claim_type_id'] = '3';
    }

    delete formData['1'];
    delete formData['2'];
    delete formData['3'];
    delete formData['errors'];

    if (formData.policy_level !== 'grade') {
        delete formData.grade_id;
    }

    return formData;
};


export const addPolicy = (_policy) => {
    let policy = transformForSend(_policy);

    return (dispatch, getState) => {
        const {serverUrl} = appConfig;
        const config = {
            headers: {'Authorization': `Bearer ${getState().auth.token}`}
        };

        dispatch(_setProcessing(true));

        let url = `${serverUrl}/organization-policy`;

        let axiosPromise;
        if (policy.id) {
            url += `/${policy.id}`;
            axiosPromise = axios.put(url, policy, config);
        } else {
            axiosPromise = axios.post(url, policy, config);
        }

        axiosPromise
            .then((response) => {
                const {data} = response;

                // Success Add
                if (data && data.message) {
                    message.success(data.message);
                    policy.message = data.message;
                    dispatch(_addPolicy(policy));
                }

            }).catch((err) => {
            let {response} = err;
            console.log('/addPolicy', err.response);

            console.log('_addPolicy', _policy);
            dispatch(_addPolicy(_policy));

            if (response && response.data && response.data.message) {
                dispatch(_setError(response.data.message));
                message.error(response.data.message);
                console.log('Err Message', response.data.message);
            } else {
                message.error("Some error occurred at server, please try again later");
                dispatch(_setError("Some error occurred at server, please try again later"));
            }

            dispatch(_setProcessing(false));
        });
    };
};

const transformPolicy = (_policy) => {
    if (_policy && _policy.name) {

        let policy = {};
        let indoor = {};
        let outdoor = {};
        let maternity = {};

        // general
        policy.id = _policy.id;
        policy.name = _policy.name;
        policy.description = _policy.description;
        policy.short_code = _policy.short_code;
        policy.grade_id = _policy.grade_id;
        policy.policy_type = _policy.policy_type;
        policy.policy_level = _policy.policy_level;
        policy.type = _policy.type;


        // indoor
        indoor.indoor_limit = _policy.indoor_limit;
        indoor.indoor_room_limit = _policy.indoor_room_limit;
        indoor.relationship_type_ids = [];
        if (_policy.policies['1']) {
            for (let type in _policy.policies['1']['relationshipTypes']) {
                indoor.relationship_type_ids.push(type);
            }
        }
        // outdoor
        outdoor.outdoor_type = _policy.outdoor_type;
        outdoor.outdoor_amount = _policy.outdoor_amount;
        outdoor.relationship_type_ids = [];
        if (_policy.policies['2']) {
            for (let type in _policy.policies['2']['relationshipTypes']) {
                outdoor.relationship_type_ids.push(type);
            }
        }
        // maternity
        maternity.maternity_room_limit = _policy.maternity_room_limit;
        maternity.maternity_normal_case_limit = _policy.maternity_normal_case_limit;
        maternity.maternity_csection_case_limit = _policy.maternity_csection_case_limit;
        maternity.relationship_type_ids = [];

        if (_policy.policies['3']) {
            for (let type in _policy.policies['3']['relationshipTypes']) {
                maternity.relationship_type_ids.push(type);
            }
        }
        policy['1'] = indoor;
        policy['2'] = outdoor;
        policy['3'] = maternity;


        console.log('policy Transform', policy);

        return policy;
    }
};


export const deletePolicy = (id) => {
    return (dispatch, getState) => {
        const {serverUrl} = appConfig;
        const config = {
            headers: {'Authorization': `Bearer ${getState().auth.token}`}
        };

        dispatch(_setProcessing(true));

        let path = Array.isArray(id) ? 'delete-policy' : `organization-policy/${id}`;
        let url = `${serverUrl}/${path}`;

        let axiosPromise = Array.isArray(id) ? axios.post(url, {policy_ids: id}, config) : axios.delete(url, config);

        let respData = {};

        axiosPromise.then((response) => {
            const {data} = response;

            // Success Delete
            if (data && data.message) {
                respData.message = data.message;
            }
            let fetchData = {maintainPage: true};

            if ((Array.isArray(id) && id.length === getState().policy.policies.length) || (getState().policy.policies.length === 1)) {
                let currentPage = getState().policy.tablePagination.current;
                if (currentPage > 1) {
                    fetchData.pagination = {current: getState().policy.tablePagination.current - 1};
                }
            }

            message.success(response.data.message);

            dispatch(getPolicies(fetchData));
        }).catch((err) => {
            let {response} = err;
            console.log('/deletePolicy', err.response);

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

export const getPolicy = (id) => {
    return (dispatch, getState) => {
        const {serverUrl} = appConfig;
        const config = {
            headers: {'Authorization': `Bearer ${getState().auth.token}`}
        };

        dispatch(_setProcessing(true));

        axios.get(`${serverUrl}/organization-policy/${id}`, config)
            .then((response) => {
                const {data} = response;

                // Success Add
                if (data && data.data) {
                    let policy = data.data;
                    dispatch(_setPolicy(transformPolicy(policy)));
                }

                dispatch(_setProcessing(false));
            }).catch((err) => {
            let {response} = err;
            console.log('/getPolicy', err.response);

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

export const getPolicies = (props) => {
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
                url = `${serverUrl}/get-policies`;
                if (pagination.current > 0) {
                    url += `?page=${pagination.current}`;
                }
                lastUrl = url;
            }
        } else {
            url = `${serverUrl}/get-policies`;
            requestData.searchFilters = searchFilters;

            if (getState().auth.organization_id) {
                requestData.organization_id = getState().auth.organization_id;
            }

            if (filters) {
                let _filters = {...filters};
                if (!requestData.organization_id && _filters.organization_id) {
                    requestData.organization_id = _filters.organization_id;
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
                    let policies = data.data;
                    let payload = {policies, pagination: data.pagination, tablePagination: pagination};
                    dispatch(_setPolicies(payload));
                }

                dispatch(_setProcessing(false));
            }).catch((err) => {
            let {response} = err;
            console.log('/getPolicies', err.response);

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


