import { Text, SafeAreaView, StyleSheet, View, FlatList, TouchableOpacity } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import FooterList from '../components/footer/FooterList'
import { AuthContext } from '../context/auth';
import axios from 'axios';
import Config from 'react-native-config';


const Home = () => {
  const [requests, setRequests] = useState([]);
  const [authState, setAuthState] = useContext(AuthContext);

  useEffect(() => {
    const fetchRequests = async () => {
      const res = await axios.get(`http://${Config.IP_ADDRESS}:8000/api/friend-requests`);
      console.log('Response data:', res.data);
      setRequests(res.data.friendRequests);
      console.log(requests)
    };

    fetchRequests();
  }, []);

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

      <TouchableOpacity
        style={{
          backgroundColor: '#007AFF',
          borderRadius: 10,
          padding: 8,
        }}
        onPress={() => acceptRequest(item._id)}
      >
        <Text style={{ color: '#fff' }}>Accept</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (requests.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>No requests at this time</Text>
        </View>
        <FooterList />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <FlatList
        horizontal
          data={requests}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
        />
      </View>
      <FooterList />
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between' }
})

export default Home