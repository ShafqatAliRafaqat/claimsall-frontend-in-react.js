import * as actionType from './claim-action-types';

const initState = () => {
    return {
        claim: {},
        timeLine: {},
        claims: [],
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
        case actionType.CLAIM_ADD:
            addClaim(newState, action.payload);
            break;
        case actionType.CLAIM_PROCESSING:
            setProcessing(newState, action.payload);
            break;
        case actionType.CLAIM_SET:
            setClaim(newState, action.payload);
            break;
        case actionType.CLAIMS_SET:
            setClaims(newState, action.payload);
            break;
        case actionType.CLAIM_ERROR:
            setError(newState, action.payload);
            break;
        case actionType.CLAIM_RESET:
            reset(newState);
            break;
        case actionType.CLAIM_DELETE:
            deleteClaim(newState, action.payload);
            break;
        case actionType.CLAIM_PAGINATION_SET:
            setPagination(newState, action.payload);
            break;
        case actionType.CLAIM_TIMELINE_SET:
            setTimeLine(newState, action.payload);
            break;
        case actionType.CLAIM_TIMELINE_ACTIVE_SET:
            setTimeLineClaim(newState, action.payload);
            break;
        case 'RESET_REDUX':
            console.log('Resetting org redux');
            return initState();
        default:
            break;
    }

    return newState;
};

const setTimeLine = (state, timeLine) => {
    state.timeLine = timeLine;
    setTimeLineClaim(state, `${timeLine.lastIndex}`);
    console.log('claim State', state);
};

const setTimeLineClaim = (state, id) => {
    state.claim = state.timeLine[id] ? {...state.timeLine[id]} : {};
    console.log('id', id, 'claim', state.claim);
};


const setPagination = (state, pagination) => {
    state.tablePagination = pagination;
};

const reset = (state) => {
    setMessage(state, null);
    setError(state, null);
    setClaim(state, {});
};

const setClaim = (state, claim) => {
    state.claim = claim;
};


const setClaims = (state, payload) => {
    let {pagination} = payload;

    state.claims = payload.claims;
    state.pagination = pagination;

    state.tablePagination = {current: pagination.current_page, total: pagination.total};
    state.chartData = prepareChartData(state.claims);
};

const addClaim = (state, claim) => {
    setMessage(state, claim.message);
    state.claim = claim;
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

const deleteClaim = (state, data) => {
    let _claims = [...state.claims];
    _claims.splice(data.index, 1);
    setMessage(state, data.message);
    setClaims(state, {claims: _claims});
};


const prepareChartData = (claims) => {
    let chartData = {};
    if (claims && claims.length) {

        let availableColors = ['#ff4d4f', '#ffa940', '#1890ff', '#eb2f96', '#52c41a', '#595959'];
        let labels = [];
        let data = [];
        let colors = [];
        let colorIndex = 0;

        claims.forEach((claim) => {

            if (colorIndex >= availableColors.length) {
                colorIndex = 0;
            }

            let _index = labels.indexOf(claim["claim_type"]);

            if (_index < 0) {
                labels.push(claim["claim_type"]);
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
            total: claims.length
        };
    }


    return chartData;
};

export default reducer;