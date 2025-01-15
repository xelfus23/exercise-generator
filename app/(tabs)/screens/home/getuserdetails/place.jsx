import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { heightPercentageToDP as HP, widthPercentageToDP as WP } from "react-native-responsive-screen";
import { MyColors } from "@/constants/myColors";
import NextButtons from './next'

export default function PreferablePlaces({ setSelectedPlaces, next }) {
    const places = [
        {
            name: "Home",
            description:
                "A personal and private space, typically inside a house or apartment, where you can relax, live, and manage daily activities. It's easily accessible, allowing you to have flexibility in your schedule.",
        },
        {
            name: "Outdoor",
            description:
                "Any open, natural environment such as parks, fields, or beaches. It provides fresh air, natural scenery, and a space that can be used for recreational activities, walking, or socializing.",
        },
        {
            name: "Gym",
            description:
                "A fitness center or facility equipped with machines, free weights, and other exercise tools. It’s a controlled environment specifically designed for training and physical exercise.",
        },
    ];

    const [selected, setSelected] = useState([]);
    const [error, setError] = useState(null);

    const updateSelectedItem = (item) => {
        setSelected((prev) => {
            if (prev.includes(item)) {
                return prev.filter((selectedItem) => selectedItem !== item);
            } else {
                return [...prev, item];
            }
        });

        console.log(selected);
    };

    const nextButton = () => {
        if (selected.length === 0) {
            setError("Please select one or more.");
            setTimeout(() => {
                setError(null);
            }, 2000);
            return;
        }
        setSelectedPlaces(selected);
        next(1);
    };

    const backButton = () => {
        next(-1);
    };

    return (
        <View style={{ alignItems: "center" }}>
            <View style={{ marginTop: HP(4), width: WP(90) }}>
                <Text
                    style={{
                        color: MyColors(0.8).white,
                        fontWeight: "bold",
                        fontSize: HP(2),
                    }}
                >
                    • Which place do you prefer to do your exercise?
                </Text>
                <Text
                    style={{
                        color: MyColors(0.8).white,
                        fontSize: HP(1.6),
                    }}
                >
                    Choose one or more:
                </Text>
            </View>
            <View
                style={{
                    borderWidth: 1,
                    borderColor: MyColors(1).gray,
                    marginHorizontal: WP(5),
                    marginTop: HP(3),
                    borderRadius: WP(4),
                    width: WP(90),
                    padding: HP(1),
                    gap: HP(1),
                }}
            >
                {places.map((item, index) => (
                    <Pressable
                        key={index}
                        onPress={() => updateSelectedItem(item.name)}
                    >
                        <View
                            style={{
                                justifyContent: "space-between",
                                alignItems: "center",
                                borderRadius: WP(4),
                                borderWidth: 1,
                                borderColor: selected.includes(item.name)
                                    ? MyColors(0.8).green
                                    : MyColors(1).gray,
                                padding: HP(1),
                                paddingHorizontal: HP(2),
                                flexDirection: "row",
                                gap: WP(4),
                            }}
                        >
                            <Text
                                style={{
                                    color: selected.includes(item.name)
                                        ? MyColors(0.8).green
                                        : MyColors(0.5).white,
                                    fontSize: HP(2),
                                    fontWeight: "bold",
                                    elevation: selected.includes(item.name)
                                        ? 4
                                        : 0,
                                }}
                            >
                                {item.name}
                            </Text>

                            <Text
                                style={{
                                    color: selected.includes(item.name)
                                        ? MyColors(0.8).white
                                        : MyColors(0.5).white,
                                    fontSize: HP(1.5),
                                    width: WP(50),
                                }}
                            >
                                {item.description}
                            </Text>
                        </View>
                    </Pressable>
                ))}
            </View>

            <Text
                style={{
                    color: MyColors(0.8).red,
                    textAlign: "center",
                    paddingVertical: HP(2),
                }}
            >
                {error}
            </Text>

            <View style={{ justifyContent: "center", alignItems: "center" }}>
                <NextButtons next={nextButton} back={backButton} />
            </View>
        </View>
    );
};