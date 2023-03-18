import { StyleSheet, Text, SafeAreaView } from 'react-native'
import React from 'react'
import FooterList from '../components/footer/FooterList'

const Links = () => {
  return (
    <SafeAreaView style={styles.container}>
    <Text style={styles.mainText}>Links?</Text>
    <FooterList />
  </SafeAreaView>
  )
}

export default Links

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'space-between' },
    mainText: { fontSize: 30, textAlign: 'center'}
})