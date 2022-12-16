import React, { useState } from 'react';
import { Text, View, Button, StyleSheet, FlatList } from 'react-native';

import { useGetListOfBooksQuery, useDeleteBookMutation } from '../api/bookSlice'
import UpdateModal from '../modal/UpdateModal';

const styles = StyleSheet.create({
    item: {
        padding: 10,
        marginTop: 10,
        fontSize: 18,
        height: 44,
        textAlign: 'center',
    },
    listItem: {
        margin: 10,
        padding: 10,
        backgroundColor: "#FFF",
        width: "80%",
        flex: 1,
        alignSelf: "center",
        flexDirection: "column",
        borderRadius: 5
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

function RenderItemList({ item }) {

    const [deleteBook, response] = useDeleteBookMutation()

    return (
        <View style={styles.listItem}>
            <Text style={styles.item}>Titre {item.id} : {item.title}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly'}}>
                <Button onPress={() => deleteBook(item.id)} title="Delete Book" color="#6495ed" />
                <UpdateModal props={item} />
            </View>
        </View>
    )
}

function GetBookList() {

    const { data, isLoading, isSuccess, isError, error } = useGetListOfBooksQuery()

    let content

    if (isLoading) {
        content = <Text> Loading ... </Text>
    } else if (isSuccess) {
        content = <FlatList data={data} renderItem={({ item }) => <RenderItemList item={item} />} />
    } else if (isError) {
        content = <Text> Query doesn't work !</Text>
    }

    return (
        <View >
            {content}
        </View>
    )
}

const BookList = () => {
    return (
        <View >
            <GetBookList />
        </View>
    )
}

export default BookList;