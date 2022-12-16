import React from 'react';
import { Text, View, Button, StyleSheet, FlatList, TextInput } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { useUpdateBookMutation } from '../api/bookSlice'

const styles = StyleSheet.create({
    inputStyle: {
        borderWidth: 1,
        borderColor: '#4e4e4e',
        padding: 12,
        marginBottom: 12,
        marginTop: 12,
        textAlign: 'center',
        fontSize: 18,
    },
});

function UpdateForm( {props} ) {

    const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation()

    const onUpdateBookClicked = async (modifiedValues, props) => {

        const canSave = [props.author, modifiedValues.book, props.id].every(Boolean)

        if (canSave) {
            try {
                await updateBook({ id: props.id, title: modifiedValues.book, author: props.author }).unwrap()
            } catch (err) {
                console.error('Failed to save the post: ', err)
            }
        }
    }

    return (
    <Formik
        initialValues={{
            book: props.title,
        }}
        onSubmit={values => onUpdateBookClicked(values, props)}
        validationSchema={Yup.object({
            book: Yup
                .string()
                .min(3, 'Must be 3 characters or less')
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
                <TextInput
                    name="book"
                    placeholder='Modify book title'
                    onChangeText={handleChange('book')}
                    onBlur={handleBlur('book')}
                    style={styles.inputStyle}
                    value={values.book}
                />
                {touched.book && errors.book &&
                    <Text style={{ fontSize: 16, color: '#FF0D10' }}>{errors.book}</Text>
                }
                <Button onPress={handleSubmit} title="Modify Book" color="#6495ed" />
            </View>
        )}
    </Formik>
    )
}

export default UpdateForm;