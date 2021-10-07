import * as actionType from './menu-action-types';

export const activateMenu = (id, text) => {
    return {
        type: actionType.ACTIVE_MENU,
        payload: { id, text }
    };
};

export const activateSubMenu = (id, text) => {
    return {
        type: actionType.ACTIVE_SUB_MENU,
        payload: { id, text }
    };
};