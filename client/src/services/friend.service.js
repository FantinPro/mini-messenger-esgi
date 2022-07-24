import { httpMethodsWrapper } from '../helpers/http-methods-wrapper';
import config from '../config/config';

const baseUrl = `${config.apiUrl}/friends`;

export const friendService = {
  getFriendsList,
  addFriend
};

function getFriendsList(userId) {
  return httpMethodsWrapper.get(`${baseUrl}/${userId}`);
}

function addFriend(friendId) {
  return httpMethodsWrapper.post(`${baseUrl}/add`, {
    receiverNameOrEmail: friendId
  });
}