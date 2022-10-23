import { View, FlatList, TouchableOpacity, Text } from 'react-native'
import React, { useCallback } from 'react'
import TransactionItem from '../components/TransactionItem'
import apiHook from '../api'
import Spinner from 'react-native-loading-spinner-overlay'
import { useFocusEffect } from '@react-navigation/native'

const Transaction = () => {
  const transactions = apiHook({
    key: 'register',
    method: 'GET',
    url: 'reports/payments/transactions',
  })?.get

  useFocusEffect(
    useCallback(() => {
      transactions?.refetch()
    }, [])
  )

  return (
    <View className='pb-3'>
      <Spinner visible={transactions?.isLoading} />
      {transactions?.isError && (
        <View className='items-center my-2 border border-purple-800 py-2 mx-5'>
          <Text className='text-red-500'>{transactions?.error}</Text>
        </View>
      )}
      <FlatList
        data={transactions?.data?.transactions}
        renderItem={({ item }) => (
          <TouchableOpacity className='bg-white mb-0.5 px-5'>
            <TransactionItem item={item} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item?._id}
      />
    </View>
  )
}

export default Transaction
