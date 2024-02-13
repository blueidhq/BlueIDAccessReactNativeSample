import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import * as React from 'react'

import Credentials from './Credentials'
import Devices from './Devices'

const Tab = createBottomTabNavigator()

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="Devices" component={Devices} />
                <Tab.Screen name="Credentials" component={Credentials} />
            </Tab.Navigator>
        </NavigationContainer>
    )
}
