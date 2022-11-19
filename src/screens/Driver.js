import { View, FlatList, TouchableOpacity, Text, Linking } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import apiHook from '../api'
import Spinner from 'react-native-loading-spinner-overlay'
import { useFocusEffect } from '@react-navigation/native'
import DriverCard from '../components/DriverCard'
import Toast from 'react-native-toast-message'

const Driver = () => {
  const trips = apiHook({
    key: 'driver',
    method: 'GET',
    url: 'drivers',
  })?.get
  const transactions = apiHook({
    key: 'payments',
    method: 'GET',
    url: 'payments',
  })?.get

  // useEffect(() => {
  //   navigation.setOptions({
  //     // headerTitle: 'OKK',
  //     headerLeft: () => (
  //       <Button
  //         onPress={() => navigation.navigate('HomeTabs', { screen: 'Setting' })}
  //         title='Settings'
  //       />
  //     ),
  //   })
  // }, [])

  useFocusEffect(
    useCallback(() => {
      trips?.refetch()
    }, [])
  )

  useEffect(() => {
    if (trips?.isError || transactions?.isError) {
      Toast.show({
        type: 'error',
        text1: trips?.error,
      })
    }
  }, [trips?.isError, transactions?.error])

  const _pressCall = () => {
    const url = 'tel://*789*638744*1#'
    Linking.openURL(url)
      .then((r) => console.log(r))
      .catch((e) => console.log(e))
  }

  return (
    <>
      <View className='pb-3'>
        <Toast />
        <Spinner visible={trips?.isLoading || transactions?.isLoading} />

        <Text
          className={`mb-3 ${
            Number(transactions?.data?.expirationDays) <= 0 &&
            'text-red-500 text-center'
          }`}
        >
          It's about to expire in {transactions?.data?.expirationDays || 0}{' '}
          days.
        </Text>

        {Number(transactions?.data?.expirationDays) < 1 && (
          <TouchableOpacity
            onPress={_pressCall}
            className='items-center border border-red-500 shadow px-3 py-2'
          >
            <Text className='text-red-500 uppercase'>
              Pay Now (*789*638744*1#)
            </Text>
          </TouchableOpacity>
        )}

        {transactions?.data?.length === 0 && (
          <View className='items-center my-2  border border-purple-50 py-2 mx-5'>
            <Text className='text-red-500'>No, transactions available</Text>
          </View>
        )}
        <FlatList
          data={trips?.data}
          renderItem={({ item }) => (
            <TouchableOpacity className='bg-white-50 mb-0.5 px-5'>
              <DriverCard item={item} />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item?._id}
        />
      </View>
    </>
  )
}

export default Driver
