import { takeEvery } from 'redux-saga';
import { ADD_MESSAGES, TYPING } from './actions';

export const handleNewMessages = function* handleNewMessages(params) {
    yield takeEvery(ADD_MESSAGES, (action) => {
        console.log('add message');
        action.author = params.username,
        params.socket.send(JSON.stringify(action));
    });
};

export const handleTyping = function* handleTyping(params) {
    yield takeEvery(TYPING, (action) => {
        const request = Object.assign({}, action, { name: params.username });
        params.socket.send(JSON.stringify(request));
    });
};
