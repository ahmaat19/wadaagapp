import { View, FlatList, TouchableOpacity, Text } from 'react-native'
import React, { useCallback } from 'react'
import TransactionItem from '../components/TransactionItem'
import apiHook from '../api'
import Spinner from 'react-native-loading-spinner-overlay'
import { useFocusEffect } from '@react-navigation/native'
import DriverCard from '../components/DriverCard'

const Driver = () => {
  const transactions = apiHook({
    key: 'driver',
    method: 'GET',
    url: 'reports/drivers',
  })?.get

  useFocusEffect(
    useCallback(() => {
      transactions?.refetch()
    }, [])
  )

  // console.log(transactions?.data)

  return (
    <View className='pb-3'>
      <Spinner visible={transactions?.isLoading} />
      {transactions?.isError && (
        <View className='items-center my-2 border border-purple-50 py-2 mx-5'>
          <Text className='text-red-500'>{transactions?.error}</Text>
        </View>
      )}
      <FlatList
        data={transactions?.data}
        renderItem={({ item }) => (
          <TouchableOpacity className='bg-white-50 mb-0.5 px-5'>
            <DriverCard item={item} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item?._id}
      />
    </View>
  )
}

export default Driver
