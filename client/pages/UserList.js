import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/auth';
import '../assets/friendsApplogo.jpg';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const UserList = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [sortedUsers, setSortedUsers] = useState([]);

  const [authState, _] = useContext(AuthContext);

  

  useEffect(() => {
    const usersWithLatestMessages = users.map((user) => {
      const latestMessage = findLatestMessage(user._id);
      return { ...user, latestMessage };
    });
  
    const sorted = usersWithLatestMessages.sort((a, b) => {
      if (!a.latestMessage && !b.latestMessage) {
        return 0;
      }
      if (!a.latestMessage) {
        return 1;
      }
      if (!b.latestMessage) {
        return -1;
      }
      return new Date(b.latestMessage.timestamp) - new Date(a.latestMessage.timestamp);
    });
  
    setSortedUsers(sorted);
  }, [users, messages]);
  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://192.168.57.246:8000/api/users');
        setUsers(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      const fetchedMessages = [];
  
      try {
        for (const user of users) {
          const response = await axios.get(
            `http://192.168.57.246:8000/api/messages/${authState.user._id}/${user._id}`
          );
          fetchedMessages.push(...response.data.messages);
        }
        setMessages(fetchedMessages);
      } catch (error) {
        console.log(error);
      }
    };
  
    if (users.length) {
      fetchMessages();
    }
  }, [users]);
  
  const findLatestMessage = (userId) => {
    const latestMessage = messages
      .filter((message) => message.sender._id === userId || message.receiver._id === userId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

    return latestMessage;
  };

  const handleUserPress = (userId) => {
    navigation.navigate('Chat', { userId });
  };

  
  return (
    <KeyboardAwareScrollView >
    <View style={styles.container}>
      {sortedUsers.filter((user) => user._id !== authState.user._id)
        .map((user) => {
        const latestMessage = findLatestMessage(user._id);
        return (
          <TouchableOpacity key={user._id} onPress={() => handleUserPress(user._id)} style={styles.userCard}>
            <Image
              source={user.image?.url ? { uri: user.image.url } : require('../assets/friendsApplogo.jpg')}
              style={styles.userImage}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              {latestMessage && (
                <Text style={styles.latestMessage}>
                  {latestMessage.sender._id === authState.user._id ? 'You: ' : ''}
                  {latestMessage.message}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    paddingHorizontal: 10,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'darkmagenta',
    borderRadius: 10,
    marginVertical: 5,
    padding: 10,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    alignSelf: 'flex-start',
  },
  latestMessage: {
    fontSize: 14,
    color: '#ddd',
    alignSelf: 'center',
  },
});

export default UserList;
