import axios from '../../utils/axios';
import * as actionType from './claim-action-types';
import appConfig from '../../config/config.json';
import {message} from 'antd';
import {toDisplayPolicyLevel, toDisplayPolicyType, formatAmount} from '../../utils/common-utils';

let lastRequestData = null;
let lastUrl = null;

const _addClaim = (args) => {
    return {
        type: actionType.CLAIM_ADD,
        payload: args
    };
};

export const _setProcessing = (processing) => {
    return {
        type: actionType.CLAIM_PROCESSING,
        payload: processing
    };
};


const _setTimeLine = (timeLine) => {
    return {
        type: actionType.CLAIM_TIMELINE_SET,
        payload: timeLine
    };
};

const _setActiveClaim = (timeLineId) => {
    return {
        type: actionType.CLAIM_TIMELINE_ACTIVE_SET,
        payload: timeLineId
    };
};

const _setClaims = (claims) => {
    return {
        type: actionType.CLAIMS_SET,
        payload: claims
    };
};

const _setError = (error) => {
    return {
        type: actionType.CLAIM_ERROR,
        payload: error
    };
};

export const _reset = () => {
    return {
        type: actionType.CLAIM_RESET,
        payload: null
    };
};

export const setPagination = (pagination) => {
    return {
        type: actionType.CLAIM_PAGINATION_SET,
        payload: pagination
    };
};

export const setActiveClaim = (claimId) => {
    return (dispatch) => {
        dispatch(_setProcessing(true));
        setTimeout(() => {
            dispatch(_setActiveClaim(claimId));
            dispatch(_setProcessing(false));
        }, 250);
    };
};


