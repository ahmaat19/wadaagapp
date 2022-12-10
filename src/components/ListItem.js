import { View, Text } from 'react-native'
import React from 'react'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'

const ListItem = ({ item }) => {
  return (
    <View className='flex-row justify-between items-center py-3'>
      <View className='flex-row items-center'>
        <FontAwesome5 name={item?.icon} size={24} color='#7e287e' />
        <Text className='ml-2'>{item?.label}</Text>
      </View>
      {item?.screen && <FontAwesome5 name='chevron-right' size={20} />}
    </View>
  )
}

export default ListItem
