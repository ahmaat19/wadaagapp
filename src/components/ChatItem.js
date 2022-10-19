import { View, Text, Image } from 'react-native'
import React from 'react'
import moment from 'moment'

const ChatItem = ({ item }) => {
  return (
    <View className='flex-row justify-between items-center py-3'>
      <View className='flex-row items-center'>
        <Image
          source={{ uri: item?.image }}
          className='w-12 h-12 rounded-full'
        />
        <View>
          <Text className='ml-2 font-bold'>{item?.name}</Text>
          <Text className='ml-2'>{item?.lastMessage?.slice(0, 30)}</Text>
        </View>
      </View>

      <Text>{moment(item?.createdAt).format('H:m A')}</Text>
    </View>
  )
}

export default ChatItem
