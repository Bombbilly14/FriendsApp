import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/auth'
import Config from 'react-native-config';


const ProfileList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [authState, setAuthState] = useContext(AuthContext);

  const fetchUsers = async () => {
    try {
      const loggedInUserRes = await axios.get(`http://${Config.IP_ADDRESS}:8000/api/friends`, {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
      const loggedInUserFriends = loggedInUserRes.data.friends.map(friend => friend._id);
  
      const res = await axios.get(`http://${Config.IP_ADDRESS}:8000/api/users`);
      const nonFriendUsers = res.data.filter(
        (user) => user._id !== authState.user._id && !loggedInUserFriends.includes(user._id)
      );
  
      setUsers(nonFriendUsers);
      setFilteredUsers(nonFriendUsers);
      
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  

  const sendFriendRequest = async (user) => {
    const userId = user._id;
    console.log(user);
    try {
      await axios.post(
        `http://${Config.IP_ADDRESS}:8000/api/friend-request/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        }
      );
      alert('Friend request sent');
      setFilteredUsers(filteredUsers.filter((user) => user._id !== userId));
      setUsers(users.filter((user) => user._id !== userId));
    } catch (err) {
      console.log(err);
      alert('Failed to send friend request');
    }
  };
  
  

  const handleSearch = (text) => {
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(text.toLowerCase()) || user.email.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
      }}
      onPress={() => {}}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View
          style={{
            backgroundColor: '#007AFF',
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 10,
          }}
        >
          <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
            {item.name[0]}
          </Text>
        </View>
        <View>
          <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{item.name}</Text>
          <Text style={{ fontSize: 11, color: '#666' }}>{item.email}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => sendFriendRequest(item)}
        style={{
          backgroundColor: '#007AFF',
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 20,
        }}
      >
        <Text style={{ color: 'white' }}>Request</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <TextInput
        style={{
          height: 40,
          borderColor: '#ccc',
          borderWidth: 1,
          margin: 10,
          paddingHorizontal: 10,
          borderRadius: 20,
          backgroundColor: 'white',
        }}
        placeholder="Search by name or email"
        onChangeText={(text) => handleSearch(text)}
      />
      <FlatList
        data={filteredUsers}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

export default ProfileList;