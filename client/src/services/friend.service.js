import { httpMethodsWrapper } from '../helpers/http-methods-wrapper';
import config from '../config/config';

const baseUrl = `${config.apiUrl}/api/v1/friends`;

export const friendService = {
  getFriendsList,
  addFriend,
  acceptFriend,
  deleteFriend,
  getFriendChat,
};

function getFriendsList(userId) {
  return httpMethodsWrapper.get(`${baseUrl}/${userId}`);
}

function addFriend(friendId) {
  return httpMethodsWrapper.post(`${baseUrl}/add`, {
    receiverNameOrEmail: friendId
  });
}

function acceptFriend(friendId) {
  return httpMethodsWrapper.put(`${baseUrl}/${friendId}`);
}

function deleteFriend(friendId) {
  return httpMethodsWrapper.delete(`${baseUrl}/${friendId}`);
}

function getFriendChat(friendId) {
  return httpMethodsWrapper.get(`${baseUrl}/${friendId}/chat`);
}