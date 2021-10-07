import * as actionType from './careservice-action-types';

const initState = () => {
    return {
        careservice: {},
        careservices: [],
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
        case actionType.CARESERVICE_ADD:
            addCareservice(newState, action.payload);
            break;
        case actionType.CARESERVICE_PROCESSING:
            setProcessing(newState, action.payload);
            break;
        case actionType.CARESERVICE_SET:
            setCareservice(newState, action.payload);
            break;
        case actionType.CARESERVICES_SET:
            setCareservices(newState, action.payload);
            break;
        case actionType.CARESERVICE_ERROR:
            setError(newState, action.payload);
            break;
        case actionType.CARESERVICE_RESET:
            reset(newState);
            break;
        case actionType.CARESERVICE_DELETE:
            deleteCareservice(newState, action.payload);
            break;
        case actionType.CARESERVICE_PAGINATION_SET:
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
    setCareservice(state, {});
};

const setCareservice = (state, careservice) => {
    state.careservice = careservice;
};

const setCareservices = (state, payload) => {
    let {pagination} = payload;

    state.careservices = payload.careservices;
    state.pagination = pagination;

    state.tablePagination = {current: pagination.current_page, total: pagination.total};
    state.chartData = prepareChartData(state.careservices);
};

const addCareservice = (state, careservice) => {
    setMessage(state, careservice.message);
    state.careservice = careservice;
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

const deleteCareservice = (state, data) => {
    let _careservices = [...state.careservices];
    _careservices.splice(data.index, 1);
    setMessage(state, data.message);
    setCareservices(state, {careservices: _careservices});
};


const prepareChartData = (careservices) => {
    let chartData = {};
    if (careservices && careservices.length) {

        let availableColors = ['#ff4d4f', '#ffa940', '#1890ff', '#eb2f96', '#52c41a', '#595959'];
        let labels = [];
        let data = [];
        let colors = [];
        let colorIndex = 0;

        careservices.forEach((careservice) => {

            if (colorIndex >= availableColors.length) {
                colorIndex = 0;
            }

            let _index = labels.indexOf(careservice["careservice_type"]);

            if (_index < 0) {
                labels.push(careservice["careservice_type"]);
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
            total: careservices.length
        };
    }


    return chartData;
};

export default reducer;