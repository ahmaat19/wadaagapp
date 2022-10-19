import { View, Image } from 'react-native'
import React from 'react'

const Splash = () => {
  return (
    <View className='h-full'>
      <Image
        source={require('../../assets/splash.png')}
        className='w-full h-full'
      />
    </View>
  )
}

export default Splash
