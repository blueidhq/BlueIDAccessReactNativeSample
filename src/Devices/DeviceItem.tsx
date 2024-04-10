import React, { useCallback, useMemo } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { BlueAccessDevice, BlueDeviceInfo } from '@blueid/access-proto'
import { BlueIDAccess } from '@blueid/access-react-native'

function DeviceItem({
    allDevices,
    nearbyDevice,
}: {
    allDevices: BlueAccessDevice[]
    nearbyDevice: BlueDeviceInfo
}): React.JSX.Element {
    const { deviceId, distanceMeters } = nearbyDevice

    const tryOpenLock = useCallback(async () => {
        try {
            await BlueIDAccess.runCommand('tryAccessDevice', deviceId)
        } catch (e: any) {
            Alert.alert('Failed', e.message, [{ text: 'OK' }])
        }
    }, [deviceId])

    const objectName = useMemo(() => {
        return allDevices.find(device => device.deviceId === deviceId)?.objectName
    }, [deviceId, allDevices])

    return (
        <TouchableOpacity onPress={tryOpenLock}>
            <View style={styles.root}>
                <Text style={styles.deviceId}>ID: {deviceId}</Text>
                <Text>Object: {objectName}</Text>
                <Text>
                    Distance:{' '}
                    {distanceMeters < 1
                        ? `${(distanceMeters * 100).toFixed(0)}cm`
                        : `${distanceMeters?.toFixed(2)}m`}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: '#FFF',
        padding: 12,
        borderRadius: 8,
    },
    deviceId: {
        fontWeight: '600',
    },
})

export default DeviceItem
