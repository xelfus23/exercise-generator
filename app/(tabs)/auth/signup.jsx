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
import {
    widthPercentageToDP as WP,
    heightPercentageToDP as HP,
} from "react-native-responsive-screen";
import { MyColors } from "@/constants/myColors";
import { useAuth } from "@/components/auth/authProvider";
import ScrollableInput from "@/components/customs/scrollableInput";
import { router, useNavigation } from "expo-router";
import Loading from "@/components/customs/loading";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import styles from "./authStyles";
import { getAuth } from "firebase/auth";
const { LoginRegisterStyle, style } = styles;

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

const NameRegistration = ({ setFirstName, setLastName, onNext, scrolling }) => {
    const navigator = useNavigation();

    const capitalizeFirstLetters = (str) => {
        return str
            .split(" ")
            .map((word) => {
                return (
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                );
            })
            .join(" ");
    };

    const [fName, setFName] = useState(null);
    const [lName, setLName] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const nextButton = () => {
        setLoading(true);
        setError(null);
        if (!fName || !lName) {
            setTimeout(() => {
                setError("Please enter your name.");
                setLoading(false);
            }, 100);
            return;
        }
        const FIRST = capitalizeFirstLetters(fName);
        const LAST = capitalizeFirstLetters(lName);
        if (FIRST && LAST) {
            setFirstName(FIRST);
            setLastName(LAST);
            setError(null);
            setLoading(false);
            onNext(WP(100));
        }
    };

    return (
        <SafeAreaView style={LoginRegisterStyle.container}>
            <View style={LoginRegisterStyle.inputContainer}>
                <TextInput
                    style={LoginRegisterStyle.input}
                    placeholderTextColor={MyColors(0.5).white}
                    placeholder="First Name"
                    value={fName}
                    onChangeText={(value) => setFName(value)}
                    maxLength={30}
                    editable={!scrolling}
                />
                <TextInput
                    style={LoginRegisterStyle.input}
                    placeholderTextColor={MyColors(0.5).white}
                    placeholder="Last Name"
                    value={lName}
                    onChangeText={(value) => setLName(value)}
                    maxLength={30}
                    editable={!scrolling}
                />
                {error && <Text style={LoginRegisterStyle.error}>{error}</Text>}

                <TouchableOpacity
                    disabled={loading}
                    onPress={nextButton}
                    style={[
                        LoginRegisterStyle.input,
                        LoginRegisterStyle.button,
                        {
                            width: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                        },
                    ]}
                >
                    {!loading ? (
                        <Text style={[LoginRegisterStyle.buttonText]}>
                            Continue
                        </Text>
                    ) : (
                        <View
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Loading />
                        </View>
                    )}
                </TouchableOpacity>

                <View style={LoginRegisterStyle.linkContainer}>
                    <Text style={LoginRegisterStyle.bottomText}>
                        Already have an account?
                    </Text>

                    <TouchableOpacity
                        onPress={() => navigator.navigate("login")}
                    >
                        <Text
                            style={[
                                LoginRegisterStyle.bottomText,
                                LoginRegisterStyle.link,
                            ]}
                        >
                            Login now
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const PasswordRegistration = ({ setPassword, onNext, scrolling, onBack }) => {
    const [pW, setPW] = useState();
    const [conPw, setConPW] = useState();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const nextButton = () => {
        setError(null);
        setLoading(true);

        if (!pW || !conPw) {
            setTimeout(() => {
                setError("Please enter your password.");
                setLoading(false);
            }, 100);
            return;
        }
        if (pW.length < 8) {
            setTimeout(() => {
                setLoading(false);
                setError("Password must be at least 8 characters long.");
            }, 1000);
            return;
        }
        if (pW !== conPw) {
            setTimeout(() => {
                setError("Password don't match.");
                setLoading(false);
            }, 1000);
            return;
        }
        setPassword(pW);
        setLoading(false);
        setError(null);
        onNext(WP(200));
    };

    return (
        <SafeAreaView style={LoginRegisterStyle.container}>
            <StatusBar
                backgroundColor={MyColors(1).black}
                barStyle={"light-content"}
            />
            <View style={LoginRegisterStyle.inputContainer}>
                <View style={LoginRegisterStyle.inputView}>
                    <TextInput
                        placeholderTextColor={MyColors(0.5).white}
                        placeholder="Password"
                        value={pW}
                        onChangeText={(value) => setPW(value)}
                        maxLength={30}
                        secureTextEntry={!showPassword}
                        style={LoginRegisterStyle.input}
                        editable={!scrolling}
                    />
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={LoginRegisterStyle.eye}
                    >
                        {!showPassword ? (
                            <Feather
                                name="eye"
                                size={30}
                                color={MyColors(1).white}
                            />
                        ) : (
                            <Feather
                                name="eye-off"
                                size={30}
                                color={MyColors(1).white}
                            />
                        )}
                    </TouchableOpacity>
                </View>
                <View style={LoginRegisterStyle.inputView}>
                    <TextInput
                        placeholderTextColor={MyColors(0.5).white}
                        placeholder="Confirm Password"
                        value={conPw}
                        onChangeText={(value) => setConPW(value)}
                        maxLength={30}
                        secureTextEntry={!showPassword}
                        style={LoginRegisterStyle.input}
                        editable={!scrolling}
                    />
                </View>
                {error && <Text style={LoginRegisterStyle.error}>{error}</Text>}
                <View style={LoginRegisterStyle.buttonContainer}>
                    <TouchableOpacity
                        style={[
                            LoginRegisterStyle.input,
                            LoginRegisterStyle.button,
                            {
                                width: "45%",
                                justifyContent: "center",
                                alignItems: "center",
                                borderColor: MyColors(1).yellow,
                            },
                        ]}
                        onPress={() => onBack(0)}
                    >
                        <Text style={LoginRegisterStyle.buttonText}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        disabled={loading || scrolling}
                        onPress={nextButton}
                        style={[
                            LoginRegisterStyle.input,
                            LoginRegisterStyle.button,
                            {
                                width: "45%",
                                justifyContent: "center",
                                alignItems: "center",
                            },
                        ]}
                    >
                        {!loading ? (
                            <Text style={[LoginRegisterStyle.buttonText]}>
                                Next
                            </Text>
                        ) : (
                            <View
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Loading />
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const EmailRegistration = ({ handleSubmit, scrolling, onBack }) => {
    const [mail, setMail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const submit = async () => {
        setError(null);
        setLoading(true);

        if (!mail) {
            setLoading(false);
            setError("Please enter your email.");
            return;
        }
        if (!validateEmail(mail)) {
            setLoading(false);
            setError("Please enter a valid email address.");
            return;
        }
        handleSubmit(mail, setLoading, setError);
    };

    return (
        <SafeAreaView style={LoginRegisterStyle.container}>
            <View style={LoginRegisterStyle.inputContainer}>
                <TextInput
                    style={LoginRegisterStyle.input}
                    placeholderTextColor={MyColors(0.5).white}
                    placeholder="Email"
                    value={mail}
                    onChangeText={(value) => setMail(value)}
                    maxLength={30}
                    editable={!scrolling}
                    inputMode="email"
                />

                {error && <Text style={LoginRegisterStyle.error}>{error}</Text>}

                <View style={LoginRegisterStyle.buttonContainer}>
                    <TouchableOpacity
                        style={[
                            LoginRegisterStyle.input,
                            LoginRegisterStyle.button,
                            {
                                width: "45%",
                                justifyContent: "center",
                                alignItems: "center",
                                borderColor: MyColors(1).yellow,
                            },
                        ]}
                        onPress={() => onBack(WP(100))}
                    >
                        <Text style={LoginRegisterStyle.buttonText}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        disabled={loading || scrolling}
                        onPress={submit}
                        style={[
                            LoginRegisterStyle.input,
                            LoginRegisterStyle.button,
                            {
                                width: "45%",
                                justifyContent: "center",
                                alignItems: "center",
                            },
                        ]}
                    >
                        {!loading ? (
                            <Text style={[LoginRegisterStyle.buttonText]}>
                                Register
                            </Text>
                        ) : (
                            <View
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Loading />
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Signup;
