import { Text, StyleSheet, View, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import FooterList from '../components/footer/FooterList'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AuthContext } from '../context/auth'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import * as ImagePicker from 'react-native-image-picker';

const Account = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const [image, setImage] = useState({ url: "", public_id: "" })
  const [uploadImage, setUploadImage] = useState("")
  const [state, setState] = useContext(AuthContext)
  

  useEffect(() => {
    if (state) {
      const { name, email, role, image } = state.user
      setName(name)
      setEmail(email)
      setRole(role)
      setImage(image)
    }
  }, [state])

  const handleSubmit = async () => {
    if (email === '' || password === '') {
      alert("All fields are required")
      return
    }
    const response = await axios.post("http://localhost:8000/api/signin", { email, password })
    if (response.data.error)
      alert(response.data.error)
    else {
      setState(response.data)
      await AsyncStorage.setItem("auth-rn", JSON.stringify(response.data));
    }
  }

  const handleUpload = async () => {    
    let pickerResult = await ImagePicker.launchImageLibrary({
      allowsEditing: true,
      aspect: [4, 3],
      includeBase64: true
    })
  
    if (pickerResult.cancelled === true) {
      return
    }
    let base64Image = `data:image/jpeg;base64,${pickerResult.assets[0].base64}`;
    console.log(pickerResult.assets[0].base64)
    setUploadImage(base64Image)
        
    let storedData = await AsyncStorage.getItem("auth-rn")
    const parsed = JSON.parse(storedData)
    const { data } = await axios.post("http://172.19.126.208:8000/api/upload-image", {
      image: base64Image,
      user: parsed.user
    })
    console.log("UPLOAD RESPONSE => ", data)
    // update async storage
    const stored = JSON.parse(await AsyncStorage.getItem("auth-rn"))
    stored.user = data;
    await AsyncStorage.setItem("auth-rn", JSON.stringify(stored))
  
    //updated context
    setState({...state, user: data})
    setImage(data.image)
    alert("profile image saved")
  }
  


  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <View style={{ marginVertical: 100 }}>
        <View style={styles.imageContainer}>
          {image && image.url ? (
            <Image source={{ uri: image.url }} style={styles.imageStyles} />
          ) : (
            uploadImage ? (
              <Image source={{ uri: uploadImage }} style={styles.imageStyles} />
            ) : (
              <TouchableOpacity onPress={() => handleUpload()}>
                <FontAwesome5 name="camera" size={25} color='darkmagenta' />
              </TouchableOpacity>
            )
          )}

        </View>
        {image && image.url ? (
          <TouchableOpacity onPress={() => handleUpload()}>
            <FontAwesome5 name="camera" size={25} color='darkmagenta' style={styles.iconStyle} />
          </TouchableOpacity>
        ) : (
          <></>
        )
        }
        <Text style={styles.signupText}> {name} </Text>
        <Text style={styles.emailText}>{email}</Text>
        <Text style={styles.roleText}>{role}</Text>
        <View style={{ marginHorizontal: 24 }}>
          <Text style={{ fontSize: 16, color: 'darkmagenta' }}>PASSWORD</Text>
          <TextInput style={styles.signupInput} value={password} onChangeText={text => setPassword(text)} secureTextEntry={true} autoComplteType="password" />
        </View>
        <TouchableOpacity onPress={handleSubmit} style={styles.buttonStyle}>
          <Text style={styles.buttonText}> Update Password</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  )

}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  signupText: { fontSize: 30, textAlign: 'center', paddingBottom: 10 },
  emailText: { fontSize: 18, textAlign: 'center', paddingBottom: 10 },
  roleText: { fontSize: 16, textAlign: 'center', paddingBottom: 10, color: 'grey' },
  signupInput: { borderBottomWidth: 0.5, height: 48, borderBottomColor: 'black', marginBottom: 30 },
  buttonStyle: { backgroundColor: 'darkmagenta', height: 50, marginBottom: 20, justifyContent: 'center', marginHorizontal: 15, borderRadius: 15 },
  buttonText: { fontSize: 20, textAlign: 'center', color: '#fff', textTransform: 'uppercase', fontWeight: 'bold' },
  imageContainer: { justifyContent: 'center', alignItems: 'center' },
  imageStyles: { width: 100, height: 100, marginVertical: 20 },
  iconStyle: { marginTop: -5, marginBottom: 10, alignSelf: 'center' }
})

export default Account