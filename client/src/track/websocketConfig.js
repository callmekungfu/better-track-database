import {
    addUser,
    messageReceived,
    populateUserList,
    ADD_USER,
    ADD_MESSAGES,
    USERS_LIST
} from './actions';

const setUpSocket = (dispatch, username) => {
    const socket = new WebSocket('ws://localhost:8989');
    socket.onopen = () => {
        socket.send(JSON.stringify({
            type: ADD_USER,
            name: username
        }));
    };
    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        switch (data.type) {
            case ADD_MESSAGES:
                dispatch(messageReceived(data.message, data.author));
                break;
            case ADD_USER:
                dispatch(addUser(data.name));
                break;
            case USERS_LIST:
                dispatch(populateUserList(data.users));
                break;
            default:
                break;
        }
    };
    return socket;
};

export default setUpSocket;
