import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Animated,
    StatusBar,
} from "react-native";
import React, { useRef, useState } from "react";
import {
    heightPercentageToDP as HP,
    widthPercentageToDP as WP,
} from "react-native-responsive-screen";
import { MyColors } from "@/constants/myColors";
import { useNavigation } from "expo-router";
import Screen1 from './start/screen1'
import Screen2 from './start/screen2'


type GetStartedProps = {};

type HandleScroll = (screenIndex: number) => void;

type ScreenProps = {
    handleScroll: HandleScroll;
};

type Screen2Props = ScreenProps & {
    screenIndex: number
}

  type ScrollViewRef = React.RefObject<ScrollView>;

const GetStarted: React.FC<GetStartedProps>  = () =>{
    const scrollViewRef: ScrollViewRef = useRef<ScrollView>(null);

    const [screenIndex, setScreenIndex] = useState<number>(0);

    const handleScroll: HandleScroll = (screenIndex) => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ x: WP(100) });
        }
        setScreenIndex(screenIndex);
    };

    return (
        <ScrollView
            ref={scrollViewRef}
            style={{ height: HP(100), width: WP(100) }}
            bounces={false}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            snapToInterval={WP(100)}
            pagingEnabled={true}
            decelerationRate={0.8}
            scrollEnabled={false}
        >
            <StatusBar
                backgroundColor={MyColors(1).black}
                barStyle={"light-content"}
            />

            <Screen1 handleScroll={() => handleScroll(1)} />

            <Screen2
                handleScroll={() => handleScroll(2)}
                screenIndex={screenIndex}
            />
        </ScrollView>
    );
}

export default GetStarted;