import { Text, Button, StyleSheet } from 'react-native';
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

const HomeScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.textStyle}>Home Screen</Text>
            <Button
                title="Go to Book List"
                onPress={() => navigation.navigate('Books')}
                color="#6495ed"
            />
        </SafeAreaView>
    );
}

export default HomeScreen;