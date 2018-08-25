let nextTodoId = 0;
export const addTodo = text => ({
    type: 'ADD_TODO',
    id: nextTodoId++,
    text,
});

export const setVisibilityFilter = filter => ({
    type: 'SET_VISIBILITY_FILTER',
    filter,
});

export const toggleTodo = id => ({
    type: 'TOGGLE_TODO',
    id,
});

export const VisibilityFilters = {
    SHOW_ALL: 'SHOW_ALL',
    SHOW_COMPLETED: 'SHOW_COMPLETED',
    SHOW_ACTIVE: 'SHOW_ACTIVE',
};

export const REQUEST_ALL_MEETS = 'REQUEST_ALL_MEETS';
export const FETCH_ALL_MEETS = 'FETCH_ALL_MEETS';

export const requestMeets = year => ({
    type: REQUEST_ALL_MEETS,
    year,
});

const fetchMeets = (year, data) => ({
    type: FETCH_ALL_MEETS,
    year,
    meets: data,
    recievedAt: Date.now(),
});
