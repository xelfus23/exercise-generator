import { StyleSheet, View, SafeAreaView, Text, TouchableOpacity, ScrollView, TextInput, Modal, Image } from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { MyColors } from "@/constants/myColors";
import { widthPercentageToDP as WP, heightPercentageToDP as HP, } from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, } = require("@google/generative-ai");
import ChatComponent from "./apiService";
import { useAuth } from "@/components/auth/authProvider";
import ScrollableInput from '@/components/customs/scrollableInput'
import CustomHeaderB from "../settings/customDrawerLabel";

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------

const ChatNavigator = () => {
    return <MainChat />;
};

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------

const MainChat = () => {
    const { user } = useAuth();
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.mainContainer}>
            <CustomHeaderB navigation={() => navigation.openDrawer()} text={user.chatBotName || 'AI Chat'} chat={true} />
            <ChatComponent />
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: MyColors(1).black,
        width: WP(100),
        flex: 1,
    },
    container: {
        flexGrow: 1,
    },
    chatContainer: {
        height: "auto",
        width: WP(100),
    },
    chatItemContainer: {
        paddingVertical: HP(2),
        flexDirection: "row",
        paddingHorizontal: 20,
    },
    profileImage: {
        height: HP(6),
        aspectRatio: 1,
        borderRadius: HP(6),
        marginRight: 10,
    },
    chatTextContainer: {
        justifyContent: "space-between",
        flexDirection: "row",
        width: WP(70),
        alignItems: "center",
    },
    name: {
        color: MyColors(1).white,
        fontSize: 16,
        marginLeft: 5,
    },
    lastMessage: {
        color: MyColors(1).white,
        fontSize: 14,
        opacity: 0.5,
        width: WP(50),
    },
    lastMessageTime: {
        color: MyColors(1).white,
        opacity: 0.5,
    },
    separator: {
        backgroundColor: MyColors(1).gray,
        width: "100%",
        height: 1,
    },
});

export default ChatNavigator;
