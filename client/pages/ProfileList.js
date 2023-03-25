import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/auth'
import Config from 'react-native-config';


const ProfileList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [authState, setAuthState] = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get(`http://${Config.IP_ADDRESS}:8000/api/users`);
      setUsers(res.data.filter((user) => user._id !== authState.user._id));
      setFilteredUsers(res.data.filter((user) => user._id !== authState.user._id));
    };

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
      console.error(err);
      alert('Failed to send friend request');
    }
  };
  
  

  const handleSearch = (text) => {
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(text.toLowerCase())
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
        paddingHorizontal: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
      }}
      onPress={() => {}}
    >
      <View>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
        <Text style={{ fontSize: 14, color: '#666' }}>{item.email}</Text>
      </View>
      <TouchableOpacity onPress={() => sendFriendRequest(item)}>
        <Text style={{ color: '#007AFF' }}>Send Friend Request</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          margin: 10,
          paddingHorizontal: 10,
        }}
        placeholder="Search by name"
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
