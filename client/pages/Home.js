import { Text, SafeAreaView, StyleSheet, View, FlatList, TouchableOpacity } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import FooterList from '../components/footer/FooterList'
import { AuthContext } from '../context/auth';
import axios from 'axios';
import Config from 'react-native-config';


const Home = () => {
  const [requests, setRequests] = useState([]);
  const [authState, setAuthState] = useContext(AuthContext);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const res = await axios.get(`http://${Config.IP_ADDRESS}:8000/api/friend-requests`);
      console.log('Response data:', res.data);
      setRequests(res.data.friendRequests);
      console.log(requests)
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://${Config.IP_ADDRESS}:8000/api/friends`, {
          headers: {
            'Authorization': `Bearer ${authState.token}`
          }
        });
        setFriends(response.data.friends);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, []);

  const deleteFriendRequest = async (requestId) => {
    try {
      const response = await axios.delete(`http://${Config.IP_ADDRESS}:8000/api/friends/requests/${requestId}`, {
        headers: {
          'Authorization': `Bearer ${authState.token}`
        }
      });
      setRequests(prevRequests => prevRequests.filter((request) => request._id !== requestId));
    } catch (error) {
      console.log(error);
    }
  };
  

  const acceptRequest = async (requestId) => {
    console.log(requestId)
    try {
      await axios.put(
        `http://${Config.IP_ADDRESS}:8000/api/friend-request/${requestId}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );
      alert('Request accepted');
      setRequests(prevRequests => prevRequests.filter((request) => request._id !== requestId));

    } catch (err) {
      console.error(err);
      alert('Failed to accept request');
    }
  };
  

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={{
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        margin: 10,
        shadowColor: '#000',
        height: 125,
        marginTop: 100,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
      }}
      onPress={() => { }}
    >
      <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
        {item.name} wants to be friends
      </Text>
      <Text style={{ marginBottom: 10 }}>{item.email}</Text>
  
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity
          style={{
            backgroundColor: 'darkmagenta',
            borderRadius: 10,
            padding: 8,
            marginRight: 4,
            width: 100
          }}
          onPress={() => acceptRequest(item._id)}
        >
          <Text style={{ color: '#fff' }}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: 'red',
            borderRadius: 10,
            paddingVertical: 8,
            paddingHorizontal: 4,
          }}
          onPress={() => deleteFriendRequest(item._id)}
        >
          <Text style={{ color: '#fff' }}>Decline</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.welcomeMessage}>
          Welcome to Friends! Send or accept requests to start messaging
          Friends!
        </Text>
      </View>
      <View style={styles.bottomSection}>
        {requests.length === 0 ? (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text>No requests at this time</Text>
          </View>
        ) : (
          <FlatList
            horizontal
            data={requests}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
          />
        )}
      </View>
      <FooterList />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between' },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  welcomeMessage: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    fontStyle: 'italic',
    color: 'blue',
  },
  bottomSection: {
    flex: 2,
  },
});

export default Home;