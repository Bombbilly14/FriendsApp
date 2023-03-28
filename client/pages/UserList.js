import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/auth';
import '../assets/friendsApplogo.jpg';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Config from 'react-native-config';


const UserList = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [sortedUsers, setSortedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [authState, _] = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://${Config.IP_ADDRESS}:8000/api/friends`, {
          headers: {
            'Authorization': `Bearer ${authState.token}`
          }
        });
        setUsers(response.data.friends);
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
            `http://${Config.IP_ADDRESS}:8000/api/messages/${authState.user._id}/${user._id}`
          );
          fetchedMessages.push(...response.data.messages);
        }
        setMessages(fetchedMessages);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };

    if (users.length) {
      fetchMessages();
    }
  }, [users]);

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

  const findLatestMessage = (userId) => {
    const latestMessage = messages
      .filter((message) => message.sender._id === userId || message.receiver._id === userId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

    if (!latestMessage) {
      return null;
    }

    const maxLength = 30;
    let messageText = latestMessage.message;

    if (messageText.length > maxLength) {
      messageText = messageText.slice(0, maxLength) + "...";
    }

    if (latestMessage.sender._id === authState.user._id) {
      messageText = "You: " + messageText;
    }

    return { ...latestMessage, message: messageText };
  };

  const handleUserPress = (userId) => {
    navigation.navigate('Chat', { userId });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <View style={styles.userCard}>
          {sortedUsers
            .filter((user) => user._id !== authState.user._id)
            .map((user, index) => {
              const latestMessage = findLatestMessage(user._id);
              return (
                <React.Fragment key={user._id}>
                  {index > 0 && <View style={styles.userSeparator} />}
                  <TouchableOpacity
                    onPress={() => handleUserPress(user._id)}
                    style={styles.userItem}
                  >
                    <Image
                      source={
                        user.image?.url
                          ? { uri: user.image.url }
                          : require("../assets/friendsApplogo.jpg")
                      }
                      style={styles.userImage}
                    />
                    <View style={styles.userInfo}>
                      <Text style={styles.userName}>{user.name}</Text>
                      {latestMessage && (
                        <Text style={styles.latestMessage}>
                          {latestMessage.message}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                </React.Fragment>
              );
            })}
        </View>
        <Text style= {{ justifyContent: 'center', alignSelf: 'center', marginTop: 100, fontStyle: 'italic'}}> Add more friends to start messaging!</Text>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "darkmagenta",
    paddingHorizontal: 10,
    paddingVertical: 5,
    minHeight: 500
  },
  userCard: {
    backgroundColor: "#000000",
    borderRadius: 10,
    padding: 10,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userSeparator: {
    height: 1,
    backgroundColor: "#000000",
    marginVertical: 5,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userInfo: {
    flexDirection: "column",
    justifyContent: "space-between",
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
    alignSelf: "flex-start",
  },
  latestMessage: {
    fontSize: 12,
    color: "#ddd",
    alignSelf: "flex-start",
  },
});

export default UserList;