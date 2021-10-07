import * as actionType from './menu-action-types';

const initState = () => {
    return {activeMenuId: -1, activeMenuText: ''};
};

const reducer = (state = initState(), action) => {
    switch (action.type) {
        case actionType.ACTIVE_MENU:
            return setActiveMenu(state, action.payload);
        case actionType.ACTIVE_SUB_MENU:
            return setActiveSubMenu(state, action.payload);
        case 'RESET_REDUX':
            console.log('Resetting Menu redux');
            return initState();
        default:
            return state;
    }
};

const setActiveMenu = (state, data) => {
    let newState = {...state};

    newState.activeMenuId = data.id;
    newState.activeMenuText = data.text;
    newState.activeSubMenuId = -1;
    newState.activeSubMenuText = '';

    return newState;
};

const setActiveSubMenu = (state, data) => {
    let newState = {...state};
    newState.activeSubMenuId = data.id;
    newState.activeSubMenuText = data.text;
    return newState;
};

export default reducer;