import { View, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import apiHook from '../api'
import RiderCard from '../components/RiderCard'
import Spinner from 'react-native-loading-spinner-overlay'
import { FlatList } from 'react-native-gesture-handler'
import Toast from 'react-native-toast-message'

const Riders = ({ navigation, route }) => {
  const searchNearRiders = apiHook({
    key: 'near-riders',
    method: 'POST',
    url: 'rides/near-riders',
  })?.post

  useEffect(() => {
    if (searchNearRiders?.isError) {
      Toast.show({
        type: 'error',
        text1: searchNearRiders?.error,
      })
    }
  }, [searchNearRiders?.error])

  useEffect(() => {
    searchNearRiders
      ?.mutateAsync({
        originLatLng: route?.params?.originLatLng,
        destinationLatLng: route?.params?.destinationLatLng,
      })
      .then((res) => {
        return res
      })
      .catch((err) => {
        console.log(err)
        return err
      })
  }, [route?.params?.originLatLng, route?.params?.destinationLatLng])

  return (
    <>
      <Toast />

      <View>
        <Spinner visible={searchNearRiders?.isLoading} />
        <View>
          <FlatList
            data={searchNearRiders?.data}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Chat', {
                    _id: item.rider,
                    name: item?.name,
                  })
                }
                className='bg-white-50 mb-0.5 px-5'
              >
                <RiderCard item={item} />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item?._id}
          />
        </View>
      </View>
    </>
  )
}

export default Riders
