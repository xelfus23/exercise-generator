import React, { useState } from "react";
import { Image } from "expo-image";
import { TouchableOpacity, View, Alert, StyleSheet, Text } from "react-native";
import { useAuth } from "@/components/auth/authProvider";
import {
    widthPercentageToDP as WP,
    heightPercentageToDP as HP,
} from "react-native-responsive-screen";
import { MyColors } from "@/constants/myColors";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { setDoc, doc } from "firebase/firestore";
import { db, storage } from "@/components/firebase/config";
import { MaterialIcons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { defaultIcon } from "@/constants/common";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as ImagePicker from "expo-image-picker";
import { getAuth } from "firebase/auth";
import Feather from "@expo/vector-icons/Feather";

const ProfilePic = () => {
    const { user, updateUserData } = useAuth();
    const [image, setImage] = useState(null);
    const [pressed, setPressed] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaType.Image, // Corrected line
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const uploadImage = async () => {
        const user = getAuth().currentUser;

        if (!image) return;

        try {
            const storageRef = ref(getStorage(), `profilePic/${user.uid}`);
            const response = await fetch(image);
            const blob = await response.blob();
            await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(storageRef);
            await setDoc(
                doc(db, "users", user.uid),
                {
                    ProfilePic: downloadURL,
                },
                { merge: true }
            );
            await updateUserData(user.uid);
            setImage(null);
            Alert.alert("Success", "Profile image uploaded successfully");
        } catch (error) {
            console.error("Upload image error:", error);
            Alert.alert(
                "Error",
                "Failed to upload image. Please check your internet connection and try again."
            );
        }
    };
    return (
        <View
            style={{
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
            }}
        >
            <View
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                >
                    <View
                        style={{
                            borderWidth: 5,
                            borderRadius: WP(70),
                            borderColor: MyColors(1).green,
                            width: WP(40),
                            aspectRatio: 1,
                            overflow: "hidden",
                        }}
                    >
                        <TouchableOpacity
                            onPress={pickImage}
                            onPressOut={() => setPressed(false)}
                            onPressIn={() => setPressed(true)}
                            style={{
                                justifyContent: "center",
                            }}
                        >
                            <Image
                                style={{
                                    aspectRatio: 1,
                                    borderRadius: "100%",
                                    alignItems: "center",
                                }}
                                source={image || { uri: user?.ProfilePic }}
                                placeholder={defaultIcon}
                                contentFit="cover"
                                transition={500}
                            />

                            <View
                                style={{
                                    backgroundColor: MyColors(0.5).white,
                                    position: "absolute",
                                    alignSelf: "center",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    bottom: 0,
                                    width: "100%",
                                }}
                            >
                                {pressed && (
                                    <MaterialIcons
                                        name="add-a-photo"
                                        size={WP(8)}
                                        color={MyColors(1).black}
                                    />
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {image && (
                <TouchableOpacity
                    onPress={uploadImage}
                    style={{
                        backgroundColor: MyColors(1).green,
                        padding: WP(2),
                        borderRadius: WP(5),
                        position: "absolute",
                        left: WP(28),
                    }}
                >
                    <AntDesign
                        name="cloudupload"
                        size={24}
                        color={MyColors(1).white}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default ProfilePic;
