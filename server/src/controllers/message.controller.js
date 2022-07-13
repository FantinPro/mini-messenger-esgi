import * as messageService from '../services/message.service';

export const sendMessage = async (req, res, next) => {
    try {
        const { text, receiverId } = req.body;
        const message = await messageService.createMessage({
            text,
            senderId: req.user.id,
            receiverId,
        });
        res.json(message);
    } catch (e) {
        next(e);
    }
};

export const getMessagesFromUsers = async (req, res, next) => {
    try {
        const { senderId, receiverId } = req.params;
        const messages = await messageService.getMessagesFromUsers(senderId, receiverId);
        res.json(messages);
    } catch (e) {
        next(e);
    }
};

export const updateMessage = async (req, res, next) => {
    try {
        const { messageId } = req.params;
        const { body } = req;
        const message = await messageService.updateMessage(messageId, body);
        res.json(message);
    } catch (e) {
        next(e);
    }
};
