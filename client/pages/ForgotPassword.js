import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import axios from 'axios'
import React, {useState} from 'react'
import Config from 'react-native-config';

const ForgotPassword = ({navigation}) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [resetCode, setResetCode] = useState("")
    const [visible, setVisible] = useState(false)

    const handleSubmit = async () => {
        if(!email) {
            alert('email is required')
            return
        }
        try {
            const { data} = await axios.post(`http://${Config.IP_ADDRESS}:8000/api/forgot-password`, {email})
            if(data.error) alert(data.error)
            else {
                setVisible(true)
                alert('please enter the passcode sent to your email')
            }

        } catch(err) {
            alert('error sending email, please try again'); console.log(err)
        }
    }

    const handlePasswordReset = async () => {
        try {
            const { data  } = await axios.post(`http://${Config.IP_ADDRESS}:8000/api/reset-password`, { email, resetCode, password})
            if (data.error) alert(data.error)
            else {
                alert('Password reset successful')
                navigation.navigate('SignIn')
            }

        } catch(err) {alert('password reset failed, please try again'); console.log(err)}
    }
  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container} >
        <View style={{ marginVertical: 100}}>
            {/* <View><Image/></View> */}
            <Text style={styles.signupText}>Forgot Password?</Text>
            <View style={{marginHorizontal: 24}}>
                <Text style={{ fontSize: 16, color: 'darkmagenta'}}>EMAIL</Text>
                <TextInput style={styles.signupInput} value={email} onChangeText={text => setEmail(text)} autoCompleteType='email' keyboardType='email-address' />
            </View>
            {visible && (
                <>
                    <View style={{ marginHorizontal: 24}}>
                        <Text style= {{ fontSize: 16, color: 'darkmagenta' }}> NEW PASSWORD</Text>
                        <TextInput style={styles.signupInput} value={password} onChangeText={text => setPassword(text)} secureTextEntry={true} autoCompleteType='password'/>
                    </View>
                    <View style={{ marginHorizontal: 24}}>
                        <Text style= {{ fontSize: 16, color: 'darkmagenta' }}> PASSWORD RESET CODE</Text>
                        <TextInput style={styles.signupInput} value={resetCode} onChangeText={text => setResetCode(text)} />
                    </View>
                </>
            )}
            <TouchableOpacity onPress={visible ? handlePasswordReset : handleSubmit} style={styles.buttonStyle}>
                <Text style={styles.buttonText}>{visible ? "Reset Password" : "Request Reset Code"}</Text>
            </TouchableOpacity>
            <Text onPress={() => navigation.navigate("Sign In")} style={styles.forgotText} >
                Sign In
            </Text>
        </View>
    </KeyboardAwareScrollView>
  )
}

export default ForgotPassword

const styles = StyleSheet.create({
    container: {flex: 1, justifyContent: 'center'},
    forgotText:{ fontSize: 12, textAlign: 'center', marginTop: 10, color: 'darkgreen', fontWeight: 'bold'},
    signupText: { fontSize: 30, textAlign: 'center'},
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
})