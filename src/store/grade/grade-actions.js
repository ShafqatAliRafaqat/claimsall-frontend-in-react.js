import axios from '../../utils/axios';
import * as actionType from './grade-action-types';
import appConfig from '../../config/config.json';
import {message} from 'antd';

let lastUrl = null;

const _addGrade = (args) => {
    return {
        type: actionType.GRADE_ADD,
        payload: args
    };
};

export const _setProcessing = (processing) => {
    return {
        type: actionType.GRADE_PROCESSING,
        payload: processing
    };
};


const _setGrade = (grade) => {
    return {
        type: actionType.GRADE_SET,
        payload: grade
    };
};

const _setGrades = (grades) => {
    return {
        type: actionType.GRADES_SET,
        payload: grades
    };
};

const _setError = (error) => {
    return {
        type: actionType.GRADE_ERROR,
        payload: error
    };
};

export const _reset = () => {
    return {
        type: actionType.GRADE_RESET,
        payload: null
    };
};

export const setPagination = (pagination) => {
    return {
        type: actionType.GRADE_PAGINATION_SET,
        payload: pagination
    };
};


export const addGrade = (_grade) => {
    let grade = {..._grade};

    return (dispatch, getState) => {
        const {serverUrl} = appConfig;
        const config = {
            headers: {'Authorization': `Bearer ${getState().auth.token}`}
        };

        dispatch(_setProcessing(true));

        let url = `${serverUrl}/grade`;

        if (grade.id) {
            grade._method = 'PUT';
            url += `/${grade.id}`;
        }

        axios.post(url, grade, config)
            .then((response) => {
                const {data} = response;

                // Success Add
                if (data && data.message) {
                    message.success(data.message);
                    grade.message = data.message;
                    dispatch(_addGrade(grade));
                }

            }).catch((err) => {
            let {response} = err;
            console.log('/addGrade', err.response);

            dispatch(_addGrade(_grade));

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

export const deleteGrade = (id) => {
    return (dispatch, getState) => {
        const {serverUrl} = appConfig;
        const config = {
            headers: {'Authorization': `Bearer ${getState().auth.token}`}
        };

        dispatch(_setProcessing(true));

        let path = Array.isArray(id) ? 'delete-grade' : `grade/${id}`;
        let url = `${serverUrl}/${path}`;

        let axiosPromise = Array.isArray(id) ? axios.post(url, {grade_ids: id}, config) : axios.delete(url, config);

        let respData = {};

        axiosPromise.then((response) => {
            const {data} = response;

            // Success Delete
            if (data && data.message) {
                respData.message = data.message;
            }
            let fetchData = {maintainPage: true};

            if ((Array.isArray(id) && id.length === getState().grade.grades.length) || (getState().grade.grades.length === 1)) {
                let currentPage = getState().grade.tablePagination.current;
                if (currentPage > 1) {
                    fetchData.pagination = {current: getState().grade.tablePagination.current - 1};
                }
            }
            message.success(response.data.message);
            dispatch(getGrades(fetchData));
        }).catch((err) => {
            let {response} = err;
            console.log('/deleteGrade', err.response);

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

export const getGrade = (id) => {
    return (dispatch, getState) => {
        const {serverUrl} = appConfig;
        const config = {
            headers: {'Authorization': `Bearer ${getState().auth.token}`}
        };

        dispatch(_setProcessing(true));

        axios.get(`${serverUrl}/grade/${id}`, config)
            .then((response) => {
                const {data} = response;

                // Success Add
                if (data && data.data) {
                    let grade = data.data;
                    dispatch(_setGrade(grade));
                }

                dispatch(_setProcessing(false));
            }).catch((err) => {
            let {response} = err;
            console.log('/getGrade', err.response);

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

export const getGrades = (props) => {
    let {pagination, maintainPage} = props;

    return (dispatch, getState) => {
        const {serverUrl} = appConfig;
        const config = {
            headers: {'Authorization': `Bearer ${getState().auth.token}`}
        };

        dispatch(_setProcessing(true));
        let url;

        if (maintainPage) {
            url = lastUrl;

            if (pagination) {
                url = `${serverUrl}/grade`;
                if (pagination.current > 0) {
                    url += `?page=${pagination.current}`;
                }
                lastUrl = url;
            }
        } else {
            url = `${serverUrl}/grade`;

            if (maintainPage) {
                pagination = getState().grade.tablePagination;
            }
            if (pagination.current) {
                url += `?page=${pagination.current}`;
            }

            lastUrl = url;
        }

        axios.get(url, config)
            .then((response) => {
                const {data} = response;

                // Success Add
                if (data && data.data) {
                    let grades = data.data;
                    let payload = {grades, pagination: data.pagination, tablePagination: pagination};
                    dispatch(_setGrades(payload));
                }

                dispatch(_setProcessing(false));
            }).catch((err) => {
            let {response} = err;
            console.log('/getGrades', err.response);

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


