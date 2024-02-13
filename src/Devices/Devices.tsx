import React, { useCallback, useEffect, useState } from 'react'
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { BlueAccessDevice } from '@blueid/access-proto'
import { BlueIDAccess } from '@blueid/access-react-native'

function ListHeader(): React.JSX.Element {
    return <Text style={styles.title}>Devices</Text>
}

function Devices(): React.JSX.Element {
    const [devices, setDevices] = useState([])

    const updateDevices = useCallback(async () => {
        const result = await BlueIDAccess.runCommand('listAccessDevices')
        setDevices(result.devices)
    }, [])

    const startBluetoothScan = useCallback(async () => {
        if (!(await BlueIDAccess.runCommand('isBluetoothActive'))) {
            await BlueIDAccess.runCommand('bluetoothActivate')
        }
    }, [])

    useEffect(() => {
        updateDevices()
        startBluetoothScan()

        const syncStartedListener = BlueIDAccess.addListener('tokenSyncStarted', () => updateDevices())
        const syncFinishedListener = BlueIDAccess.addListener('tokenSyncFinished', () => updateDevices())
        const accessCredentialAddedLListener = BlueIDAccess.addListener('accessCredentialAdded', () =>
            updateDevices(),
        )

        return () => {
            // eslint-disable-next-line no-extra-semi
            ;[syncStartedListener, syncFinishedListener, accessCredentialAddedLListener].map(async listener =>
                (await listener).remove(),
            )
        }

        // Runs only on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const tryOpenLock = useCallback(async (device: BlueAccessDevice) => {
        try {
            await BlueIDAccess.runCommand('tryAccessDevice', device.deviceId)
        } catch (e: any) {
            Alert.alert('Failed', e.message, [{ text: 'OK' }])
        }
    }, [])

    const renderItem = useCallback(
        ({ item }: { item: BlueAccessDevice }) => {
            return (
                <TouchableOpacity onPress={() => tryOpenLock(item)}>
                    <View style={styles.listItem}>
                        <Text style={styles.listItemId}>ID: {item.deviceId}</Text>
                        <Text>Object: {item.objectName}</Text>
                    </View>
                </TouchableOpacity>
            )
        },
        [tryOpenLock],
    )

    return (
        <View style={styles.root}>
            <FlatList
                data={devices}
                renderItem={renderItem}
                ListHeaderComponent={ListHeader}
                ListEmptyComponent={<Text>No device found</Text>}
                // eslint-disable-next-line react/no-unstable-nested-components
                ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
            />
            {devices.length > 0 && (
                <Text style={styles.bottomMessage}>Click on any device to try open it.</Text>
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
    listItem: {
        backgroundColor: '#FFF',
        padding: 12,
        borderRadius: 8,
    },
    listItemId: {
        fontWeight: '600',
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
