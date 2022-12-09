import React from 'react';
import { Text, View, Image, StyleSheet, FlatList } from 'react-native';
import { useGetListOfBooksQuery } from '../api/bookSlice'


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 22,
        marginTop: 30,
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
        textAlign: 'center',
    },
});

export const BookList = () => {

    const { data, isLoading, isSuccess, isError, error } = useGetListOfBooksQuery()

    let content

    if (isLoading) {
        content = <Text> Loading ... </Text>
    } else if (isSuccess) {
        content = <FlatList data={data} renderItem={({ item }) => <Text style={styles.item}>Titre {item.id} : {item.title}</Text>} />
    } else if (isError) {
        content = <Text> Query doesn't work !</Text>
    }

    return (
        <View style={styles.container}>
            {content}
        </View>
    )

}