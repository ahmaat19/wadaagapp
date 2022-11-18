import { View, Text } from 'react-native'
import React from 'react'
import moment from 'moment'

const TransactionItem = ({ item }) => {
  return (
    <View className='py-3 flex-row justify-between items-center'>
      <View>
        <Text className='font-bold mb-1'>
          {moment(item?.paidDate).format('MMM Do YY')}
        </Text>
        <Text className='font-extralight'>{item?.mobile}</Text>
      </View>
      <View className='bg-purple-50 px-3 py-2 rounded-lg w-auto items-center'>
        <Text className='text-white-50'>${item?.amount?.toFixed(2)}</Text>
      </View>
    </View>
  )
}

export default TransactionItem
