import fetch from 'cross-fetch';
import Cookies from 'js-cookie';

export const SELECT_YEAR = 'SELECT_YEAR';
export const REQUEST_MEETS = 'REQUEST_MEETS';
export const RECEIVE_MEETS = 'RECEIVE_MEETS';
export const INVALIDATE_YEAR = 'INVALIDATE_YEAR';

export const REQUEST_MEET_DETAILS = 'REQUEST_MEET_DETAILS';
export const RECEIVE_MEET_DETAILS = 'RECEIVE_MEET_DETAILS';

export const REQUEST_LOGIN = 'REQUEST_LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILED = 'LOGIN_FAILED';
export const LOGOUT = 'LOGOUT';

export const VALIDATE_TOKEN = 'VALIDATE_TOKEN';
export const TOKEN_GOOD = 'TOKEN_GOOD';
export const TOKEN_BAD = 'TOKEN_BAD';

export const REQUEST_SIGNUP = 'REQUEST_SIGNUP';
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';
export const SIGNUP_FAILED = 'SIGNUP_FAILED';

export const ADD_MESSAGES = 'ADD_MESSAGES';
export const MESSAGE_RECEIVED = 'MESSAGE_RECEIVED';
export const ADD_USER = 'ADD_USER';
export const USERS_LIST = 'USERS_LIST';
export const TYPING = 'TYPING';
export const TYPERS_LIST = 'TYPERS_LIST';

export const selectYear = year => ({
    type: SELECT_YEAR,
    year
});

export const invalidateYear = year => ({
    type: INVALIDATE_YEAR,
    year
});

const requestMeets = year => ({
    type: REQUEST_MEETS,
    year
});

const receiveMeets = (year, json) => ({
    type: RECEIVE_MEETS,
    year,
    meets: json,
    receivedAt: Date.now()
});

const fetchMeets = year => (dispatch) => {
    dispatch(requestMeets(year));
    return fetch(`http://localhost:5000/api/${year}`)
        .then(response => response.json())
        .then(json => dispatch(receiveMeets(year, json)));
};

const shouldFetch = (state, year) => {
    const meets = state.meetsByYear[year];
    if (!meets) {
        return true;
    } else if (meets.isFetching) {
        return false;
    } else {
        return postMessage.didInvalidate;
    }
};

const requestMeetDetails = meet => ({
    type: REQUEST_MEET_DETAILS,
    meet
});

const receiveMeetDetails = (meet, json) => ({
    type: RECEIVE_MEET_DETAILS,
    meet,
    details: json,
    receivedAt: Date.now()
});

export const fetchMeetDetails = meet => (dispatch) => {
    dispatch(requestMeetDetails(meet));
    return fetch('http://localhost:5000/api/meetDetails', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(meet)
        })
        .then(response => response.json())
        .then(json => dispatch(receiveMeetDetails(meet, json)));
};

export function fetchMeetsIfNeeded(year) {
    return (dispatch, getState) => {
        if (shouldFetch(getState(), year)) {
            return dispatch(fetchMeets(year));
        }
    };
}

const loginFailed = res => ({
    type: LOGIN_FAILED,
    res
});

const loginSuccess = res => ({
    type: LOGIN_SUCCESS,
    res
});

const requestLogin = () => ({
    type: REQUEST_LOGIN
});

export const attemptLogin = details => (dispatch) => {
    dispatch(requestLogin());
    return fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(details)
        })
        .then(response => response.json())
        .then((json) => {
            if (json.status === 'Login Success.') {
                console.log(json);
                Cookies.set('auth', json, { expires: json.exp });
                dispatch(loginSuccess(json));
                dispatch(goodToken()); // eslint-disable-line no-use-before-define
            } else {
                dispatch(loginFailed(json));
            }
        });
};

export const logout = () => {
    Cookies.remove('auth');
    return {
        type: LOGOUT
    };
};

const signUpRequested = () => ({
    type: REQUEST_SIGNUP,
});

const signUpSuccess = res => ({
    type: SIGNUP_SUCCESS,
    res,
    timestamp: Date.now()
});

const signUpFailed = res => ({
    type: SIGNUP_FAILED,
    res,
    timestamp: Date.now()
});

export const attemptSignUp = details => (dispatch) => {
    dispatch(signUpRequested());
    return fetch('http://localhost:5000/api/createUser', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(details)
        })
        .then(res => res.json())
        .then((json) => {
            if (json.status === 'Sign up success.') {
                dispatch(signUpSuccess(json));
            } else {
                dispatch(signUpFailed(json));
            }
        });
};

let messageId = 0;
let userId = 0;

export const addMessage = (message, author) => ({
    type: ADD_MESSAGES,
    id: messageId++,
    message,
    author,
    timestamp: Date.now()
});

export const addUser = name => ({
    type: ADD_USER,
    name,
    id: userId++,
});

export const typing = name => ({
    type: TYPING,
    name
});

export const listTypers = typers => ({
    type: TYPERS_LIST,
    typers
});

export const messageReceived = (message, author) => ({
    type: MESSAGE_RECEIVED,
    id: messageId++,
    message,
    author,
    timestamp: Date.now()
});

export const populateUserList = users => ({
    type: USERS_LIST,
    users
});

const validatingToken = () => ({
    type: VALIDATE_TOKEN,
    timestamp: Date.now()
});

const badToken = () => ({
    type: TOKEN_BAD,
    timestamp: Date.now()
});

const goodToken = decoded => ({
    type: TOKEN_GOOD,
    timestamp: Date.now(),
    decoded
});

export const validateLogin = () => (dispatch) => {
    const auth = Cookies.getJSON('auth');
    if (!auth) {
        dispatch(badToken());
    } else {
        dispatch(validatingToken());
        fetch('http://localhost:5000/api/verify', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: auth.token
            })
        })
        .then(res => res.json())
        .then((json) => {
            if (json.valid) {
                dispatch(goodToken(json.decoded));
            } else {
                dispatch(badToken());
            }
        });
    }
};
