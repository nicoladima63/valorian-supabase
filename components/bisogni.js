import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Colors from '@/constants/Colors'
import ExternalLink from '../components/ExternalLink'

import axios from 'axios'

export default function bisogni() {
    // Prepare states
    const [nome, setNome] = useState('')
    const [importanza, setImportanza] = useState('')
    const [tolleranza, setTolleranza] = useState('')
    const [bisogni, setBisogni] = useState([])
    const [loading, setLoading] = useState(true)

    // Fetch all bisogni on initial render
    useEffect(() => {
        fetchBisogni()
    }, [])

    // Fetch all bisogni
    const fetchBisogni = async () => {
        // Send GET request to 'bisogni/all' endpoint
        axios
            .get('http://localhost:4001/bisogni/all')
            .then(response => {
                // Update the bisogni state
                setBisogni(response.data)

                // Update loading state
                setLoading(false)
            })
            .catch(
                error => console.error(`There was an error retrieving the bisogno list: ${error}`)
            )
    }

    // Reset all input fields
    const handleInputsReset = () => {
        setNome('')
        setImportanza('')
        setTolleranza('')
    }

    // Create new bisogno
    const handlebisognoCreate = () => {
        // Send POST request to 'bisogni/create' endpoint
        axios
            .post('http://localhost:4001/bisogni/create', {
                nome: nome,
                importanza: importanza,
                tolleranza: tolleranza,
            })
            .then(res => {
                console.log(res.data)

                // Fetch all bisogni to refresh
                // the bisogni on the bisognihelf list
                fetchBisogni()
            })
            .catch(error => console.error(`There was an error creating the ${importanza} bisogno: ${error}`))
    }

    // Submit new bisogno
    const handlebisogniSubmit = () => {
        // Check if all fields are filled
        if (nome.length > 0 && importanza.length > 0 && tolleranza.length > 0) {
            // Create new bisogno
            handlebisognoCreate()

            console.info(`bisogno ${nome} di importanza ${importanza} e tolleranza {tolleranza} aggiunto.`)

            // Reset all input fields
            handleInputsReset()
        }
    }

    // Remove bisogno
    const handlebisognoRemove = (id) => {
        // Send PUT request to 'bisogni/delete' endpoint
        axios
            .put('http://localhost:4001/bisogni/delete', { id })
            .then(() => {
                console.log(`bisogno ${nome} rimosso.`)

                // Fetch all bisogni to refresh
                // the bisogni on the bisognihelf list
                fetchBisogni()
            })
            .catch(error => console.error(`There was an error removing the ${importanza} bisogno: ${error}`))
    }

    // Reset bisogno list (remove all bisogni)
    const handleListReset = () => {
        // Send PUT request to 'bisogni/reset' endpoint
        axios.put('http://localhost:4001/bisogni/reset')
            .then(() => {
                // Fetch all bisogni to refresh
                // the bisogni on the bisognihelf list
                fetchBisogni()
            })
            .catch(error => console.error(`There was an error resetting the bisogno list: ${error}`))
    }

    return (
        <View>
            <View style={styles.helpContainer}>
                <ExternalLink
                    style={styles.helpLink}
                    href="https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet">
                    <Text style={styles.helpLinkText} lightColor={Colors.light.tint}>
                        Tap here if your app doesn't automatically update after making changes
                    </Text>
                </ExternalLink>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    getStartedContainer: {
        alignItems: 'center',
        marginHorizontal: 50,
    },
    homeScreenFilename: {
        marginVertical: 7,
    },
    codeHighlightContainer: {
        borderRadius: 3,
        paddingHorizontal: 4,
    },
    getStartedText: {
        fontSize: 17,
        lineHeight: 24,
        textAlign: 'center',
    },
    helpContainer: {
        marginTop: 15,
        marginHorizontal: 20,
        alignItems: 'center',
    },
    helpLink: {
        paddingVertical: 15,
    },
    helpLinkText: {
        textAlign: 'center',
    },
});
