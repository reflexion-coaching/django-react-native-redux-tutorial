import React from 'react';
import { Text, View, Button, StyleSheet, FlatList, TextInput } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { useAddNewBookMutation } from '../api/bookSlice'

const styles = StyleSheet.create({
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
    },
});

function CreateForm() {

    const [addNewBook, { isLoading }] = useAddNewBookMutation()

    const onSaveBookClicked = async (values) => {

        const canSave = [values.author, values.book].every(Boolean) && !isLoading

        if (canSave) {
            try {
                await addNewBook({ 'title': values.book, 'author': values.author }).unwrap()
            } catch (err) {
                <Text style={{ fontSize: 16, color: '#FF0D10' }}>{err}</Text>

            }
        }
    }

    return (
        <Formik
            initialValues={{
                book: "Le Machine learning avec Python !",
                author: 1
            }}
            onSubmit={values => onSaveBookClicked(values)}
            validationSchema={Yup.object({
                book: Yup
                    .string()
                    .min(3, 'Must be 3 characters or less')
                    .required('Required'),
                author: Yup
                    .number("Must be more than 0")
                    .integer("Must be more than 0")
                    .required('Required'),
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
                    <Text style={styles.inputLablel}>Book :</Text>
                    <TextInput
                        name="book"
                        placeholder='Add a new book'
                        onChangeText={handleChange('book')}
                        onBlur={handleBlur('book')}
                        style={styles.inputStyle}
                    />
                    {touched.book && errors.book &&
                        <Text style={{ fontSize: 16, color: '#FF0D10' }}>{errors.book}</Text>
                    }
                    <Text style={styles.inputLablel}>Author :</Text>
                    <TextInput
                        name="author"
                        placeholder='1'
                        onChangeText={handleChange('author')}
                        onBlur={handleBlur('author')}
                        value={values.author}
                        style={styles.inputStyle}
                    />
                    {touched.author && errors.author &&
                        <Text style={{ fontSize: 16, color: '#FF0D10' }}>{errors.author}</Text>
                    }
                    <Button onPress={handleSubmit} title="Add Book" color="#6495ed" />
                </View>
            )}
        </Formik>
    );
}

export default CreateForm;