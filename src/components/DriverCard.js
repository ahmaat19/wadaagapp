import { View, Text } from 'react-native'
import React from 'react'
import moment from 'moment'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'

const DriverCard = ({ item }) => {
  return (
    <View className='py-3 flex-row justify-between items-center'>
      <View>
        <Text>
          <FontAwesome5 name='hourglass-start' size={14} />
          <Text> {item?.origin?.description}</Text>
        </Text>
        <Text>
          <FontAwesome5 name='hourglass-end' size={14} />
          <Text> {item?.destination?.description}</Text>
        </Text>
        <Text>
          <FontAwesome5 name='clock' size={14} />
          <Text> {moment(item?.createdAt).format('MMM Do YY HH:mm')}</Text>
        </Text>
      </View>
    </View>
  )
}

export default DriverCard
