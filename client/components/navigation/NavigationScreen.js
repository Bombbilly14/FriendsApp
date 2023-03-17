import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SignUp from '../../pages/SignUp'
import SignIn from '../../pages/SignIn';
import Home from '../../pages/Home'
import { AuthContext } from '../../context/auth';
import HeaderTabs from './HeaderTabs'

const Stack = createNativeStackNavigator();

const NavigationScreen = () => {
    const [state, setState] = useContext(AuthContext)
    const authenticated = state && state.token !== null && state.user !== null;

    return (
        <Stack.Navigator initialRouteName='SignIn'>
            {authenticated ?
                <Stack.Screen name='Home' component={Home} options={{ headerRight: () => <HeaderTabs /> }} /> : (
                    <>
                        <Stack.Screen name='SignUp' component={SignUp} />
                        <Stack.Screen name='SignIn' component={SignIn} />
                    </>
                )
            }
        </Stack.Navigator>

    )

}

export default NavigationScreen