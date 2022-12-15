import { Text, Button, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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

const Welcome = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.textStyle}>Welcome Screen</Text>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ padding: 5 }}>
                    <Button
                        title="Go to Sign-Up"
                        onPress={() => navigation.navigate('Sign-Up')}
                        color="#6495ed"
                    />
                </View>
                <View style={{ padding: 5 }}>
                    <Button
                        title="Go to Sign-In"
                        onPress={() => navigation.navigate('Sign-In')}
                        color="#6495ed"
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

export default Welcome;