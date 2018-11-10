const WebSocket = require('ws');

const wss = new WebSocket.Server({
    port: 8989
});

const users = [];
const typers = [];

const broadcast = (data, ws) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN && client !== ws) {
            client.send(JSON.stringify(data));
        }
    });
};

function noop() {}

function heartbeat() {
    this.isAlive = true;
}

const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
        if (ws.isAlive === false) return ws.terminate();
        ws.isAlive = false; // eslint-disable-line
        ws.ping(noop);
    });
}, 30000);

wss.on('connection', (ws) => {
    let index;
    let username;
    ws.isAlive = true; // eslint-disable-line
    ws.on('pong', heartbeat);
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        switch (data.type) {
            case 'ADD_USER':
                index = users.length;
                username = data.name;
                users.push({
                    name: data.name,
                    id: index++
                });
                ws.send(JSON.stringify({
                    type: 'USERS_LIST',
                    users
                }));
                broadcast({
                    type: 'USERS_LIST',
                    users
                }, ws);
                break;
            case 'TYPING':
                if (!typers.some(e => e.name === username)) {
                    typers.push({
                        name: username
                    });
                    console.log('typer detected: ', typers);
                    broadcast({
                        type: 'TYPERS_LIST',
                        typers
                    });
                }
                break;
            case 'ADD_MESSAGES':
                broadcast({
                    type: 'ADD_MESSAGES',
                    message: data.message,
                    author: data.author
                }, ws);
                break;
            default:
                break;
        }
    });
    ws.on('close', () => {
        users.splice(index - 1, 1);
        console.log('connection closed', users, index);
        broadcast({
            type: 'USERS_LIST',
            users
        }, ws);
    });
});
