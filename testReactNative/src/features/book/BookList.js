import React from 'react';
import { Text, View, Button, StyleSheet, FlatList } from 'react-native';
import { useGetListOfBooksQuery, useDeleteBookMutation } from '../api/bookSlice'

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
});

export const BookList = () => {

    const { data, isLoading, isSuccess, isError, error } = useGetListOfBooksQuery()
    const [deleteBook, response] = useDeleteBookMutation()

    let content

    if (isLoading) {
        content = <Text> Loading ... </Text>
    } else if (isSuccess) {
        content = <FlatList data={data} renderItem={({ item }) => <View>
            <Text style={styles.item}>Titre {item.id} : {item.title}</Text>
            <Button onPress={() => deleteBook(item.id)} title="Delete Book" color="#6495ed"/>
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