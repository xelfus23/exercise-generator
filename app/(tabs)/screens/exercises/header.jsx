import { View, Text, Platform, TouchableOpacity } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { widthPercentageToDP as WP, heightPercentageToDP as HP } from 'react-native-responsive-screen';
import { MyColors } from '../../../../constants/myColors.jsx'
import { useAuth } from "@/components/auth/authProvider";
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';

const ios = Platform.OS == 'ios';

export default function Header({ onPress, title }) {

    const navigation = useNavigation();
    
    return (
        <LinearGradient
            colors={[MyColors(0.3).gray, MyColors(1).black]}
            style={{
                paddingTop: HP(8),
                paddingHorizontal: 20,
                paddingBottom: HP(2),
                borderBottomRightRadius: 20,
                borderBottomLeftRadius: 20,
                flexDirection: 'row',
                backgroundColor: MyColors(1).black,
                borderBottomWidth: 1,
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderColor: MyColors(1).gray,
            }}
        >
            <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={24} color={MyColors(1).white} />
                </TouchableOpacity>
                <View style={{ justifyContent: 'center' }}>
                    <Text style={{ fontSize: HP(3), color: MyColors(1).white }}>{title}</Text>
                </View>
            </View>
        </LinearGradient>
    )
}