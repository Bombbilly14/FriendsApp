import { Text, View, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, {useState} from 'react'
import axios from 'axios';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const SignUp = ({navigation}) => {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async () => {
    if (name === '' || email === '' || password === '') {
      Alert.alert("All fields are required")
      return;
    }
    try {
      const response = await axios.post('http://localhost:8001/api/signup', {name, email, password})
      Alert.alert("Success", "User created successfully")
      setName('')
      setEmail('')
      setPassword('')
    } catch (error) {
      Alert.alert("Error", "Unable to create user")
    }
  }

    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <View styles={styles.container}>
        <Text style={styles.signupText}>SignUp</Text>
        <View style={{ marginHorizontal: 24 }}>
            <Text style={{ fontSize: 16, color: 'blue' }}>NAME</Text>
            <TextInput style={styles.signupInput} value={name} onChangeText={text => setName(text)} />
        </View>
        <View style={{ marginHorizontal: 24 }}>
            <Text style={{ fontSize: 16, color: 'blue' }}>EMAIL</Text>
            <TextInput style={styles.signupInput} value={email} onChangeText={text => setEmail(text)} />
        </View>
        <View style={{ marginHorizontal: 24 }}>
            <Text style={{ fontSize: 16, color: 'blue' }}>PASSWORD</Text>
            <TextInput style={styles.signupInput} value={password} onChangeText={text => setPassword(text)} secureTextEntry={true} />
        </View>
        <TouchableOpacity style={styles.buttonStyle}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 12, textAlign: 'center' }}>
            Already a member? {' '}
            <Text style={{ color: 'darkred', fontWeight: 'bold'}} onPress={() => navigation.navigate('SignIn')}>
              Sign In
            </Text>
        </Text>
      </View>
       </KeyboardAwareScrollView>
    )
  }


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    signupText: {
        fontSize: 30,
        textAlign: 'center'

    },
    signupInput: {
        borderBottomWidth: 0.5,
        height: 48,
        borderBottomColor: "black",
        marginBottom: 30,
    },
     buttonStyle: {
      backgroundColor: "darkmagenta",
      height: 50,
      marginBottom: 20,
      justifyContent: "center",
      marginHorizontal: 15,
      borderRadius: 15
    },
     buttonText: {
      fontSize: 20,
      textAlign: 'center',
      color: '#fff',
      textTransform: 'uppercase',
      fontWeight: 'bold'
    },
     imageContainer: { justifyContent: 'center', alignItems: "center"},
     imageStyles: { width: 100, height: 100, marginVertical: 20}

})

export default SignUp