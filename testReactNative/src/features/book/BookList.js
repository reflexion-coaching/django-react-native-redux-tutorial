import React from 'react';
import { Text, View, Button, StyleSheet, FlatList, TextInput } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { useGetListOfBooksQuery, useDeleteBookMutation, useUpdateBookMutation } from '../api/bookSlice'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 22,
        marginTop: 30,
    },
    item: {
        padding: 10,
        marginTop: 30,
        fontSize: 18,
        height: 44,
        textAlign: 'center',
    },
    inputStyle: {
        borderWidth: 1,
        borderColor: '#4e4e4e',
        padding: 12,
        marginBottom: 6,
        marginTop: 12,
        textAlign: 'center',
        fontSize: 18,
    },
});

export const BookList = () => {

    const { data, isLoading, isSuccess, isError, error } = useGetListOfBooksQuery()
    const [deleteBook, response] = useDeleteBookMutation()
    const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation()

    const onUpdateBookClicked = async (values, initialValues) => {

        const canSave = [initialValues.props.author, values.book, initialValues.props.id].every(Boolean)

        if (canSave) {
            try {
                await updateBook({ id: initialValues.props.id, title: values.book, author: initialValues.props.author }).unwrap()
            } catch (err) {
                console.error('Failed to save the post: ', err)
            }
        }
    }

    const UpdateForm = props => (
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
                    />
                    {touched.book && errors.book &&
                        <Text style={{ fontSize: 16, color: '#FF0D10' }}>{errors.book}</Text>
                    }
                    <Button onPress={(values) => handleSubmit(values, "test")} title="Modify Book" color="#6495ed" />
                </View>
            )}
        </Formik>
    );


    let content

    if (isLoading) {
        content = <Text> Loading ... </Text>
    } else if (isSuccess) {
        content = <FlatList data={data} renderItem={({ item }) => <View>
            <Text style={styles.item}>Titre {item.id} : {item.title}</Text>
            <Button onPress={() => deleteBook(item.id)} title="Delete Book" color="#6495ed"/>
            <UpdateForm props={item}/>
        </View>} />
    } else if (isError) {
        content = <Text> Query doesn't work !</Text>
    }

    return (
        <View style={styles.container}>
            {content}
        </View>
    )

}