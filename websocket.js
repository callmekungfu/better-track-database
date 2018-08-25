const WebSocket = require('ws');

const wss = new WebSocket.Server({
    port: 8989
});

const users = [];

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
        ws.isAlive = false;
        ws.ping(noop);
    });
}, 30000);

wss.on('connection', (ws) => {
    let index;
    ws.isAlive = true;
    ws.on('pong', heartbeat);
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        switch (data.type) {
            case 'ADD_USER':
                index = users.length;
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