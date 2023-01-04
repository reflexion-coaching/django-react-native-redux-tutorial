import { Text, Button, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLogOutMutation } from '../api/bookSlice'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    textStyle: {
        fontSize: 36,
        fontWeight: "bold",
        marginBottom: 10
    }
});

const Welcome = ({ navigation }) => {

    const [logOut, { isLoading }] = useLogOutMutation() // ajouter error

    function loggingOut() {
        logOut()
        .unwrap()
        .then(() => {
            alert('Log Out Okay :)')
        })
        .catch((error) => {
            alert('Log Out Failed :(', error)
        })
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.textStyle}>Welcome Screen</Text>
            <View >
                <View style={{ padding: 5 }}>
                    <Button
                        title="Go to Sign-In"
                        onPress={() => navigation.navigate('Sign-In')}
                        color="#6495ed"
                    />
                </View>
                <View style={{ padding: 5 }}>
                    <Button
                        title="Go to Sign-Up"
                        onPress={() => navigation.navigate('Sign-Up')}
                        color="#6495ed"
                    />
                </View>
                <View style={{ padding: 5 }}>
                    <Button
                        title="Log-Out"
                        onPress={() => loggingOut()}
                        color="#6495ed"
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

export default Welcome;