export const addClaim = (_claim) => {
    let claim = {..._claim};
    return (dispatch, getState) => {
        const {serverUrl} = appConfig;
        const config = {
            headers: {'Authorization': `Bearer ${getState().auth.token}`}
        };

        dispatch(_setProcessing(true));

        let url = `${serverUrl}/claim`;

        if (claim.id) {
            claim._method = 'PUT';
            url += `/${claim.id}`;
        }

        axios.post(url, claim, config)
            .then((response) => {
                const {data} = response;

                // Success Add
                if (data && data.message) {
                    message.success(data.message);
                    claim.message = data.message;
                    dispatch(_addClaim(claim));
                }

            }).catch((err) => {
            let {response} = err;
            console.log('/addClaim', err.response);

            dispatch(_addClaim(_claim));

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

export const deleteClaim = (id) => {
    return (dispatch, getState) => {
        const {serverUrl} = appConfig;
        const config = {
            headers: {'Authorization': `Bearer ${getState().auth.token}`}
        };

        dispatch(_setProcessing(true));

        let path = Array.isArray(id) ? 'delete-claim' : `claim/${id}`;
        let url = `${serverUrl}/${path}`;

        let axiosPromise = Array.isArray(id) ? axios.post(url, {claim_ids: id}, config) : axios.delete(url, config);

        let respData = {};

        axiosPromise.then((response) => {
            const {data} = response;

            // Success Delete
            if (data && data.message) {
                respData.message = data.message;
            }
            let fetchData = {maintainPage: true};

            if ((Array.isArray(id) && id.length === getState().claim.claims.length) || (getState().claim.claims.length === 1)) {
                let currentPage = getState().claim.tablePagination.current;
                if (currentPage > 1) {
                    fetchData.pagination = {current: getState().claim.tablePagination.current - 1};
                }
            }

            message.success(response.data.message);

            dispatch(getClaims(fetchData));
        }).catch((err) => {
            let {response} = err;
            console.log('/deleteClaim', err.response);

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

export const getClaim = (id) => {
    return (dispatch, getState) => {
        const {serverUrl} = appConfig;
        const config = {
            headers: {'Authorization': `Bearer ${getState().auth.token}`}
        };

        dispatch(_setProcessing(true));

        axios.get(`${serverUrl}/get-claim-transactions?claim_id=${id}`, config)
            .then((response) => {
                const {data} = response;

                // Success Add
                if (data && data.data) {
                    let claimTransactions = data.data;
                    dispatch(_setTimeLine(transformToTimeLine(claimTransactions)));
                }

                dispatch(_setProcessing(false));
            }).catch((err) => {
            let {response} = err;
            console.log('/getClaim', err.response);

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


const getOverView = (claim) => {
    let overView = {
        'general': [
            {name: 'Claim ID', value: claim['medical_claim_serial_no'] || claim['medical_claim_id']},
            {name: 'Claim Title', value: claim['medical_claim_title']},
            {name: 'Claim Type', value: toDisplayPolicyType(claim['medical_claim_type'])},
            {name: 'Claim Date', value: claim['medical_claim_created_at']},
            {name: 'Claim Status', value: claim['action']},
            {name: 'Claim For', value: claim['claim_for_name']},
            {name: 'Relationship', value: claim['claim_for_relationship']},
            {name: 'CNIC', value: claim['claim_for_cnic']}
        ],
        'notes': claim['comments'],
        'attachments': {
            'prescriptions': claim['prescription_doc_urls'],
            'invoices': claim['invoice_doc_urls'],
            'reports': claim['lab_reports_doc_urls']
        }
    };

    if (claim['medical_claim_type'] === 'maternity' && claim['maternity_type']) {
        overView.general.splice(3, 0, {name: 'Maternity Case', value: claim['maternity_type']});
    }

    if (claim['medical_claim_created_at'] !== claim['updated_at']) {
        overView.general.splice(4, 0, {name: 'Date Processed', value: claim['updated_at']});
    }

    return overView;
};

const getEmployeeDetails = (claim) => {
    return [
        {name: 'Name', value: claim['claimed_by_name']},
        {name: 'Employee Code', value: claim['claimed_by_employee_code']},
        {name: 'Email', value: claim['claimed_by_email']},
        {name: 'Contact #', value: claim['claimed_by_contact_number']}
    ];
};

const getPolicyDetail = (claim) => {
    let policyDetails;
    const medicalClaimType = claim['medical_claim_type'];
    if (medicalClaimType === 'in_patient') {
        policyDetails = [
            {name: 'Policy Name', value: claim['in_patient_policy_name']},
            {name: 'Type', value: 'IPD'},
            {name: 'Level', value: toDisplayPolicyLevel(claim['in_patient_policy_level'])},
            {name: 'Criteria', value: claim['type'] === 'Percentage' ? '% of Basic Salary' : 'Fixed Amount'},
            {name: 'Amount', value: formatAmount(claim['indoor_limit'])},
            {name: 'Room Sub-Limit', value: formatAmount(claim['indoor_room_limit'])},
            {name: 'Covered Relations', value: [...new Set(claim['in_patient_policy_relationship_types'])]}
        ];
    }
    else if (medicalClaimType === 'out_patient') {
        policyDetails = [
            {name: 'Name', value: claim['out_patient_policy_name']},
            {name: 'Type', value: 'OPD'},
            {name: 'Level', value: toDisplayPolicyLevel(claim['out_patient_policy_level'])},
            {name: 'Criteria', value: claim['type'] === 'Percentage' ? '% of Basic Salary' : 'Fixed Amount'},
            {name: 'Amount', value: formatAmount(claim['outdoor_amount'])},
            {name: 'Covered Relations', value: [...new Set(claim['out_patient_policy_relationship_types'])]}
        ];
    }
    else if (medicalClaimType === 'maternity') {
        policyDetails = [
            {name: 'Policy Name', value: claim['maternity_policy_name']},
            {name: 'Type', value: 'Maternity'},
            {name: 'Level', value: toDisplayPolicyLevel(claim['maternity_policy_level'])},
            {name: 'Criteria', value: claim['type'] === 'Percentage' ? '% of Basic Salary' : 'Fixed Amount'},
            {name: 'Normal Limit', value: formatAmount(claim['maternity_normal_case_limit'])},
            {name: 'C-Section Limit', value: formatAmount(claim['maternity_csection_case_limit'])},
            {name: 'Room Sub-Limit', value: formatAmount(claim['maternity_room_limit'])}
        ];
    }

    return policyDetails;
};

export const getPolicyLimits = (claim) => {
    const inPatient = {
        'Total': +claim['indoor_limit'],
        'Consumed': +claim['ipd_consumed_amount'],
        'Remaining': +claim['indoor_limit'] - +claim['ipd_consumed_amount']
    };

    const outPatient = {
        'Total': +claim['outdoor_amount'],
        'Consumed': +claim['opd_consumed_amount'],
        'Remaining': +claim['outdoor_amount'] - +claim['opd_consumed_amount']
    };

    const maternityNormal = {
        'Total': +claim['maternity_normal_case_limit'],
        'Consumed': +claim['maternity_consumed_amount'] > +claim['maternity_normal_case_limit'] ? +claim['maternity_normal_case_limit'] : +claim['maternity_consumed_amount'],
    };
    maternityNormal['Remaining'] = maternityNormal['Total'] - maternityNormal['Consumed'];

    const maternityCSection = {
        'Total': +claim['maternity_csection_case_limit'],
        'Consumed': +claim['maternity_consumed_amount'],
        'Remaining': +claim['maternity_csection_case_limit'] - +claim['maternity_consumed_amount']
    };

    const specialLimit = {
        'Total': '-',
        'Consumed': +claim['special_consumed_amount'],
        'Remaining': '-'
    };

    let policyLimits = {
        'Out-Patient': outPatient,
        'In-Patient': inPatient,
        'Maternity (Normal)': maternityNormal,
        'Maternity (C-Section)': maternityCSection,
        'Special': specialLimit
    };

    return policyLimits;
};


const readOnlyClaim = (claim, orders, isLastClaim) => {
    if (!isLastClaim) {
        return true;
    }
    else {
        let canApprove = orders && orders.length && orders.indexOf(claim['policy_approval_process_order']) > -1;
        return !(canApprove && claim['action'] === 'Pending');
    }
};

const transformToTimeLine = (data) => {

    let {orders, claims} = data;
    let timeLine = {};
    for (let index = 0; index < claims.length; index++) {
        const claim = claims[index];
        const isLastClaim = index === (claims.length - 1);
        console.log('claim', claim);

        let timeLineObject = {
            'id': index,
            'transactionId': claim.id,
            'orgClaim': {...claim},
            'administrator': {
                'name': claim['action_taken_by_name'] || claim['claimed_by_name'],
                'employee_code': claim['action_taken_by_employee_code'] || claim['claimed_by_employee_code'],
                'role_title': claim['action_taken_role_title'] || 'Employee',
            },
            'readOnly': readOnlyClaim(claim, orders, isLastClaim),
            'overview': getOverView(claim),
            'employeeDetails': getEmployeeDetails(claim),
            'policyLimits': getPolicyLimits(claim),
            'policyDetails': getPolicyDetail(claim),
            'claimDetails': {
                'claim_amount': claim['claimed_amount'],
                'claim_type': toDisplayPolicyType(claim['medical_claim_type']),
                'room_rent': claim['medical_claim_room_rent'],
                'room_days': claim['medical_claim_room_days'],
                'max_room_rent': +claim['maternity_room_limit'] * +claim['medical_claim_room_days'],
                'extra_room_rent': claim['claim_exceeding_room_amount']
            },
            'approveDetails': {
                'opd_amount': claim['opd_approved_amount'],
                'ipd_amount': claim['ipd_approved_amount'],
                'mat_amount': claim['special_approved_amount'],
                'special_amount': claim['maternity_approved_amount']
            }
        };

        console.log('timeLineObject', timeLineObject);

        timeLine[index.toString()] = timeLineObject;
    }

    timeLine.lastIndex = claims.length - 1;

    console.log('timeLine', timeLine);

    return timeLine;
};

export const getAllClaims = (props) => {
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
                url = `${serverUrl}/get-claims`;
                if (pagination.current > 0) {
                    url += `?page=${pagination.current}`;
                }
                lastUrl = url;
            }
        } else {
            url = `${serverUrl}/get-claims`;
            requestData.searchFilters = searchFilters;
            if (filters) {
                requestData.filters = filters;
            }

            if (sorter) {
                requestData.sorter = sorter;
            }

            if (maintainPage) {
                pagination = getState().claim.tablePagination;
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
                    let claims = data.data;
                    let payload = {claims, pagination: data.pagination, tablePagination: pagination};
                    dispatch(_setClaims(payload));
                }

                dispatch(_setProcessing(false));
            }).catch((err) => {
            let {response} = err;
            console.log('/getAllClaims', err.response);

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

export const getClaims = (props) => {
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
                url = `${serverUrl}/get-open-claims-transactions`;
                if (pagination.current > 0) {
                    url += `?page=${pagination.current}`;
                }
                lastUrl = url;
            }
        } else {
            url = `${serverUrl}/get-open-claims-transactions`;
            requestData.searchFilters = searchFilters;
            if (filters) {
                requestData.filters = filters;
            }

            if (sorter) {
                requestData.sorter = sorter;
            }

            if (maintainPage) {
                pagination = getState().claim.tablePagination;
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
                    let claims = data.data;
                    let payload = {claims, pagination: data.pagination, tablePagination: pagination};
                    dispatch(_setClaims(payload));
                }

                dispatch(_setProcessing(false));
            }).catch((err) => {
            let {response} = err;
            console.log('/getClaims', err.response);

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


