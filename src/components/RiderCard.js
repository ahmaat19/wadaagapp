import { View, Text, Image } from 'react-native'
import React from 'react'
import { FontAwesome5 } from '@expo/vector-icons'

const RiderCard = ({ item }) => {
  return (
    <View className='flex-row justify-between items-center py-3'>
      <View className='flex-row items-center'>
        <Image
          source={{ uri: item?.image }}
          className='w-10 h-10 rounded-full'
        />
        <View>
          <Text className='ml-2 font-bold'>{item?.name}</Text>
          <Text className='ml-2'>{item?.mobile}</Text>
          <Text className='ml-2'>
            {item?.destination?.description?.slice(0, 26)}
          </Text>
        </View>
      </View>

      <FontAwesome5 name='chevron-right' size={20} />
    </View>
  )
}

export default RiderCard
