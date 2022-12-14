import { Text, View, Button, StyleSheet, TextInput } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useLogInMutation } from '../api/bookSlice'
import { useDispatch } from 'react-redux';
import { signedIn } from '../api/authentificationSlice'


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        marginTop: 20,
    },
    inputStyle: {
        borderWidth: 1,
        borderColor: '#4e4e4e',
        padding: 12,
        marginBottom: 12,
        textAlign: 'center',
        fontSize: 18,
    },
    inputLablel: {
        paddingTop: 10,
        fontSize: 18,
        height: 44,
        fontWeight: "bold",
    }
});


function SignUp() {

    const dispatch = useDispatch();
    const [logIn, { isLoading }] = useLogInMutation() // ajouter error

    function save(values) {
        logIn({'username': values.username, 'password': values.password})
        .unwrap()
        .then(() => {
            console.log('fulfilled')
            dispatch(signedIn(true))
        })
        .catch((error) => {
            console.log('oh nooooo !!! rejected', error.status, error.data, error.message)})
    }

    const SignUpForm = props => (
        <Formik
            initialValues={{
                username: "Pierre",
                email: "pierre@email.com",
                password: "password"
            }}
            onSubmit={values => save(values)}
            validationSchema={Yup.object({
                username: Yup
                    .string()
                    .min(3, 'Must be 3 characters or less')
                    .required('Required'),
                password: Yup
                    .string()
                    .min(3, 'Must be 3 characters or less')
                    .required('Required')
            })}
        >
            {({ handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                isValid, }) => (
                <View>
                    <Text style={styles.inputLablel}>Username :</Text>
                    <TextInput
                        name="username"
                        placeholder='username'
                        onChangeText={handleChange('username')}
                        onBlur={handleBlur('username')}
                        value={values.username}
                        style={styles.inputStyle}
                    />
                    {touched.username && errors.username &&
                        <Text style={{ fontSize: 16, color: '#FF0D10' }}>{errors.username}</Text>
                    }
                    <Text style={styles.inputLablel}>Password :</Text>
                    <TextInput
                        name="password"
                        placeholder='password'
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        value={values.password}
                        style={styles.inputStyle}
                    />
                    {touched.password && errors.password &&
                        <Text style={{ fontSize: 16, color: '#FF0D10' }}>{errors.password}</Text>
                    }
                    <View style={{ paddingTop: 20 }}>
                    <Button onPress={handleSubmit} title="Sign Up" color="#6495ed"/>
                    </View>
                </View>
            )}
        </Formik>
    );

    return (
        <View style={styles.container}>
            <SignUpForm />
        </View>
    )
}

export default SignUp;