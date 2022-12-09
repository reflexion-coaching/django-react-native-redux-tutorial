import React from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import { useGetListOfBooksQuery } from '../api/bookSlice'

export const BookList = () => {

    const { data, isLoading, isSuccess, isError, error } = useGetListOfBooksQuery()
    //const { data, isLoading, isSuccess, isError, error } = useGetListOfBooksQuery('bulbasaur')

    let content

    if (isLoading) {
        content = <Text> Loading </Text>
    } else if (isSuccess) {
        content = <Text> Query works ! </Text>
    } else if (isError) {
        content = <Text> Query doesn't work !</Text>
    }

    return (
        <View>
            { content }
        </View>
    )

}