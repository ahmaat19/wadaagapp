import {
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import MapComp from '../components/MapComp'
import Spinner from 'react-native-loading-spinner-overlay'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { GOOGLE_MAPS_API_KEY } from '@env'
import { useForm } from 'react-hook-form'
import CustomInput from '../components/CustomInput'

const Map = ({ navigation, route }) => {
  const [destination, setDestination] = useState(null)

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  })

  useEffect(() => {
    if (!route.params) {
      navigation.navigate('HomeTabs')
    }
  }, [])

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className='flex-1'>
          <View className='h-1/2'>
            <MapComp
              origin={route?.params?.origin}
              rider={route?.params?.selected}
              destination={destination}
            />
          </View>
          <View className='h-1/2 px-5'>
            <View className='my-4'>
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
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default Map
