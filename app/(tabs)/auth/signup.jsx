import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    ScrollView,
    StatusBar,
} from "react-native";
import React, { useRef, useState } from "react";
import { widthPercentageToDP as WP, heightPercentageToDP as HP } from "react-native-responsive-screen";
import { MyColors } from "@/constants/myColors";
import { useAuth } from "@/components/auth/authProvider";
import ScrollableInput from "@/components/customs/scrollableInput";
import { useNavigation } from "expo-router";
import Loading from "@/components/customs/loading";
import Feather from "@expo/vector-icons/Feather";
import { getAuth } from "firebase/auth";
import { LoginRegisterStyle } from "./authStyles";

const Signup = () => {
    const { register, updateUserData } = useAuth();
    const scrollViewRef = useRef();
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [password, setPassword] = useState(null);
    const [scrolling, setScrolling] = useState(false);
    const currentUser = getAuth().currentUser;

    const handleSubmit = async (email, setLoading, setError) => {
        setLoading(true);
        try {
            const response = await register(
                firstName,
                lastName,
                password,
                email
            );
            if (!response.success) {
                setError(response.msg);
            } else {
                updateUserData(currentUser.uid);
            }
        } catch (error) {
            setError(error.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const handleNext = (scrollTo) => {
        console.log(firstName, lastName);

        if (!scrolling) {
            setScrolling(true);
            scrollViewRef.current.scrollTo({ x: scrollTo, animated: true });
            setTimeout(() => {
                setScrolling(false);
            }, 300);
        }
    };

    const handleBack = (scrollTo) => {
        console.log("Pressed");

        if (!scrolling) {
            setScrolling(true);
            scrollViewRef.current.scrollTo({ x: scrollTo, animated: true });
            setTimeout(() => {
                setScrolling(false);
            }, 300);
        }
    };

    return (
        <ScrollableInput>
            <View style={LoginRegisterStyle.mainContainer}>
                <Text style={LoginRegisterStyle.title}>Register</Text>
                <ScrollView
                    style={LoginRegisterStyle.scrollView}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    ref={scrollViewRef}
                    scrollEnabled={false}
                    contentContainerStyle={{ width: WP(300) }}
                >
                    <NameRegistration
                        setFirstName={setFirstName}
                        setLastName={setLastName}
                        onNext={handleNext}
                        scrolling={scrolling}
                    />
                    <PasswordRegistration
                        setPassword={setPassword}
                        onNext={handleNext}
                        onBack={handleBack}
                        scrolling={scrolling}
                    />
                    <EmailRegistration
                        handleSubmit={handleSubmit}
                        onBack={handleBack}
                        scrolling={scrolling}
                    />
                </ScrollView>
            </View>
        </ScrollableInput>
    );
};





export default Signup;
