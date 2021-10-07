import * as actionType from './acl-action-types';

const initState = () => {
    return {
        acl: {},
        acls: [],
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
        case actionType.ACL_ADD:
            addAcl(newState, action.payload);
            break;
        case actionType.ACL_PROCESSING:
            setProcessing(newState, action.payload);
            break;
        case actionType.ACL_SET:
            setAcl(newState, action.payload);
            break;
        case actionType.ACLS_SET:
            setAcls(newState, action.payload);
            break;
        case actionType.ACL_ERROR:
            setError(newState, action.payload);
            break;
        case actionType.ACL_RESET:
            reset(newState);
            break;
        case actionType.ACL_DELETE:
            deleteAcl(newState, action.payload);
            break;
        case actionType.ACL_PAGINATION_SET:
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
    setAcl(state, {});
};

const setAcl = (state, acl) => {
    state.acl = acl;
};

const setAcls = (state, payload) => {
    let {pagination} = payload;

    state.acls = payload.acls;
    state.pagination = pagination;

    state.tablePagination = {current: pagination.current_page, total: pagination.total};
};

const addAcl = (state, acl) => {
    setMessage(state, acl.message);
    state.acl = acl;
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

const deleteAcl = (state, data) => {
    let _acls = [...state.acls];
    _acls.splice(data.index, 1);
    setMessage(state, data.message);
    setAcls(state, {acls: _acls});
};

export default reducer;