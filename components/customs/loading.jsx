import React from 'react'
import { heightPercentageToDP as HP, widthPercentageToDP as WP } from 'react-native-responsive-screen'
import LottieView from 'lottie-react-native'

export default function Loading({ size }) {
  return (
    <LottieView source={require('../../assets/json/loading.json')} autoPlay loop style={{ height: size, aspectRatio: 1, flex: 1 }} />
  )
}