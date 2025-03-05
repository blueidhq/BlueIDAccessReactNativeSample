import React, { useCallback } from 'react'
import { Alert, Button, StyleSheet, Text, View } from 'react-native'

import { BlueCredentialType, BlueIdentitiesList } from '@blueid/access-proto'
import { BlueIDAccess } from '@blueid/access-react-native'


function NfcItem(): React.JSX.Element {

    const tryOpenLock = useCallback(async () => {
        try {
            const identitiesList: BlueIdentitiesList  = await BlueIDAccess.runCommand('getIdentities')

            const { identities } = identitiesList

            const nfcIdentity = identities.find(ident =>
                [
                    BlueCredentialType.NfcWriter,
                ].includes(ident.role),
            )

            if (!nfcIdentity) {
                Alert.alert('Failed', 'No NFC identity found', [{ text: 'OK' }])
                return
            }


            const regularIdentity = identities.find(ident =>
                [
                    BlueCredentialType.Regular,
                ].includes(ident.role),
            )

            if (!regularIdentity) {
                Alert.alert('Failed', 'No regular identity found', [{ text: 'OK' }])
                return
            }


            // await BlueIDAccess.runCommand(
            //     'writeOssSoCredential', nfcIdentity.identityId, regularIdentity.identityId
            // )
            const re = await BlueIDAccess.runCommand(
                'readTransponderId'
            )

            Alert.alert('Success', 'Transponder Id', [{ text: re }])

        } catch (e: any) {
            Alert.alert('Failed', e.message, [{ text: 'OK' }])
        }
    }, [])


    return (
        <View style={styles.root}>
            <Text style={styles.title}>Write NFC Transponder</Text>

            <Button title="Write" onPress={tryOpenLock} />

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

export default NfcItem
