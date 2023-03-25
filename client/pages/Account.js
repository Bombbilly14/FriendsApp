import { Text, StyleSheet, View, Image, TextInput, TouchableOpacity, Modal } from 'react-native'
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
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [newPassword, setNewPassword] = useState("");
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
    try {
      let storedData = await AsyncStorage.getItem("auth-rn")
      const user = JSON.parse(storedData)
      console.log(user)
      const response = await axios.post("http://172.28.165.55:8000/api/update-password", { password, newPassword, user })
      const data = response.data
      if (data.error) {
        setErrorMessage(data.error);
      } else {
        setIsModalVisible(false);
        alert("Password updated successfully");
        setPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }

    } catch (err) {
      alert("password update failed")
      console.log(err)
    }
  }

  const handleOpenModal = () => {
    setIsModalVisible(true);
    setErrorMessage("");
  }

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setErrorMessage("");
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
    const { data } = await axios.post("http://192.168.57.246:8000/api/upload-image", {
      image: base64Image,
      user: parsed.user
    })
    console.log("UPLOAD RESPONSE => ", data)
    // update async storage
    const stored = JSON.parse(await AsyncStorage.getItem("auth-rn"))
    stored.user = data;
    await AsyncStorage.setItem("auth-rn", JSON.stringify(stored))

    //updated context
    setState({ ...state, user: data })
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
        <TouchableOpacity onPress={handleOpenModal} style={styles.buttonStyle}>
          <Text style={styles.buttonText}> Update Password</Text>
        </TouchableOpacity>
        <Modal visible={isModalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
              <FontAwesome5 name="times" size={25} color="darkmagenta" />
            </TouchableOpacity>
            <View style={styles.modalContent}>
              <KeyboardAwareScrollView>
              <Text style={styles.modalTitle}>Update Password</Text>
              {errorMessage !== "" && <Text style={styles.errorText}>{errorMessage}</Text>}
              <TextInput style={styles.modalInput} value={password} onChangeText={text => setPassword(text)} placeholder="Current Password" secureTextEntry={true} autoCompleteType="password" />
              <TextInput style={styles.modalInput} value={newPassword} onChangeText={text => setNewPassword(text)} placeholder="New Password" secureTextEntry={true} autoCompleteType="password" />
              <TextInput style={styles.modalInput} value={confirmNewPassword} onChangeText={text => setConfirmNewPassword(text)} placeholder="Confirm New Password" secureTextEntry={true} autoCompleteType="password" />
              <TouchableOpacity style={styles.modalButton} onPress={handleSubmit}>
                <Text style={styles.modalButtonText}>Update</Text>
              </TouchableOpacity>
              </KeyboardAwareScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAwareScrollView>
  )

}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    height: 100
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyles: {
    width: 100,
    height: 100,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'darkmagenta',
  },
  signupText: {
    fontSize: 20,
    color: 'darkmagenta',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  emailText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    marginBottom: 10,
  },
  roleText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonStyle: {
    backgroundColor: 'darkmagenta',
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    height: 100
  },
  closeButton: {
    padding: 10,
  },
  modalContent: {
    flex: 1,
    marginHorizontal: 24,
    marginVertical: 32,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'darkmagenta',
    marginBottom: 16,
  },
  modalInput: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 8,
    paddingHorizontal: 8,
  },
  modalButton: {
    backgroundColor: 'darkmagenta',
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 20,
  },
  modalButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
});

export default Account