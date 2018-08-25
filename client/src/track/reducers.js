import { combineReducers } from 'redux';
import {
    SELECT_YEAR,
    INVALIDATE_YEAR,
    REQUEST_MEETS,
    RECEIVE_MEETS,
    REQUEST_MEET_DETAILS,
    RECEIVE_MEET_DETAILS,
    REQUEST_LOGIN,
    LOGIN_FAILED,
    LOGIN_SUCCESS,
    SIGNUP_FAILED,
    SIGNUP_SUCCESS,
    REQUEST_SIGNUP,
    USERS_LIST,
    ADD_MESSAGES,
    ADD_USER,
    MESSAGE_RECEIVED,
    VALIDATE_TOKEN,
    TOKEN_GOOD,
    TOKEN_BAD
} from './actions';

function selectedYear(state = '2018', action) {
    switch (action.type) {
        case SELECT_YEAR:
            return action.year;
        default:
            return state;
    }
}

function meets(
    state = {
        isFetching: false,
        didInvalidate: false,
        items: []
    },
    action
) {
    switch (action.type) {
        case INVALIDATE_YEAR:
            return Object.assign({}, state, {
                didInvalidate: true
            });
        case REQUEST_MEETS:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            });
        case RECEIVE_MEETS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                items: action.meets,
                lastUpdated: action.receivedAt
            });
        default:
            return state;
    }
}

function meetsByYear(state = {}, action) {
    switch (action.type) {
        case INVALIDATE_YEAR:
        case RECEIVE_MEETS:
        case REQUEST_MEETS:
            return Object.assign({}, state, {
                [action.year]: meets(state[action.year], action)
            });
        default:
            return state;
    }
}

function meetDetails(state = {
    isFetching: false,
    data: {}
}, action) {
    switch (action.type) {
        case REQUEST_MEET_DETAILS:
            return Object.assign({}, state, {
                isFetching: true
            });
        case RECEIVE_MEET_DETAILS:
            return Object.assign({}, state, {
                isFetching: false,
                data: action.details,
                lastUpdated: action.receivedAt
            });
        default:
            return state;
    }
}

function loggingIn(state = false, action) {
    switch (action.type) {
        case REQUEST_LOGIN:
            return true;
        case LOGIN_FAILED:
        case LOGIN_SUCCESS:
            return false;
        default:
            return state;
    }
}

function loggedIn(state = {
    result: {},
    message: '',
    failed: false
}, action) {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return Object.assign({}, state, {
                result: action.res,
                message: 'Login success, please wait to be redireced.',
                failed: false
            });
        case LOGIN_FAILED:
            return Object.assign({}, state, {
                result: action.res,
                message: 'Please try again.',
                failed: true
            });
        default:
            return state;
    }
}

function signUp(state = {
    signup: {
        result: {},
        signUpLoading: false
    }
}, action) {
    switch (action.type) {
        case REQUEST_SIGNUP:
            return Object.assign({}, state, {
                signup: {
                    loading: true,
                    failed: false
                }
            });
        case SIGNUP_SUCCESS:
            return Object.assign({}, state, {
                signup: {
                    result: action.res,
                    loading: false,
                    failed: false,
                    timestamp: action.timestamp
                }
            });
        case SIGNUP_FAILED:
            return Object.assign({}, state, {
                signup: {
                    result: action.res,
                    loading: false,
                    failed: true,
                    timestamp: action.timestamp
                }
            });
        default:
            return state;
    }
}

const messages = (state = [], action) => {
    switch (action.type) {
        case ADD_MESSAGES:
        case MESSAGE_RECEIVED:
            return state.concat([
                {
                    message: action.message,
                    author: action.author,
                    id: action.id,
                    timestamp: action.timestamp
                }
            ]);
        default:
            return state;
    }
};

const users = (state = [], action) => {
    switch (action.type) {
        case ADD_USER:
            return state.concat([{
                name: action.name,
                id: action.id
            }]);
        case USERS_LIST:
            return action.users;
        default:
            return state;
    }
};

const tokenValidation = (state = {
    validating: false,
    validated: false,
    failed: false
}, action) => {
    switch (action.type) {
        case VALIDATE_TOKEN:
            return Object.assign({}, state, {
                validating: true,
                validated: false,
                failed: false
            });
        case TOKEN_GOOD:
            return Object.assign({}, state, {
                validated: true,
                validating: false,
                failed: false,
                decoded: action.decoded
            });
        case TOKEN_BAD:
            return Object.assign({}, state, {
                validate: false,
                validating: false,
                failed: true
            });
        default:
            return state;
    }
};

const rootReducer = combineReducers({
    meetsByYear,
    selectedYear,
    meetDetails,
    loggingIn,
    loggedIn,
    signUp,
    messages,
    users,
    tokenValidation
});

export default rootReducer;
