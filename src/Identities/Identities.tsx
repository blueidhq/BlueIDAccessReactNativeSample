import React, { useCallback, useEffect, useState } from 'react'
import { Alert, Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native'

import { BlueCredentialType, BlueIdentity, BlueLocalTimestamp } from '@blueid/access-proto'
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
    return <Text style={styles.title}>Identities</Text>
}

function Identities(): React.JSX.Element {
    const [identities, setIdentities] = useState([])
    const [activationToken, setActivationToken] = useState('')

    const loadIdentities = useCallback(async () => {
        const result = await BlueIDAccess.runCommand('getIdentities')
        setIdentities(result.identities)
    }, [])

    useEffect(() => {
        loadIdentities()

        const syncFinishedListener = BlueIDAccess.addListener('tokenSyncFinished', () => loadIdentities())
        const accessCredentialAddedLListener = BlueIDAccess.addListener('accessCredentialAdded', () =>
            loadIdentities(),
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

    const renderItem = useCallback(({ item }: { item: BlueIdentity }) => {
        const credentialTypeNameMap = {
            [`${BlueCredentialType.Regular}`]: 'Regular',
            [`${BlueCredentialType.Master}`]: 'Master',
            [`${BlueCredentialType.NfcWriter}`]: 'NfcWriter',
            [`${BlueCredentialType.Maintenance}`]: 'Maintenance',
            [`${BlueCredentialType.Emergency}`]: 'Emergency',
        }

        return (
            <View style={styles.listItem}>
                <Text style={styles.listItemId}>ID: {item.identityId}</Text>
                <Text>Name: {item.name}</Text>
                <Text>Site: {item.siteName}</Text>
                <Text>Type: {credentialTypeNameMap[item.role]}</Text>
                <Text>Valid from: {blueTimeStampToDate(item.validFrom)}</Text>
                <Text>Valid to: {blueTimeStampToDate(item.validTo)}</Text>
            </View>
        )
    }, [])

    const handleClaim = useCallback(async () => {
        try {
            await BlueIDAccess.runCommand('claimIdentity', activationToken)
            loadIdentities()
            setActivationToken('')
            Alert.alert('Success', 'Identity claimed', [{ text: 'OK' }])
        } catch (e: any) {
            Alert.alert('Failed', e.message, [{ text: 'OK' }])
        }
    }, [activationToken, loadIdentities])

    return (
        <View style={styles.root}>
            <Text style={styles.title}>Add Identity</Text>
            <View style={styles.addIdentity}>
                <TextInput
                    style={styles.activationTokenInput}
                    value={activationToken}
                    onChangeText={setActivationToken}
                    placeholder="Activation token"
                />
                <Button title="Claim" onPress={handleClaim} disabled={!activationToken} />
            </View>
            <FlatList
                data={identities}
                renderItem={renderItem}
                ListHeaderComponent={ListHeader}
                ListEmptyComponent={<Text>No identities found</Text>}
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
    addIdentity: {
        flexDirection: 'row',
        gap: 16,
    },
    itemSeparator: {
        height: 8,
    },
})

export default Identities
