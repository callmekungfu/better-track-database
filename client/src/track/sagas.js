import { takeEvery } from 'redux-saga';
import { ADD_MESSAGES } from './actions';

const handleNewMessages = function* handleNewMessages(params) {
    yield takeEvery(ADD_MESSAGES, (action) => {
        action.author = params.username,
        params.socket.send(JSON.stringify(action));
    });
};

export default handleNewMessages;
