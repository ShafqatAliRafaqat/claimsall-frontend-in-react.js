import * as actionType from './policy-action-types';

const initState = () => {
    return {
        policy: {},
        policies: [],
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
        case actionType.POLICY_ADD:
            addPolicy(newState, action.payload);
            break;
        case actionType.POLICY_PROCESSING:
            setProcessing(newState, action.payload);
            break;
        case actionType.POLICY_SET:
            setPolicy(newState, action.payload);
            break;
        case actionType.POLICIES_SET:
            setPolicies(newState, action.payload);
            break;
        case actionType.POLICY_ERROR:
            setError(newState, action.payload);
            break;
        case actionType.POLICY_RESET:
            reset(newState);
            break;
        case actionType.POLICY_DELETE:
            deletePolicy(newState, action.payload);
            break;
        case actionType.POLICY_PAGINATION_SET:
            setPagination(newState, action.payload);
            break;
        case 'RESET_REDUX':
            console.log('Resetting policy redux');
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
    setPolicy(state, {});
};

const setPolicy = (state, policy) => {
    state.policy = policy;
};

const setPolicies = (state, payload) => {
    let {pagination} = payload;

    state.policies = payload.policies;
    state.pagination = pagination;

    state.tablePagination = {current: pagination.current_page, total: pagination.total};
};

const addPolicy = (state, policy) => {
    setMessage(state, policy.message);
    state.policy = policy;
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

const deletePolicy = (state, data) => {
    let _policies = [...state.policies];
    _policies.splice(data.index, 1);
    setMessage(state, data.message);
    setPolicies(state, {policies: _policies});
};

export default reducer;