import React, { useCallback, useEffect, useState } from 'react'
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native'

import { BlueAccessDevice, BlueDeviceInfo } from '@blueid/access-proto'
import { BlueAccessListener, BlueIDAccess } from '@blueid/access-react-native'

import DeviceItem from './DeviceItem'

function Devices(): React.JSX.Element {
    const [allDevices, setAllDevices] = useState<BlueAccessDevice[]>([])
    const [nearbyDevices, setNearbyDevices] = useState<BlueDeviceInfo[]>([])

    const updateDevices = useCallback(async () => {
        // Update all devies with all devices the user has access to based on credentials
        // these devices might not be nearby at the moment
        const result = await BlueIDAccess.runCommand('listAccessDevices')
        setAllDevices(result.devices)
    }, [])

    const startScan = useCallback(async () => {
        const permissionStatus = await BlueIDAccess.runCommand('checkBluetoothPermission')

        if (permissionStatus !== 'granted') {
            Alert.alert(
                'Bluetooth permission not granted',
                'Bluetooth permission not granted. Grant it and open the app again.',
                [{ text: 'OK' }],
            )
            return
        }

        if (!(await BlueIDAccess.runCommand('isScanningActive'))) {
            await BlueIDAccess.runCommand('startScanning')
        }
    }, [])

    const handleDeviceAddedOrUpdated = useCallback(
        (deviceInfo: BlueDeviceInfo) => {
            const deviceIndex = nearbyDevices.findIndex(device => device.deviceId === deviceInfo.deviceId)
            if (deviceIndex >= 0) {
                setNearbyDevices(nearbyDevices.splice(deviceIndex, 1, deviceInfo))
            } else {
                setNearbyDevices(nearbyDevices.concat([deviceInfo]))
            }
        },
        [nearbyDevices],
    )

    const handleDeviceRemoved = useCallback(
        (deviceInfo: BlueDeviceInfo) => {
            setNearbyDevices(nearbyDevices.filter(device => device.deviceId !== deviceInfo.deviceId))
        },
        [nearbyDevices],
    )

    useEffect(() => {
        updateDevices()
        startScan()

        const listeners: Promise<BlueAccessListener>[] = []

        const syncFinishedListener = BlueIDAccess.addListener('tokenSyncFinished', () => updateDevices())
        const accessCredentialAddedListener = BlueIDAccess.addListener('accessCredentialAdded', () =>
            updateDevices(),
        )
        const deviceAddedListener = BlueIDAccess.addListener('deviceAdded', deviceInfo => {
            handleDeviceAddedOrUpdated(deviceInfo)
        })
        const deviceUpdatedListener = BlueIDAccess.addListener('deviceUpdated', deviceInfo => {
            handleDeviceAddedOrUpdated(deviceInfo)
        })
        const deviceRemovedListener = BlueIDAccess.addListener('deviceRemoved', deviceInfo => {
            handleDeviceRemoved(deviceInfo)
        })

        listeners.push(
            syncFinishedListener,
            accessCredentialAddedListener,
            deviceAddedListener,
            deviceUpdatedListener,
            deviceRemovedListener,
        )

        return () => {
            listeners.map(async listener => (await listener).remove())
        }

        // Runs only on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <View style={styles.root}>
            <FlatList
                data={nearbyDevices}
                renderItem={({ item }) => <DeviceItem allDevices={allDevices} nearbyDevice={item} />}
                ListHeaderComponent={<Text style={styles.title}>Nearby Devices</Text>}
                // eslint-disable-next-line react/no-unstable-nested-components
                ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
            />
            {nearbyDevices.length > 0 && (
                <Text style={styles.bottomMessage}>
                    {nearbyDevices.length
                        ? 'Click on any device to try to open it'
                        : 'No nearby devices found'}
                </Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 16,
    },
    bottomMessage: {
        marginTop: 16,
        alignSelf: 'center',
    },
    itemSeparator: {
        height: 8,
    },
})

export default Devices
