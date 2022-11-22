import { View, Text, TouchableOpacity, Image, Linking } from 'react-native'
import React, { useCallback, useEffect, useReducer, useState } from 'react'
import { FontAwesome5 } from '@expo/vector-icons'
import * as SecureStore from 'expo-secure-store'
import apiHook from '../api'
import Spinner from 'react-native-loading-spinner-overlay'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { GOOGLE_MAPS_API_KEY } from '../utils/key'
import { SafeAreaView } from 'react-native-safe-area-context'
import { chatReducer, INITIAL_STATE } from '../chatReducer'
import { useFocusEffect } from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import * as Location from 'expo-location'

const Home = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null)
  const [selected, setSelected] = useState(null)
  const [origin, setOrigin] = useState(null)
  const [currentLocation, setCurrentLocation] = useState(null)

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE)

  useEffect(() => {
    if (state.messages.length > 0) {
      console.log('Found messages')
    }
  }, [state])

  useEffect(() => {
    if (selected && origin) {
      navigation.navigate('Map', {
        selected,
        origin,
      })
    }
  }, [selected, origin])

  useEffect(() => {
    SecureStore.getItemAsync('userInfo')
      .then((res) => setUserInfo(JSON.parse(res)))
      .catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    if (userInfo?.role === 'DRIVER') {
      setSelected(null)
      return navigation.replace('Driver')
    }
  }, [selected, userInfo])

  const transactions = apiHook({
    key: 'register',
    method: 'GET',
    url: 'payments',
  })?.get

  const pendingTrip = apiHook({
    key: 'pending-trip',
    method: 'GET',
    url: 'trips/pending',
  })?.get

  const cancelTrip = apiHook({
    key: 'trip-cancel',
    method: 'PUT',
    url: `trips/${pendingTrip?.data?._id}`,
  })?.update

  const completeTrip = apiHook({
    key: 'trip-complete',
    method: 'PUT',
    url: `trips/${pendingTrip?.data?._id}`,
  })?.update

  const updateTrip = apiHook({
    key: 'trip-update',
    method: 'PUT',
    url: `trips/location/${pendingTrip?.data?._id}`,
  })?.update

  // updating the trip based on the current position
  useEffect(() => {
    ;(async () => {
      try {
        const result = await Location.reverseGeocodeAsync(currentLocation)
        const obj = {
          description: `${result[0]?.name}, ${result[0]?.city}, ${result[0]?.country}`,
          location: {
            lat: currentLocation?.latitude,
            lng: currentLocation?.longitude,
          },
        }
        if (pendingTrip?.data?.status === 'pending') {
          updateTrip?.mutateAsync(obj)
        }
      } catch (e) {
        return e
      }
    })()
  }, [currentLocation])

  // watch position changes
  useEffect(() => {
    ;(() => {
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 1,
          timeInterval: 3000,
        },
        ({ coords }) => {
          setCurrentLocation(coords)
        }
      )
        .then((locationWatcher) => {
          pendingTrip?.data?.status !== 'pending' && locationWatcher.remove()
        })
        .catch((err) => {
          console.log(err)
        })
    })()
  }, [])

  useFocusEffect(
    useCallback(() => {
      transactions?.refetch()
      pendingTrip?.refetch()
      setSelected(null)
    }, [])
  )

  useEffect(() => {
    if (cancelTrip?.isSuccess || completeTrip?.isSuccess) {
      transactions?.refetch()
      pendingTrip?.refetch()
    }
  }, [cancelTrip?.isSuccess, completeTrip?.isSuccess])

  useEffect(() => {
    transactions?.refetch()
    pendingTrip?.refetch()
  }, [origin])

  useEffect(() => {
    if (
      (transactions?.isError,
      cancelTrip?.isError,
      pendingTrip?.isError,
      completeTrip?.isError)
    ) {
      Toast.show({
        type: 'error',
        text1:
          transactions?.error ||
          cancelTrip?.error ||
          pendingTrip?.error ||
          completeTrip?.error,
      })
    }
  }, [
    transactions?.error,
    cancelTrip?.error,
    pendingTrip?.error,
    completeTrip?.error,
  ])

  const _pressCall = () => {
    const url = 'tel//:*789*638744*1%23'
    Linking.openURL(url)
      .then((r) => console.log(r))
      .catch((e) => console.log(e))
  }
  return (
    <SafeAreaView>
      {pendingTrip?.data?.status === 'pending' && (
        <View className='bg-green-500 shadow shadow-green-300 z-20 absolute w-screen px-5 pt-3 pb- h-24'>
          <View className='justify-between flex-row top-10'>
            <TouchableOpacity
              onPress={() =>
                completeTrip?.mutateAsync({
                  ...pendingTrip?.data,
                  actionStatus: 'completed',
                })
              }
              className='flex-row items-center border border-purple-50 shadow px-3 py-1 rounded-full'
            >
              <FontAwesome5 name='check-circle' size={24} color='#7e287e' />
              <Text className='ml-2 text-purple-50'>Complete Trip</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                cancelTrip?.mutateAsync({
                  ...pendingTrip?.data,
                  actionStatus: 'cancelled',
                })
              }
              className='flex-row items-center border border-red-500 shadow px-3 py-1 rounded-full'
            >
              <FontAwesome5 name='times-circle' size={24} color='#ef4444' />
              <Text className='ml-2 text-red-500'>Cancel Trip</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View
        className={`px-5 flex-auto ${
          pendingTrip?.data?.status === 'pending' ? 'py-16' : 'pt-16'
        }`}
      >
        <Toast />
        <Spinner
          visible={
            transactions?.isLoading ||
            pendingTrip?.isLoading ||
            cancelTrip?.isLoading
          }
        />

        {/* {(transactions?.isError ||
          pendingTrip?.isError ||
          cancelTrip?.isError) && (
          <View className='items-center my-2 border border-purple-50 py-2'>
            <Text className='text-red-500'>
              {transactions?.error || pendingTrip?.error || cancelTrip?.error}
            </Text>
          </View>
        )} */}
        <Text className='font-bold text-md text-2xl text-purple-50 my-2'>
          {userInfo?.name},
        </Text>
        <Text
          className={`mb-3 ${
            Number(transactions?.data?.expirationDays) <= 0 && 'text-red-500'
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

        <View className='my-4'>
          <GooglePlacesAutocomplete
            placeholder='Where from?'
            nearbyPlacesAPI='GooglePlacesSearch'
            debounce={400}
            styles={{
              container: {
                flex: 0,
              },
            }}
            onPress={(data, details = null) => {
              setOrigin({
                location: details.geometry.location,
                description: data.description,
              })
            }}
            fetchDetails={true}
            minLength={2}
            enablePoweredByContainer={false}
            query={{
              key: GOOGLE_MAPS_API_KEY,
              language: 'en',
              components: 'country:so',
            }}
          />
        </View>

        <View className='flex justify-between flex-row my-5'>
          <TouchableOpacity
            disabled={!origin}
            className={`bg-white-50 w-36 h-60 items-center ${
              !origin ? 'opacity-50' : 'opacity-100'
            } justify-center ${
              selected === 'riderOne'
                ? 'border border-purple-50 shadow-2xl'
                : ''
            }`}
            onPress={() => setSelected('riderOne')}
          >
            <Image
              source={require('../../assets/riderone.png')}
              className='w-24 h-24'
            />
            <View className='mt-3'>
              <Text className='text-lg'>Rider One</Text>
              <FontAwesome5
                name='arrow-circle-right'
                size={24}
                color='#7e287e'
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={!origin}
            className={`bg-white-50 w-36 h-60 items-center ${
              !origin ? 'opacity-50' : 'opacity-100'
            } justify-center ${
              selected === 'riderTwo'
                ? 'border border-purple-50 shadow-2xl'
                : ''
            }`}
            onPress={() => setSelected('riderTwo')}
          >
            <Image
              source={require('../../assets/ridertwo.png')}
              className='w-24 h-24'
            />
            <View className='mt-3'>
              <Text className='text-lg'>Rider Two</Text>

              <FontAwesome5
                name='arrow-circle-right'
                size={24}
                color='#7e287e'
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Home
