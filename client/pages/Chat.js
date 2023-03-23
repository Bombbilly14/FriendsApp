import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { io } from 'socket.io-client';
import axios from 'axios';
import { AuthContext } from '../context/auth'

const Chat = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [authState, _] = useContext(AuthContext);
  const { userId } = route.params;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://192.168.57.246:8000/api/messages/${authState.user._id}/${userId}`);
        setMessages(response.data.messages);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    const newSocket = io('http://192.168.57.246:8000/');
    setSocket(newSocket);

    newSocket.emit('join chat', { userId: authState.user._id });

    newSocket.on('new message', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      
      
    });

    newSocket.on('previous messages', (previousMessages) => {
        setMessages(previousMessages);
      });

    return () => newSocket.close();
  }, []);

  const handleSendMessage = () => {
    if (socket && message) {
      socket.emit('send message', {
        senderId: authState.user._id,
        receiverId: userId,
        message,
      });
  
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          _id: Math.random().toString(),
          sender: { name: authState.user.name },
          message,
        },
      ]);
  
      setMessage('');
    }
  };

  return (
    <View>
      {messages.map((msg) => (
        <Text key={msg._id}>
          {msg.sender.name}: {msg.message}
        </Text>
      ))}
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Type your message"
      />
      <TouchableOpacity onPress={handleSendMessage}>
        <Text>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Chat;
