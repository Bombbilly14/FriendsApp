import React, { useEffect, useState, useContext, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Platform, StyleSheet, KeyboardAvoidingView} from 'react-native';
import { io } from 'socket.io-client';
import axios from 'axios';
import { AuthContext } from '../context/auth';
import Config from 'react-native-config';


const Chat = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [authState, _] = useContext(AuthContext);
  const [user, setUser] = useState({});
  const { userId } = route.params;
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://${Config.IP_ADDRESS}:8000/api/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http:/${Config.IP_ADDRESS}:8000/api/messages/${authState.user._id}/${userId}`);
        setMessages(response.data.messages);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    const newSocket = io(`http://${Config.IP_ADDRESS}:8000/`);
    setSocket(newSocket);

    newSocket.emit('join chat', { userId: authState.user._id });
    newSocket.on('new message', (newMessage) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...newMessage,
          sender: {
            _id: newMessage.senderId,
            name:
              newMessage.senderId === authState.user._id
                ? authState.user.name
                : user.name,
          },
        },
      ]);
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
          sender: {
            _id: authState.user._id,
            name: authState.user.name,
          },
          message,
        },
      ]);

      setMessage('');
    }
  };

  const scrollToBottom = () => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset='true'
    >
      <View style={styles.header}>
        <Image
          source={
            user.image?.url
              ? { uri: user.image.url }
              : require('../assets/friendsApplogo.jpg')
          }
          style={styles.avatar}
        />
        <Text style={styles.headerTitle}>{user.name}</Text>
        </View>
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={scrollToBottom}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
      >
        {messages.map((msg) => (
          <View
            key={msg._id}
            style={[
              styles.messageContainer,
              msg.sender._id === authState.user._id
                ? styles.sentMessage
                : styles.receivedMessage,
            ]}
          >
            {msg.sender._id !== authState.user._id && (
              <Image
                source={
                  user.image?.url
                    ? { uri: user.image.url }
                    : require('../assets/friendsApplogo.jpg')
                }
                style={styles.messageAvatar}
              />
            )}
            <View style={styles.messageBubble}>
              <Text style={styles.messageText}>{msg.message}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message"
          style={styles.input}
        />
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  sentMessage: {
    justifyContent: 'flex-end',
  },
  receivedMessage: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#8B008B',
  },
  messageText: {
    fontSize: 14,
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#8B008B',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
  },
  sendButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default Chat;

