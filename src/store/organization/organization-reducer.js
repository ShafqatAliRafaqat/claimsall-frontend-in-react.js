import * as actionType from './organization-action-types';

const initState = () => {
    return {
        organization: {},
        organizations: [],
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
        case actionType.ORGANIZATION_ADD:
            addOrganization(newState, action.payload);
            break;
        case actionType.ORGANIZATION_PROCESSING:
            setProcessing(newState, action.payload);
            break;
        case actionType.ORGANIZATION_SET:
            setOrganization(newState, action.payload);
            break;
        case actionType.ORGANIZATIONS_SET:
            setOrganizations(newState, action.payload);
            break;
        case actionType.ORGANIZATION_ERROR:
            setError(newState, action.payload);
            break;
        case actionType.ORGANIZATION_RESET:
            reset(newState);
            break;
        case actionType.ORGANIZATION_DELETE:
            deleteOrganization(newState, action.payload);
            break;
        case actionType.ORGANIZATION_PAGINATION_SET:
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
    setOrganization(state, {});
};

const setOrganization = (state, organization) => {
    state.organization = organization;
};

const setOrganizations = (state, payload) => {
    let {pagination} = payload;

    state.organizations = payload.organizations;
    state.pagination = pagination;

    state.tablePagination = {current: pagination.current_page, total: pagination.total};
    state.chartData = prepareChartData(state.organizations);
};

const addOrganization = (state, organization) => {
    setMessage(state, organization.message);
    state.organization = organization;
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

const deleteOrganization = (state, data) => {
    let _organizations = [...state.organizations];
    _organizations.splice(data.index, 1);
    setMessage(state, data.message);
    setOrganizations(state, {organizations: _organizations});
};


const prepareChartData = (organizations) => {
    let chartData = {};
    if (organizations && organizations.length) {

        let availableColors = ['#ff4d4f', '#ffa940', '#1890ff', '#eb2f96', '#52c41a', '#595959'];
        let labels = [];
        let data = [];
        let colors = [];
        let colorIndex = 0;

        organizations.forEach((organization) => {

            if (colorIndex >= availableColors.length) {
                colorIndex = 0;
            }

            let _index = labels.indexOf(organization["organization_type"]);

            if (_index < 0) {
                labels.push(organization["organization_type"]);
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
            total: organizations.length
        };
    }


    return chartData;
};

export default reducer;