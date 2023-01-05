import { Text, Button, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLogOutMutation } from '../features/api/bookSlice';
import { useDispatch } from 'react-redux';
import { signedIn } from '../features/api/authentificationSlice'


const styles = StyleSheet.create({
    container: {
        flex: 1,
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

const HomeScreen = ({ navigation }) => {

    const dispatch = useDispatch();
    const [logOut, { isLoading }] = useLogOutMutation()

    function loggingOut() {
        logOut()
            .unwrap()
            .then(() => {
                dispatch(signedIn(false))
                alert('Log Out Okay :)')
            })
            .catch((error) => {
                alert('Log Out Failed :(', error)
            })
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.textStyle}>Home Screen</Text>
            <Button
                title="Go to Book List"
                onPress={() => navigation.navigate('Books')}
                color="#6495ed"
            />
            <View style={{ padding: 5 }}>
                <Button
                    title="Log-Out"
                    onPress={() => loggingOut()}
                    color="#6495ed"
                />
            </View>
        </SafeAreaView>
    );
}

export default HomeScreen;