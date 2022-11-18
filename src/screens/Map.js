import {
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import MapComp from '../components/MapComp'
import Spinner from 'react-native-loading-spinner-overlay'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { GOOGLE_MAPS_API_KEY } from '../utils/key'
import { useForm } from 'react-hook-form'
import CustomInput from '../components/CustomInput'
import { FontAwesome5 } from '@expo/vector-icons'
import apiHook from '../api'
import Toast from 'react-native-toast-message'

const Map = ({ navigation, route }) => {
  const [destination, setDestination] = useState(null)
  const [distance, setDistance] = useState(null)
  const [duration, setDuration] = useState(null)
  const [error, setError] = useState(null)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  })

  const startTrip = apiHook({
    key: 'trips',
    method: 'POST',
    url: 'trips',
  })?.post

  const searchNearRiders = apiHook({
    key: 'near',
    method: 'POST',
    url: 'trips/near',
  })?.post

  useEffect(() => {
    if (!route.params) {
      navigation.navigate('HomeTabs')
    }
  }, [])

  useEffect(() => {
    if (error) {
      Toast.show({
        type: error?.toString(),
        text1: chatHistory?.error,
      })
    }
  }, [error])

  useEffect(() => {
    if (startTrip?.isError || searchNearRiders?.isError) {
      Toast.show({
        type: 'error',
        text1: startTrip?.error || searchNearRiders?.error,
      })
    }
  }, [startTrip?.error, searchNearRiders?.error])

  const submitHandler = (data) => {
    if (route?.params?.selected === 'riderOne') {
      return startTrip
        ?.mutateAsync({
          plate: data.plate,
          origin: route?.params?.origin,
          destination,
          distance,
          duration,
          rider: route?.params?.selected,
        })
        .then((res) => {
          navigation.navigate('Home')
          return res
        })
        .catch((err) => {
          console.log(err)
          return err
        })
    }

    if (route?.params?.selected === 'riderTwo') {
      searchNearRiders
        ?.mutateAsync({
          origin: route?.params?.origin,
          destination,
        })
        .then((res) => {
          navigation.navigate('Riders', {
            origin: route?.params?.origin,
            destination,
          })
          // return res
        })
        .catch((err) => {
          console.log(err)
          return err
        })
    }
  }

  return (
    <>
      <View className='z-10'>
        <Toast />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <Spinner
          visible={startTrip?.isLoading || searchNearRiders?.isLoading}
        />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className='flex-1'>
            <View className='h-2/3'>
              <MapComp
                origin={route?.params?.origin}
                rider={route?.params?.selected}
                destination={destination}
                setDistance={setDistance}
                setDuration={setDuration}
                setError={setError}
              />
            </View>
            <View className='h-1/5 px-5'>
              <View className='my-2'>
                <GooglePlacesAutocomplete
                  placeholder='Where to?'
                  nearbyPlacesAPI='GooglePlacesSearch'
                  debounce={400}
                  styles={{
                    container: {
                      flex: 0,
                    },
                  }}
                  onPress={(data, details = null) => {
                    setDestination({
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

              {route?.params?.selected === 'riderOne' && (
                <View className='mb-3 h-12 bg-white-50 justify-center'>
                  <CustomInput
                    control={control}
                    rules={{
                      required: 'Plate is required',
                    }}
                    errors={errors}
                    className='bg-white-50 p-2.5'
                    name='plate'
                    placeholder='Plate'
                  />
                </View>
              )}

              {(duration || distance) &&
                route?.params?.selected === 'riderOne' && (
                  <View className='flex-row justify-between mb-2'>
                    {duration && (
                      <View className='bg-white-50 py-2 w-2/5 flex-row justify-center items-center rounded-full'>
                        <Text className='font-bold'>{duration}</Text>
                      </View>
                    )}
                    {distance && (
                      <View className='bg-white-50 py-2 w-2/5 flex-row justify-center items-center rounded-full'>
                        <Text className='font-bold'>{distance}</Text>
                      </View>
                    )}
                  </View>
                )}
            </View>
            <View className='h-1/6 px-5 mt-5'>
              <TouchableOpacity
                onPress={handleSubmit(submitHandler)}
                className='p-3 bg-purple-50 rounded-full justify-center items-center flex-row shadow-lg'
              >
                {route?.params?.selected === 'riderOne' ? (
                  <>
                    <FontAwesome5 name='paper-plane' size={24} color='#fff' />
                    <Text className='text-white-50 uppercase ml-2'>
                      Start Trip
                    </Text>
                  </>
                ) : (
                  <>
                    <FontAwesome5 name='search' size={24} color='#fff' />
                    <Text className='text-white-50 uppercase ml-2'>
                      Search Near Riders
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  )
}

export default Map
