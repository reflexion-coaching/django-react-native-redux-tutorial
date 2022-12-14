import React from 'react';
import { Text, View, Button, StyleSheet, TextInput } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

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


export const SignIn = ({ navigation }) => {

    const SignInForm = props => (
        <Formik
            initialValues={{
                username: "Pierre",
                email: "pierre@email.com",
                password: "password"
            }}
            onSubmit={() => navigation.navigate('Home')}
            validationSchema={Yup.object({
                username: Yup
                    .string()
                    .min(3, 'Must be 3 characters or less')
                    .required('Required'),
                email: Yup
                    .string()
                    .email("email is not valid")
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
                    <Text style={styles.inputLablel}>Email :</Text>
                    <TextInput
                        name="email"
                        placeholder='email'
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        value={values.email}
                        style={styles.inputStyle}
                    />
                    {touched.email && errors.email &&
                        <Text style={{ fontSize: 16, color: '#FF0D10' }}>{errors.email}</Text>
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
                    <Button onPress={handleSubmit} title="Sign In" color="#6495ed"/>
                    </View>
                </View>
            )}
        </Formik>
    );

    return (
        <View style={styles.container}>
            <SignInForm />
        </View>
    )
}