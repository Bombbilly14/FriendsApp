import React from 'react';
import { Text, View} from 'react-native';
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn';
import { createNativeStackNavigator} from '@react-navigation/native-stack'
import { StackActions, NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

export default function App() {
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName='SignIn'>
        <Stack.Screen name='SignUp' component={SignUp} />
        <Stack.Screen name='SignIn' component={SignIn} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}


