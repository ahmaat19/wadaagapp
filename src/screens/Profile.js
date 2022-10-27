import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import KeyboardAvoidWrapperTabs from '../components/KeyboardAvoidWrapperTabs'
import CustomInput from '../components/CustomInput'
import { useForm } from 'react-hook-form'
import Spinner from 'react-native-loading-spinner-overlay'
import * as ImagePicker from 'expo-image-picker'
import { ScrollView } from 'react-native-gesture-handler'
import apiHook from '../api'
import * as SecureStore from 'expo-secure-store'
import Toast from 'react-native-toast-message'

const Profile = () => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  })

  const [image, setImage] = useState(null)
  const [userType, setUserType] = useState(null)

  const getProfile = apiHook({
    key: 'profile',
    method: 'GET',
    url: 'auth/profile',
  })?.get

  const putProfile = apiHook({
    key: 'profile',
    method: 'POST',
    url: 'auth/profile',
  })?.post

  // const uploadProfileImage = apiHook({
  //   key: 'profile-image',
  //   method: 'POST',
  //   url: `upload/type=image`,
  // })?.post

  useEffect(() => {
    if (putProfile?.isSuccess) {
      Toast.show({
        type: 'success',
        text1: 'Profile has been updated successfully',
      })
    }
  }, [putProfile?.isSuccess])

  useEffect(() => {
    if (putProfile?.isError) {
      Toast.show({
        type: 'error',
        text1: putProfile?.error,
      })
    }
  }, [putProfile?.error])

  useEffect(() => {
    const permissionRequest = async () => {
      if (Platform.OS !== 'web') {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
          alert('Permission denied')
        }
      }

      permissionRequest()
    }
  }, [])

  // const pickImage = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.All,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   })
  //   if (!result.cancelled) {
  //     uploadProfileImage
  //       .mutateAsync(result.uri)
  //       .then((res) => {
  //         console.log(res)
  //       })
  //       .catch((err) => {
  //         console.log(err)
  //       })

  //     setImage(result.uri)
  //   }
  // }

  useEffect(() => {
    if (getProfile?.data) {
      setValue('name', getProfile?.data?.name)
      setUserType(getProfile?.data?.userType)
      setImage(getProfile?.data?.image)
    }
  }, [getProfile?.data])

  const submitHandler = (data) => {
    console.log(data)

    putProfile
      .mutateAsync(data)
      .then((res) => {
        SecureStore.getItemAsync('userInfo')
          .then((obj) => {
            const parsed = JSON.parse(obj)
            parsed.name = res.name
            SecureStore.setItemAsync('userInfo', JSON.stringify(parsed))
              .then((v) => v)
              .catch((err) => err)
          })
          .catch((err) => err)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <>
      <ScrollView>
        <KeyboardAvoidWrapperTabs>
          <Toast />
          <Spinner visible={getProfile?.isLoading || putProfile?.isLoading} />

          <View className='mx-5 my-auto'>
            <View className='rounded-full items-center'>
              <TouchableOpacity>
                <Image
                  source={{ url: image }}
                  className='w-40 h-40 rounded-full mb-3'
                />
                <Text className='text-center'>Change profile picture</Text>
              </TouchableOpacity>

              <View className='bg-purple-50 px-4 py-2 rounded-full my-3'>
                <Text className='text-white-50 uppercase'>{userType}</Text>
              </View>
            </View>

            {getProfile?.isError ||
              (putProfile?.isError && (
                <View className='items-center my-2 border border-purple-50 py-2'>
                  <Text className='text-red-500'>
                    {getProfile?.error || putProfile?.error}
                  </Text>
                </View>
              ))}

            <View className='my-2'>
              <CustomInput
                control={control}
                rules={{
                  required: 'Name is required',
                }}
                errors={errors}
                className='bg-white-50 p-2.5'
                name='name'
                autoFocus={true}
                placeholder='Name'
              />
            </View>

            <View className='my-2'>
              <TouchableOpacity
                onPress={handleSubmit(submitHandler)}
                className='p-2.5 bg-purple-50'
              >
                {putProfile?.isLoading ? (
                  <ActivityIndicator size='small' color='#fff' />
                ) : (
                  <Text className='text-white-50 uppercase text-center'>
                    Update
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidWrapperTabs>
      </ScrollView>
    </>
  )
}

export default Profile
