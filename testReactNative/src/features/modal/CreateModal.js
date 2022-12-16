import React, { useState } from 'react';
import { View, Modal, StyleSheet, Pressable, Text } from 'react-native';

import CreateForm from '../form/CreateForm';

const styles = StyleSheet.create({
    containerModal: {
        flexDirection: 'row',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        right: 15,
        bottom: 15,
    },
    modalView: {
        margin: 20,
        alignItems: 'center',
        backgroundColor: "white",
        borderRadius: 10,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 10,
        backgroundColor: "#DE271F",
    },
    buttonClose: {
        backgroundColor: "#6495ed",
        marginTop: 22,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    }
});

const CreateModal = () => {
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <View style={styles.containerModal}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => { setModalVisible(!modalVisible); }}>
                <View>
                    <View style={styles.modalView}>
                        <CreateForm />
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <Text style={styles.textStyle}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <Pressable
                style={styles.button}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.textStyle}>Add book</Text>
            </Pressable>
        </View>
    );
};

export default CreateModal;