import { Text, SafeAreaView, StyleSheet } from 'react-native'
import React, { Component } from 'react'


const Home = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.mainText}>Home yoyo</Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'space-between'},
    mainText: { fontSize: 30, textAlign: 'center' }
})

export default Home