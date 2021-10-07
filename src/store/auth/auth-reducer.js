import * as actionType from './auth-action-types';

const loadAuthStateFromLocalStorage = () => {
    let authState = sessionStorage.getItem("authState");
    if (!authState) {
        authState = localStorage.getItem("authState");
    }

    if (authState && authState.length > 0) {
        return JSON.parse(authState);
    }

    return null;
};

const initState = () => {
    const prevState = loadAuthStateFromLocalStorage();

    if (!prevState) {
        return {
            token: null,
            authenticated: false,
            error: null,
            role: null,
            organizationId: null,
            processing: false
        };
    }

    return prevState;
};

const reducer = (state = initState(), action) => {
    switch (action.type) {
        case actionType.LOGIN:
            return login(state, action.payload);

        case actionType.LOGOUT:
            return logout(state);

        case actionType.PROCESSING:
            return setProcessing(state, action.payload);

        case 'RESET_REDUX':
            console.log('Resetting Auth redux');
            return initState();

        default:
            return state;
    }
};

const setProcessing = (state, data) => {
    let newState = {...state};
    newState.processing = data;
    return newState;
};

const login = (state, data) => {
    let newState = data;
    if (newState.error) {
        newState.authenticated = false;
    } else {
        newState.authenticated = true;
        if (data.remember) {
            localStorage.setItem('authState', JSON.stringify(newState));
        } else {
            sessionStorage.setItem('authState', JSON.stringify(newState));
        }
    }
    return newState;
};

const logout = (state) => {
    const newState = {...state};
    newState.token = null;
    newState.authenticated = false;
    newState.error = null;
    localStorage.removeItem('authState');
    sessionStorage.removeItem('authState');
    return newState;
};

export default reducer;