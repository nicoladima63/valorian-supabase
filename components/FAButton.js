import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const FAButton = (props) => {
    return (
        <Pressable style={[styles.container, !props.title && styles.iconOnlyContainer]} onPress={props.onPress}>
            {props.title && <Text style={styles.title}>{props.title}</Text>}
            {props.icon && <FontAwesome5 name={props.icon} size={24} color="#fff" solid />}
        </Pressable>
    );
};

export default FAButton;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        position: "absolute",
        bottom: 20,
        right: 10,
        backgroundColor: "#26653A",
        paddingHorizontal: 20,
        paddingVertical: 18,
        zIndex: 1,
    },
    iconOnlyContainer: {
        width: 52,
        height: 52,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 0,
        paddingVertical: 0,
    },
    title: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        marginRight: 10,
    },
    icon: {
        fontWeight: 'bold', // Non tutte le icone supportano questa proprietà
    },
});
