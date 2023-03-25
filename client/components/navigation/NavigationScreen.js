import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SignUp from '../../pages/SignUp'
import SignIn from '../../pages/SignIn';
import Home from '../../pages/Home'
import { AuthContext } from '../../context/auth';
import HeaderTabs from './HeaderTabs'
import Account from '../../pages/Account'
import ProfileList from '../../pages/ProfileList'
import ForgotPassword from '../../pages/ForgotPassword'
import Chat from '../../pages/Chat'
import UserList from '../../pages/UserList'

const Stack = createNativeStackNavigator();

const NavigationScreen = () => {
    const [state, setState] = useContext(AuthContext)
    const authenticated = state && state.token !== null && state.user !== null;

    return (
        <Stack.Navigator initialRouteName='SignIn'>
            {authenticated ?
                <>
                    <Stack.Screen name='Home' component={Home} />
                    <Stack.Screen name='Account' component={Account}  options={{ headerRight: () => <HeaderTabs /> }}/>
                    <Stack.Screen name='ProfileList' component={ProfileList} />
                    <Stack.Screen name="UserList" component={UserList} />
                    <Stack.Screen name="Chat" component={Chat} />
                </>
                : (
                    <>
                        <Stack.Screen name='SignUp' component={SignUp} />
                        <Stack.Screen name='SignIn' component={SignIn} />
                        <Stack.Screen name='forgot-password' component={ForgotPassword} />

                    </>
                )
            }
        </Stack.Navigator>

    )

}

export default NavigationScreen