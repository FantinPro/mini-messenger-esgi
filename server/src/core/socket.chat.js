import { v4 as uuidv4 } from 'uuid';
import * as messageService from '../services/message.service';
import logger from '../config/logger';

const messages = new Set();

class Connection {
    constructor(io, socket) {
        this.socket = socket;
        this.user = socket.handshake.query.userId;
        this.socket.join(this.user);
        this.io = io;

        socket.on('getMessages', () => this.getMessages());
        socket.on('message', (value) => this.handleMessage(value));
        socket.on('update', (message) => this.editMessage(message));
        socket.on('delete', (message) => this.deleteMessage(message));
        socket.on('disconnect', () => this.disconnect());
        socket.on('isTyping', (data) => {
            this.sendIsTyping(data);
        });
        socket.on('connect_error', (err) => {
            console.log(`connect_error due to ${err.message}`);
        });
    }

    login(userId) {
        this.socket.join(userId);
        this.user = userId;
    }

    async sendMessage(data) {
        const message = await messageService.createMessage({
            text: data.text,
            senderId: data.sender.id,
            receiverId: data.receiver.id,
        });

        console.log('🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩');
        console.log(message);
        console.log(this.user);
        console.log('🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦🟦');
        if (this.user) {
            this.io.sockets.to([data.receiver.id, data.sender.id]).emit('message', message);
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

    async sendIsTyping(data) {
        if (this.user) {
            this.io.sockets.to([data.receiver.id, data.sender.id]).emit('isTyping', {
                id: uuidv4(),
                ...data,
            });
        }
    }

    async deleteMessage(message) {
        if (message.sender.id === this.user) {
            const tmp = message;
            tmp.deleted = true;
            const result = await messageService.deleteMessage(message.id, tmp);

            if (result[0] > 0) {
                this.io.sockets.to([message.receiver.id, message.sender.id]).emit('delete', tmp);
            }
        }
    }

    async editMessage(message) {
        if (message.sender.id === this.user) {
            const tmp = message;
            tmp.edited = true;
            tmp.updated_at = Date.now();
            const result = await messageService.updateMessage(tmp);
            if (result[0] > 0) this.io.sockets.to([tmp.receiver.id, tmp.sender.id]).emit('update', tmp);
        }
    }

    disconnect() {
        this.socket.leave(this.user);
        this.user = null;
        this.socket.disconnect();
    }
}

function chat(io) {
    io.on('connection', (socket) => {
        new Connection(io, socket);
    });
}

export default chat;
