import React, { useCallback, useEffect, useState } from 'react'
import { Alert, Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native'

import { BlueAccessCredential, BlueCredentialType, BlueLocalTimestamp } from '@blueid/access-proto'
import { BlueIDAccess } from '@blueid/access-react-native'

function blueTimeStampToDate(blueTimestamp: BlueLocalTimestamp | undefined): string {
    if (!blueTimestamp) {
        return ''
    }

    return new Date(
        blueTimestamp.year,
        blueTimestamp.month - 1,
        blueTimestamp.date,
        blueTimestamp.hours,
        blueTimestamp.minutes,
        blueTimestamp.seconds,
    )
        .toISOString()
        .substring(0, 19)
}

function ListHeader(): React.JSX.Element {
    return <Text style={styles.title}>Credentials</Text>
}

function Credentials(): React.JSX.Element {
    const [credentials, setCredentials] = useState([])
    const [activationToken, setActivationToken] = useState('')

    const loadCredentials = useCallback(async () => {
        const result = await BlueIDAccess.runCommand('getAccessCredentials')
        setCredentials(result.credentials)
    }, [])

    useEffect(() => {
        loadCredentials()

        const syncFinishedListener = BlueIDAccess.addListener('tokenSyncFinished', () => loadCredentials())
        const accessCredentialAddedLListener = BlueIDAccess.addListener('accessCredentialAdded', () =>
            loadCredentials(),
        )

        return () => {
            // eslint-disable-next-line no-extra-semi
            ;[syncFinishedListener, accessCredentialAddedLListener].map(async listener =>
                (await listener).remove(),
            )
        }
        // Runs only on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const renderItem = useCallback(({ item }: { item: BlueAccessCredential }) => {
        const credentialTypeNameMap = {
            [`${BlueCredentialType.Regular}`]: 'Regular',
            [`${BlueCredentialType.Master}`]: 'Master',
            [`${BlueCredentialType.NfcWriter}`]: 'NfcWriter',
            [`${BlueCredentialType.Maintenance}`]: 'Maintenance',
        }

        return (
            <View style={styles.listItem}>
                <Text style={styles.listItemId}>ID: {item.credentialId?.id}</Text>
                <Text>Name: {item.name}</Text>
                <Text>Site: {item.siteName}</Text>
                <Text>Type: {credentialTypeNameMap[item.credentialType]}</Text>
                <Text>Valid from: {blueTimeStampToDate(item.validFrom)}</Text>
                <Text>Valid to: {blueTimeStampToDate(item.validTo)}</Text>
                <Text>Validity: {blueTimeStampToDate(item.validity)}</Text>
            </View>
        )
    }, [])

    const handleClaim = useCallback(async () => {
        try {
            await BlueIDAccess.runCommand('claimAccessCredential', activationToken)
            loadCredentials()
            setActivationToken('')
            Alert.alert('Success', 'Credential claimed', [{ text: 'OK' }])
        } catch (e: any) {
            Alert.alert('Failed', e.message, [{ text: 'OK' }])
        }
    }, [activationToken, loadCredentials])

    return (
        <View style={styles.root}>
            <Text style={styles.title}>Add Credential</Text>
            <View style={styles.addCredential}>
                <TextInput
                    style={styles.activationTokenInput}
                    value={activationToken}
                    onChangeText={setActivationToken}
                    placeholder="Activation token"
                />
                <Button title="Claim" onPress={handleClaim} disabled={!activationToken} />
            </View>
            <FlatList
                data={credentials}
                renderItem={renderItem}
                ListHeaderComponent={ListHeader}
                ListEmptyComponent={<Text>No credential found</Text>}
                // eslint-disable-next-line react/no-unstable-nested-components
                ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
            />
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
    activationTokenInput: {
        fontSize: 18,
        backgroundColor: '#FFF',
        marginBottom: 16,
        padding: 8,
        borderRadius: 8,
        flex: 1,
    },
    addCredential: {
        flexDirection: 'row',
        gap: 16,
    },
    itemSeparator: {
        height: 8,
    },
})

export default Credentials
