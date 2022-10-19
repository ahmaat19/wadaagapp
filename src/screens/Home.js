import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesome5 } from '@expo/vector-icons'
import * as SecureStore from 'expo-secure-store'
import apiHook from '../api'
import Spinner from 'react-native-loading-spinner-overlay'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import * as Location from 'expo-location'
import { GOOGLE_MAPS_API_KEY } from '@env'

const Home = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null)
  const [selected, setSelected] = useState(null)
  const [origin, setOrigin] = useState(null)

  const [location, setLocation] = useState(null)

  useEffect(() => {
    ;(async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        console.log('Permission to access location was denied')
        return
      }

      let location = await Location.getCurrentPositionAsync({})
      setLocation(location.coords)
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        let result = await Location.reverseGeocodeAsync(location)
        setValue('currentLocation', `${result[0]?.name}, ${result[0]?.city}`)
      } catch (e) {
        return e
      }
    })()
  }, [location])

  useEffect(() => {
    SecureStore.getItemAsync('userInfo')
      .then((res) => setUserInfo(JSON.parse(res)))
      .catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    if (userInfo?.userType === 'admin') {
      setSelected(null)
      return navigation.navigate('Admin')
    }

    if (userInfo?.userType === 'driver') {
      setSelected(null)
      return navigation.navigate('Driver')
    }

    if (Number(transactions?.data?.expirationDays) <= 0) {
      setSelected(null)
      return navigation.navigate('Subscription')
    }
  }, [selected, userInfo])

  const transactions = apiHook({
    key: 'register',
    method: 'GET',
    url: 'reports/payments/transactions',
  })?.get

  const loading = false

  useEffect(() => {
    if (selected && origin) {
      navigation.navigate('Map', {
        selected,
        origin,
      })
    }
  }, [selected, origin])

  return (
    <View className='py-3 px-5 flex-auto'>
      <Spinner visible={transactions?.isLoading} />
      {transactions?.isError && (
        <View className='items-center my-2 border border-purple-800 py-2'>
          <Text className='text-red-500'>{transactions?.error}</Text>
        </View>
      )}

      <Text className='font-bold text-md text-2xl text-purple-800 my-2'>
        {userInfo?.name},
      </Text>
      <Text
        className={`mb-3 ${
          Number(transactions?.data?.expirationDays) <= 0 && 'text-red-500'
        }`}
      >
        It's about to expire in {transactions?.data?.expirationDays} days.
      </Text>

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
          className={`bg-white w-40 h-60 items-center justify-center ${
            selected === 'riderOne' ? 'border border-purple-800 shadow-2xl' : ''
          }`}
          onPress={() => setSelected('riderOne')}
        >
          <Image
            source={require('../../assets/riderone.jpeg')}
            className='w-32 h-32'
          />
          <View className='mt-3'>
            <Text className='text-xl'>Rider One</Text>
            <FontAwesome5 name='arrow-circle-right' size={24} color='#6b21a8' />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!origin}
          className={`bg-white w-40 h-60 items-center justify-center ${
            selected === 'riderTwo' ? 'border border-purple-800 shadow-2xl' : ''
          }`}
          onPress={() => setSelected('riderTwo')}
        >
          <Image
            source={require('../../assets/ridertwo.webp')}
            className='w-28 h-28'
          />
          <View className='mt-3'>
            <Text className='text-xl'>Rider Two</Text>

            <FontAwesome5 name='arrow-circle-right' size={24} color='#6b21a8' />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Home
