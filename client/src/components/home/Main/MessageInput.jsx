import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../../contexts/user.context';
// import './MessageInput.css';

const NewMessage = ({socket}) => {
  const { user } = useContext(UserContext);
  console.log(user)
  const [value, setValue] = useState('');
  const submitForm = (e) => {
    e.preventDefault();
    socket.emit('message', {
      chatId: useParams.friendId,
      message: value
    });
    setValue('');
  };

  return (
    <form onSubmit={submitForm}>
      <input
        autoFocus
        value={value}
        placeholder="Type your message"
        onChange={(e) => {
          setValue(e.currentTarget.value);
        }}
      />
    </form>
  );
};

export default NewMessage;
