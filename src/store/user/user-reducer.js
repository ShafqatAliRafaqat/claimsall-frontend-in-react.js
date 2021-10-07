import * as actionType from './user-action-types';

const initState = () => {
    return {
        user: {},
        users: [],
        pagination: {},
        tablePagination: {},
        processing: false,
        error: null,
        message: null,
        chartData: {}
    }
};

const reducer = (state = initState(), action) => {
    let newState = {...state};
    switch (action.type) {
        case actionType.USER_ADD:
            addUser(newState, action.payload);
            break;
        case actionType.USER_PROCESSING:
            setProcessing(newState, action.payload);
            break;
        case actionType.USER_SET:
            setUser(newState, action.payload);
            break;
        case actionType.USERS_SET:
            setUsers(newState, action.payload);
            break;
        case actionType.USER_ERROR:
            setError(newState, action.payload);
            break;
        case actionType.USER_RESET:
            reset(newState);
            break;
        case actionType.USER_DELETE:
            deleteUser(newState, action.payload);
            break;
        case actionType.USER_PAGINATION_SET:
            setPagination(newState, action.payload);
            break;
        case 'RESET_REDUX':
            console.log('Resetting user redux');
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
    state.message = null;
    state.error = null;
    state.user = {};
};

const setUser = (state, user) => {
    state.user = user;
};

const setUsers = (state, payload) => {
    let {pagination} = payload;

    state.users = payload.users;
    state.pagination = pagination;

    state.tablePagination = {current: pagination.current_page, total: pagination.total};
    state.chartData = prepareChartData(state.users);
};

const addUser = (state, user) => {
    setMessage(state, user.message);
    state.user = user;
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

const deleteUser = (state, data) => {
    let _users = [...state.users];
    _users.splice(data.index, 1);
    setMessage(state, data.message);
    setUsers(state, {users: _users});
};


const prepareChartData = (users) => {
    let chartData = {};
    if (users && users.length) {

        let availableColors = ['#ff4d4f', '#ffa940', '#1890ff', '#eb2f96', '#52c41a', '#595959'];
        let labels = [];
        let data = [];
        let colors = [];
        let colorIndex = 0;

        const labelProp = "designation";

        users.forEach((user) => {

            if (colorIndex >= availableColors.length) {
                colorIndex = 0;
            }

            let _index = labels.indexOf(user[labelProp]);

            if (_index < 0) {
                labels.push(user[labelProp]);
                data.push(1);
                colors.push(availableColors[colorIndex++]);
            } else {
                data[_index] = data[_index] + 1;
            }
        });

        chartData = {
            labels,
            data,
            colors,
            total: users.length
        };
    }


    return chartData;
};

export default reducer;