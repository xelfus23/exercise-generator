// ChatComponent.js
import React, { useState, useEffect, useRef } from "react";
import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    RefreshControl,
    KeyboardAvoidingView,
} from "react-native";
import { useAuth } from "@/components/auth/authProvider";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MyColors } from "@/constants/myColors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import ChatBubble from "./chatBubble";
import getInstructions from "./instructions";
import {
    widthPercentageToDP as WP,
    heightPercentageToDP as HP,
} from "react-native-responsive-screen";
import {
    doc,
    setDoc,
    getDoc,
    collection,
    getDocs,
    arrayUnion,
} from "firebase/firestore";
import { chatRoomRef, db } from "@/components/firebase/config";
import { getAuth } from "firebase/auth";
import userData from "@/components/auth/userData";
import AntDesign from "@expo/vector-icons/AntDesign";

const ChatComponent = ({ user, updateUserData }) => {
    const data = userData();
    const [chat, setChat] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);
    const flatListRef = useRef(null);
    const [hasMore, setHasMore] = useState(true);
    const [fetchingMore, setFetchingMore] = useState(false);
    const [lastFetchedDoc, setLastFetchedDoc] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const instructions = getInstructions(data);
    const GEMINI_API_KEY = "AIzaSyCiD1R5_8nv5JxFdfhSmvePA5otCtMglOw";
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const [isAtBottom, setIsAtBottom] = useState(true); // Track if FlatList is at the bottom
    const debounceScroll = useRef(null);
    const chatHistoryRef = useRef([]);
    const abortController = useRef(null);

    const handleScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const contentHeight = event.nativeEvent.contentSize.height;
        const viewHeight = event.nativeEvent.layoutMeasurement.height;
        const atBottom = offsetY + viewHeight >= contentHeight - 10; // Threshold of 10 pixels

        if (debounceScroll.current) clearTimeout(debounceScroll.current);
        debounceScroll.current = setTimeout(() => {
            setIsAtBottom(atBottom);
        }, 100);
    };

    useEffect(() => {
        if (user) {
            loadInitialChat();
        }
    }, [user]);

    useEffect(() => {
        chatHistoryRef.current = chat;
    }, [chat]);

    useEffect(() => {
        return () => {
            if (abortController.current) {
                abortController.current.abort();
            }
            if (debounceScroll.current) {
                clearTimeout(debounceScroll.current);
            }
        };
    }, []);

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: instructions,
    });

    const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 2000,
        responseMimeType: "text/plain",
    };

    const initialChatLength = 10;

    const loadInitialChat = async () => {
        console.log("Re-Initializing");
        try {
            const currentUser = getAuth().currentUser;
            if (!currentUser) return;

            const chatRef = doc(db, "users", currentUser.uid);
            const chatsCollection = collection(chatRef, "chats");
            const chatDocSnap = await getDocs(chatsCollection);

            if (!chatDocSnap.empty) {
                const chatData = chatDocSnap.docs[0].data().chatHistory || [];
                chatHistoryRef.current = chatData;
                const lastChats = chatData.slice(-initialChatLength);
                setChat(lastChats);
                setLastFetchedDoc(chatData.length - lastChats.length);
                setHasMore(chatData.length > lastChats.length);
                setTimeout(() => {
                    flatListRef.current.scrollToEnd({ animated: false });
                }, 100);
            } else {
                console.log(
                    "Chat document does not exist. Adding initial greeting."
                );
            }
        } catch (error) {
            console.error("Error loading chat history:", error);
        }
    };

    const loadMoreMessages = async () => {
        if (fetchingMore || !hasMore) return;

        setFetchingMore(true);

        console.log("Refreshing");
        try {
            if (chatHistoryRef.current.length === 0) {
                console.log("No chat history available.");
                return;
            }

            const start = Math.max(0, lastFetchedDoc - initialChatLength);

            const moreMessages = chatHistoryRef.current.slice(
                start,
                lastFetchedDoc
            );

            if (moreMessages.length > 0) {
                setChat((prevChat) => [...moreMessages, ...prevChat]);
                setLastFetchedDoc(start);

                // Stop loading if we’ve reached the start of chat history
                if (start === 0) {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error loading more chat messages:", error);
        } finally {
            setFetchingMore(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadMoreMessages().then(() => setRefreshing(false));
    };

    const getChatResponse = async (userMessage, history) => {
        const chatSession = model.startChat({
            generationConfig,
            history: history,
        });

        try {
            const result = await chatSession.sendMessage(userMessage);

            return result.response.text();
        } catch (error) {
            console.error("Error fetching data from Generative AI API:", error);
            throw error;
        }
    };

    const getTOday = (date) => {
        return {
            date: date.getDate(),
            month: date.toLocaleString("default", { month: "short" }),
            year: date.getFullYear(),
            time: date.toLocaleTimeString("default", {
                hour: "numeric",
                minute: "numeric",
            }),
            weekday: date.toLocaleString("default", { weekday: "short" }),
        };
    };

    const handleUserInput = async () => {
        if (userInput.trim() === "") return;

        let newMessage = {
            role: "user",
            parts: [{ text: userInput }], // No timestamp here
            timestamp: getTOday(new Date()),
        };

        setChat((prevChat) => [...prevChat, newMessage]);
        setLoading(true);

        setTimeout(() => {
            flatListRef.current.scrollToEnd({ animated: true });
        }, 300);

        const input = userInput;
        setUserInput("");

        try {
            const history = chat.map((v) => ({
                parts: [
                    {
                        text: `${v.parts[0]} User Response: ${
                            v.flag || "None"
                        }`,
                    },
                ],
                role: v.role,
            }));
            console.log("LOGGING HISTORY : ", JSON.stringify(history));

            const currentUser = getAuth().currentUser;
            const chatRef = doc(db, "users", currentUser.uid);
            const chatMessagesRef = collection(chatRef, "chats"); // Create a subcollection

            const modelResponse = await getChatResponse(input, history);
            const cleanedModelResponse = modelResponse.replace(/\n+$/, ""); // Remove trailing newline from the model response

            const modelMessage = {
                role: "model",
                parts: [{ text: cleanedModelResponse }],
                timestamp: getTOday(new Date()),
            };

            setChat((prevChat) => [...prevChat, modelMessage]);

            setTimeout(() => {
                flatListRef.current.scrollToEnd({ animated: true });
            }, 200);

            const test = chat.map((v, i) => ({
                parts:
                    JSON.stringify(v.parts) + v.role === "model" &&
                    ` User Response: ${v.flag}`,
                role: v.role,
            }));

            await setDoc(
                doc(chatMessagesRef, "chats"),
                {
                    chatHistory: arrayUnion(newMessage, modelMessage),
                },
                { merge: true }
            );
        } catch (error) {
            console.error("Error fetching data from API:", error);
            setError("Error fetching data from API");
        } finally {
            setTimeout(() => {
                setLoading(false);
                if (flatListRef.current) {
                    setTimeout(() => {
                        flatListRef.current.scrollToEnd({ animated: true });
                    }, 200);
                }
            }, 1000);
        }
    };

    const [scrolling, setScrolling] = useState(false);

    const renderChatItem = ({ item, index }) => (
        <ChatBubble
            text={item.parts[0].text}
            role={item.role}
            timestamp={item.timestamp}
            flag={item.flag}
            index={index}
            chatLength={chat.length}
            typing={loading}
            flatListRef={flatListRef}
            isScrolling={scrolling}
            setIsScrolling={setScrolling}
        />
    );

    return (
        <View style={styles.mainContainer}>
            <KeyboardAvoidingView style={{ flex: 1 }}>
                <FlatList
                    ref={flatListRef}
                    onScroll={handleScroll} // Attach the scroll handler here
                    scrollEventThrottle={16} // Throttle for smooth performance
                    data={chat}
                    renderItem={renderChatItem}
                    keyExtractor={(item, index) => index.toString()}
                    style={styles.chatContainer}
                    contentContainerStyle={{
                        paddingTop: HP(1.5),
                        paddingHorizontal: HP(1.5),
                    }}
                    showsVerticalScrollIndicator={true}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                />
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Type a message..."
                        placeholderTextColor={MyColors(0.8).white}
                        style={styles.input}
                        onChangeText={setUserInput}
                        value={userInput}
                        onPress={() =>
                            setTimeout(() => {
                                flatListRef.current?.scrollToEnd({
                                    animated: true,
                                });
                            }, 300)
                        }
                    />
                    <TouchableOpacity
                        style={styles.sendButton}
                        onPress={handleUserInput}
                    >
                        <MaterialIcons
                            name="send"
                            size={30}
                            color={MyColors(1).green}
                        />
                    </TouchableOpacity>
                </View>
                {!isAtBottom && (
                    <TouchableOpacity
                        onPress={() =>
                            flatListRef?.current?.scrollToEnd({
                                animated: true,
                            })
                        }
                        style={{
                            position: "absolute",
                            bottom: HP(10),
                            backgroundColor: MyColors(1).gray,
                            borderRadius: 25,
                            height: HP(5),
                            aspectRatio: 1,
                            alignSelf: "center",
                            alignItems: "center",
                            justifyContent: "center",
                            paddingTop: HP(0.5),
                            borderWidth: 1,
                            borderColor: MyColors(0.5).white,
                        }}
                    >
                        <AntDesign
                            name="down"
                            size={HP(3)}
                            color={MyColors(0.5).white}
                        />
                    </TouchableOpacity>
                )}
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: MyColors(1).black,
        paddingHorizontal: WP(1),
    },
    chatContainer: {
        flex: 1,
    },
    inputContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "center",
        paddingHorizontal: WP(2),
        paddingVertical: WP(2),
        gap: WP(2),
        backgroundColor: MyColors(0.5).gray,
        zIndex: 2,
        width: WP(100),
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: MyColors(1).white,
        backgroundColor: MyColors(0.2).white,
        paddingHorizontal: 15,
        borderRadius: 25,
        height: HP(6),
    },
    sendButton: {
        backgroundColor: MyColors(1).gray,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
    },
});

export default ChatComponent;
