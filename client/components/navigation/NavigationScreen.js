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
        <Stack.Navigator initialRouteName='Sign In'>
            {authenticated ?
                <>
                    <Stack.Screen name='Home' component={Home} />
                    <Stack.Screen name='Account' component={Account}  options={{ headerRight: () => <HeaderTabs /> }}/>
                    <Stack.Screen name='Profile List' component={ProfileList} />
                    <Stack.Screen name="Friends" component={UserList} />
                    <Stack.Screen name="Chat" component={Chat} />
                </>
                : (
                    <>
                        <Stack.Screen name='Sign Up' component={SignUp} />
                        <Stack.Screen name='Sign In' component={SignIn} />
                        <Stack.Screen name='Forgot password?' component={ForgotPassword} />

                    </>
                )
            }
        </Stack.Navigator>

    )

}

export default NavigationScreen