import { v4 as uuidv4 } from 'uuid';
import * as messageService from '../services/message.service';

const messages = new Set();
const users = new Map();

class Connection {
    constructor(io, socket) {
        this.socket = socket;
        this.io = io;

        this.login(socket.handshake.query.userId);
        this.io.sockets.emit('users.count', users.size);

        socket.on('getMessages', () => this.getMessages());
        socket.on('message', (value) => this.handleMessage(value));
        socket.on('deleteUser', (userId) => this.deleteUser(userId));
        socket.on('connect_error', (err) => {
            console.log(`connect_error due to ${err.message}`);
        });
        socket.on('isTyping', (data) => {
            this.sendIsTyping(data);
        });

        socket.on('disconnect', () => {
            users.delete(this.socket.handshake.query.userId);
            io.sockets.emit('users.count', users.size);
        });
    }

    login(userId) {
        users.set(userId, this.socket);
    }

    async sendMessage(data) {
        if (users.has(data.receiver.id)) {
            this.io.sockets.to(users.get(data.receiver.id).id).emit('message', data);
            this.io.sockets.to(users.get(data.sender.id).id).emit('message', data);
        }
        await messageService.createMessage({
            text: data.text,
            senderId: data.sender.id,
            receiverId: data.receiver.id,
        });
    }

    async sendIsTyping(data) {
        if (users.has(data.receiver.id)) {
            this.io.sockets.to(users.get(data.receiver.id).id).emit('isTyping', {
                id: uuidv4(),
                ...data,
            });
        }
    }

    getMessages() {
        messages.forEach((message) => this.sendMessage(message));
    }

    handleMessage(value) {
        const message = {
            id: uuidv4(),
            text: value.text,
            receiver: {
                ...value.receiver,
            },
            sender: {
                ...value.sender,
            },
            createdAt: Date.now(),
        };

        messages.add(message);
        this.sendMessage(message);
        messages.delete(message);
    }

    deleteMessage(messageId) {
        this.io.sockets.emit('deleteMessage', messageId);
    }

    deleteUser(userId) {
        users.delete(userId);
    }
}

function chat(io) {
    io.on('connection', (socket) => {
        new Connection(io, socket);
    });
}

export default chat;
