import React, { useState } from 'react';
import { View, Button, Modal, StyleSheet } from 'react-native';

import UpdateForm from '../form/UpdateForm'

const styles = StyleSheet.create({
    containerModal: {
        alignItems: 'center',
        justifyContent: 'center',
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
        padding: 10,
        elevation: 10,
        backgroundColor: "#6495ed",
        borderRadius: 2
    },
    buttonClose: {
        backgroundColor: "#6495ed",
        marginTop: 22,
    },

});

const UpdateModal = ({ props }) => {

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
                        <UpdateForm props={props} />
                        <View style={{marginTop:10}}>
                            <Button
                                onPress={() => setModalVisible(!modalVisible)}
                                title='Close'
                                color="#6495ed"
                            />
                        </View>
                    </View>
                </View>
            </Modal>
            <Button
                onPress={() => setModalVisible(true)}
                title='Update book'
                color="#6495ed"
            />
        </View>
    );
};

export default UpdateModal;