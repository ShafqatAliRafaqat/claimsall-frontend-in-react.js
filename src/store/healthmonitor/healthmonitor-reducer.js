import * as actionType from './healthmonitor-action-types';

const initState = () => {
    return {
        healthmonitor: {},
        healthmonitors: [],
        pagination: {},
        tablePagination: {},
        processing: false,
        error: null,
        message: null
    }
};


const reducer = (state = initState(), action) => {
    let newState = {...state};
    switch (action.type) {
        case actionType.HEALTHMONITOR_ADD:
            addHealthmonitor(newState, action.payload);
            break;
        case actionType.HEALTHMONITOR_PROCESSING:
            setProcessing(newState, action.payload);
            break;
        case actionType.HEALTHMONITOR_SET:
            setHealthmonitor(newState, action.payload);
            break;
        case actionType.HEALTHMONITORS_SET:
            setHealthmonitors(newState, action.payload);
            break;
        case actionType.HEALTHMONITOR_ERROR:
            setError(newState, action.payload);
            break;
        case actionType.HEALTHMONITOR_RESET:
            reset(newState);
            break;
        case actionType.HEALTHMONITOR_DELETE:
            deleteHealthmonitor(newState, action.payload);
            break;
        case actionType.HEALTHMONITOR_PAGINATION_SET:
            setPagination(newState, action.payload);
            break;
        case 'RESET_REDUX':
            console.log('Resetting org redux');
            return initState();
        default:
            break;
    }

    return newState;
};


const setPagination = (state, pagination) => {
    state.tablePagination = pagination;
};

const reset = (state) => {
    setMessage(state, null);
    setError(state, null);
    setHealthmonitor(state, {});
};

const setHealthmonitor = (state, healthmonitor) => {
    state.healthmonitor = healthmonitor;
};

const setHealthmonitors = (state, payload) => {
    let {pagination} = payload;

    state.healthmonitors = payload.healthmonitors;
    state.pagination = pagination;

    state.tablePagination = {current: pagination.current_page, total: pagination.total};
};

const addHealthmonitor = (state, healthmonitor) => {
    setMessage(state, healthmonitor.message);
    state.healthmonitor = healthmonitor;
};

const setProcessing = (state, processing) => {
    state.processing = processing;
};

const setMessage = (state, message) => {
    state.error = null;
    state.message = message;
};

const setError = (state, error) => {
    state.error = error;
    state.message = null;
};

const deleteHealthmonitor = (state, data) => {
    let _healthmonitors = [...state.healthmonitors];
    _healthmonitors.splice(data.index, 1);
    setMessage(state, data.message);
    setHealthmonitors(state, {healthmonitors: _healthmonitors});
};

export default reducer;