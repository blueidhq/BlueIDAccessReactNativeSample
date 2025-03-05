import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import * as React from 'react'

import Identities from './Identities'
import Devices from './Devices'
import NfcItem from './nfc'

const Tab = createBottomTabNavigator()

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="Devices" component={Devices} />
                <Tab.Screen name="Identities" component={Identities} />
                <Tab.Screen name="NFC Item" component={NfcItem} />
            </Tab.Navigator>
        </NavigationContainer>
    )
}
