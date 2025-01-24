import React, { useState, useRef, useEffect } from "react";
import {
    StyleSheet,
    View,
    Text,
    Animated,
    Pressable,
    TouchableOpacity,
} from "react-native";
import { MyColors } from "@/constants/myColors";
import {
    widthPercentageToDP as WP,
    heightPercentageToDP as HP,
} from "react-native-responsive-screen";
import formatText from "./formatText";
import {
    Menu,
    MenuOption,
    MenuOptions,
    MenuTrigger,
} from "react-native-popup-menu";
import Entypo from "@expo/vector-icons/Entypo";
import LottieView from "lottie-react-native";
import { times } from "lodash";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
    arrayUnion,
    collection,
    doc,
    getDocs,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "@/components/firebase/config";

const ChatBubble = ({
    role,
    text,
    index,
    chatLength,
    typing,
    flatListRef,
    isScrolling,
    setIsScrolling,
    flag,
    timestamp,
}) => {
    const pressIn = () => {};

    const formattedText = formatText(text);

    const [itemFlag, setItemFlag] = useState(flag);
    const isToday = (timestamp) => {
        const today = new Date();
        return (
            timestamp.date === today.getDate() &&
            timestamp.month ===
                today.toLocaleString("default", { month: "short" }) &&
            timestamp.year === today.getFullYear()
        );
    };

    const flagItem = async (value) => {
        try {
            const currentUser = getAuth().currentUser;
            const chatRef = doc(db, "users", currentUser.uid);
            const chatsCollection = collection(chatRef, "chats"); // Access the subcollection
            const chatDocSnap = await getDocs(chatsCollection);

            if (!chatDocSnap.empty) {
                // Retrieve chat data and get the last chat message
                const chatData = chatDocSnap.docs[0].data().chatHistory || [];
                const lastChatIndex = chatData.length - 1;

                if (lastChatIndex >= 0) {
                    // Update the last item by adding a "flag" property
                    chatData[lastChatIndex] = {
                        ...chatData[lastChatIndex],
                        flag: value,
                    };

                    // Save the updated chatHistory back to Firestore
                    await setDoc(
                        chatDocSnap.docs[0].ref,
                        { chatHistory: chatData },
                        { merge: true }
                    );

                    setItemFlag(value);
                } else {
                    console.log("No chat messages to flag.");
                }
            } else {
                console.log(
                    "Chat document does not exist. Adding initial greeting."
                );
            }
        } catch (e) {
            console.log("Error", e);
        }
    };

    return (
        <View
            style={{
                marginBottom: HP(2),
                gap: HP(1),
                maxWidth: WP(80),
                alignSelf: role === "model" ? "flex-start" : "flex-end",
            }}
        >
            <Pressable onPressIn={pressIn} style={[styles(role).chatItem]}>
                {typing & (role !== "user") & (index === chatLength - 1) ? (
                    <Text style={styles().text}>
                        <View
                            style={{
                                width: WP(20),
                                justifyContent: "center",
                            }}
                        >
                            <LottieView
                                source={require("@/assets/json/typing.json")}
                                loop
                                autoPlay
                                style={{ height: HP(3) }}
                            />
                        </View>
                    </Text>
                ) : (
                    <RenderText parts={formattedText} role={role} />
                )}

                <View
                    style={{
                        flexDirection: "row",
                        gap: HP(2),
                        width: "100%",
                        alignSelf: role === "user" ? "flex-start" : "flex-end",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: role === "model" ? HP(1) : 0,
                    }}
                >
                    {!typing || role === "user" ? (
                        <Text
                            style={{
                                color: MyColors(0.5).white,
                                fontSize: HP(1.2),
                            }}
                        >
                            {isToday(timestamp)
                                ? "Today"
                                : `${timestamp.month} ${timestamp.date}`}{" "}
                            {timestamp.time}
                        </Text>
                    ) : null}
                </View>
                <View
                    style={[
                        styles().tail,
                        role === "user"
                            ? styles().userTail
                            : styles().modelTail,
                    ]}
                />
            </Pressable>

            {role === "model" && index === chatLength - 1 && !typing && (
                <View
                    style={{
                        flexDirection: "row",
                        gap: HP(2),
                        alignItems: "center",
                        alignSelf: role === "user" ? "flex-start" : "flex-end",
                        justifyContent: "center",
                    }}
                >
                    <TouchableOpacity onPress={() => flagItem("Good")}>
                        <MaterialCommunityIcons
                            name="thumb-up-outline"
                            size={HP(1.5)}
                            color={
                                itemFlag === "Good"
                                    ? MyColors(1).green
                                    : MyColors(0.8).white
                            }
                            style={{
                                borderWidth: 1,
                                borderColor:
                                    itemFlag === "Good"
                                        ? MyColors(1).green
                                        : MyColors(0.8).white,
                                padding: HP(0.5),
                                borderRadius: WP(2),
                            }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => flagItem("Bad")}>
                        <MaterialCommunityIcons
                            name="thumb-down-outline"
                            size={HP(1.5)}
                            color={
                                itemFlag === "Bad"
                                    ? MyColors(1).red
                                    : MyColors(0.8).white
                            }
                            style={{
                                borderWidth: 1,
                                borderColor:
                                    itemFlag === "Bad"
                                        ? MyColors(1).red
                                        : MyColors(0.8).white,
                                padding: HP(0.5),
                                borderRadius: WP(2),
                            }}
                        />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const RenderText = ({ parts, role }) => {
    return (
        <Text style={styles(role).textContainer}>
            {parts.map((part, index) => {
                const text = typeof part === "string" ? part : part.text || "";

                return (
                    <Text
                        key={index}
                        style={[
                            styles(role).text,
                            part.bold
                                ? {
                                      fontWeight: "bold",
                                      color: MyColors(1).white,
                                  }
                                : {},
                            part.bullet ? { marginLeft: WP(5) } : {},
                        ]}
                    >
                        {text.includes("\n\n\n\n\n")
                            ? text.replace(
                                  "\n\n\n\n\n",
                                  "———————————————————————————————"
                              )
                            : text.includes("\n\n\n")
                            ? text.replace(/\n\n\n/gm, "\n\n")
                            : text.includes("\n\n")
                            ? text.replace(/\n\n/gm, "\n\n")
                            : text.replace(/\n/, "\n\n")}
                    </Text>
                );
            })}
        </Text>
    );
};

const styles = (role, part) =>
    StyleSheet.create({
        chatItem: {
            padding: HP(0.2),
            paddingHorizontal: HP(1),
            maxWidth: WP(80),
            justifyContent: "center",
            textAlign: "left",
            backgroundColor: role === "user" ? "#4b4b4b" : "#313131",
            alignSelf: role === "user" ? "flex-end" : "flex-start",
            borderTopRightRadius: role === "user" ? WP(0) : WP(4),
            borderTopLeftRadius: role === "model" ? WP(0) : WP(4),
            borderRadius: WP(4),
            borderWidth: 3,
            borderColor: role === "user" ? "#4b4b4b" : "#313131",
            elevation: 7,
        },
        text: {
            color: MyColors(0.8).white,
            fontSize: HP(1.7),
        },
        tail: {
            position: "absolute",
            width: 0,
            height: 0,
            borderBottomWidth: 5,
            borderTopColor: "transparent",
            borderBottomWidth: 10,
            borderBottomColor: "transparent",
            top: -3,
        },
        userTail: {
            right: -10, // Position it outside the bubble on the right
            borderLeftWidth: 10,
            borderLeftColor: "#4b4b4b",
        },
        modelTail: {
            left: -10, // Position it outside the bubble on the left
            borderRightWidth: 10,
            borderRightColor: "#313131",
        },
    });

export default ChatBubble;
