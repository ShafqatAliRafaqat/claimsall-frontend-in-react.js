import * as actionType from './grade-action-types';

const initState = () => {
    return {
        grade: {},
        grades: [],
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
        case actionType.GRADE_ADD:
            addGrade(newState, action.payload);
            break;
        case actionType.GRADE_PROCESSING:
            setProcessing(newState, action.payload);
            break;
        case actionType.GRADE_SET:
            setGrade(newState, action.payload);
            break;
        case actionType.GRADES_SET:
            setGrades(newState, action.payload);
            break;
        case actionType.GRADE_ERROR:
            setError(newState, action.payload);
            break;
        case actionType.GRADE_RESET:
            reset(newState);
            break;
        case actionType.GRADE_DELETE:
            deleteGrade(newState, action.payload);
            break;
        case actionType.GRADE_PAGINATION_SET:
            setPagination(newState, action.payload);
            break;
        case 'RESET_REDUX':
            console.log('Resetting grade redux');
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
    setGrade(state, {});
};

const setGrade = (state, grade) => {
    state.grade = grade;
};

const setGrades = (state, payload) => {
    let {pagination} = payload;

    state.grades = payload.grades;
    state.pagination = pagination;

    state.tablePagination = {current: pagination.current_page, total: pagination.total};

    console.log('state', state)
};

const addGrade = (state, grade) => {
    setMessage(state, grade.message);
    state.grade = grade;
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

const deleteGrade = (state, data) => {
    let _grades = [...state.grades];
    _grades.splice(data.index, 1);
    setMessage(state, data.message);
    setGrades(state, {grades: _grades});
};

export default reducer;