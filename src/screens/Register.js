import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import KeyboardAvoidWrapper from '../components/KeyboardAvoidWrapper'
import CustomInput from '../components/CustomInput'
import { useForm } from 'react-hook-form'
import apiHook from '../api'
import Spinner from 'react-native-loading-spinner-overlay'
import { Picker } from '@react-native-picker/picker'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import Toast from 'react-native-toast-message'

const Register = () => {
  const navigation = useNavigation()
  const [userType, setUserType] = useState('rider')

  const register = apiHook({
    key: 'register',
    method: 'POST',
    url: 'auth/users/register',
  })?.post

  useEffect(() => {
    if (register?.isError) {
      Toast.show({
        type: 'error',
        text1: register?.error,
      })
    }
  }, [register?.error])

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const submitHandler = (data) => {
    register
      .mutateAsync({ ...data, selected: userType })
      .then((res) => {
        navigation.navigate('OTP', {
          mobileNumber: res.mobileNumber,
          name: res.name,
          _id: res._id,
          otp: res.otp,
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <ScrollView>
      <KeyboardAvoidWrapper>
        <Toast />

        <View className='mx-5'>
          <Spinner visible={register?.isLoading} />

          <View className='bg-white-50'>
            <Picker
              selectedValue={userType}
              onValueChange={(itemValue) => setUserType(itemValue)}
            >
              <Picker.Item label='Rider' value='rider' />
              <Picker.Item label='Driver' value='driver' />
            </Picker>
          </View>

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

          {/* <View className='my-2'>
                <CustomInput
                  control={control}
                  rules={{
                    required: 'Email is required',
                    pattern: {
                      value: /\S+@\S+\.+\S+/,
                      message: 'Entered value does not match email format',
                    },
                  }}
                  errors={errors}
                  className='bg-white-50 p-2.5'
                  name='email'
                  placeholder='Email address'
                  keyboardType='email-address'
                  textContentType='emailAddress'
                />
              </View> */}

          <View className='my-2'>
            <CustomInput
              control={control}
              rules={{
                required: 'Mobile number is required',
              }}
              errors={errors}
              className='bg-white-50 p-2.5'
              name='mobileNumber'
              placeholder='Mobile number'
              keyboardType='number-pad'
              textContentType='number-pad'
            />
          </View>

          {userType === 'driver' && (
            <>
              <View className='my-2'>
                <CustomInput
                  control={control}
                  rules={{
                    required: 'Plate number is required',
                  }}
                  errors={errors}
                  className='bg-white-50 p-2.5'
                  name='plate'
                  placeholder='Plate number'
                />
              </View>

              <View className='my-2'>
                <CustomInput
                  control={control}
                  rules={{
                    required: 'License number is required',
                  }}
                  errors={errors}
                  className='bg-white-50 p-2.5'
                  name='license'
                  placeholder='License number'
                />
              </View>
            </>
          )}

          <View className='my-2'>
            <TouchableOpacity
              onPress={handleSubmit(submitHandler)}
              className='p-2.5 bg-purple-50'
            >
              {register?.isLoading ? (
                <ActivityIndicator size='small' color='#fff' />
              ) : (
                <Text className='text-white-50 uppercase text-center'>
                  Register
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View className='flex-row flex-wrap my-2'>
            <Text className='me-1'>
              By registering, you confirm that you accept our{' '}
            </Text>
            <Text
              className='text-purple-50'
              onPress={() =>
                Linking.openURL('https://ahmedibra.com/terms-of-use')
              }
            >
              Terms of Use
            </Text>
            <Text className='mx-1'>and</Text>
            <Text
              className='text-purple-50'
              onPress={() =>
                Linking.openURL('https://ahmedibra.com/privacy-policy')
              }
            >
              Privacy Policy
            </Text>
          </View>

          {/* social media links */}
          <View>
            {/* <Text className='text-gray-400 text-center mt-12'>
                  Or continue with
                </Text> */}

            {/* <View className='p-5 my-3 flex flex-row justify-around'>
                  <View>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Home')}
                      className='w-auto border border-purple-50 py-1 px-2'
                    >
                      <Text className='text-purple-50'>
                        <FontAwesome5 name='facebook' size={34} />
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Home')}
                      className='w-auto border border-purple-50 py-1 px-2'
                    >
                      <Text className='text-purple-50'>
                        <FontAwesome5 name='github' size={34} />
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Home')}
                      className='w-auto border border-purple-50 py-1 px-2'
                    >
                      <Text className='text-purple-50'>
                        <FontAwesome5 name='apple' size={34} />
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Home')}
                      className='w-auto border border-purple-50 py-1 px-2'
                    >
                      <Text className='text-purple-50'>
                        <FontAwesome5 name='google' size={34} />
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View> */}

            <View className='flex flex-row justify-center mt-5'>
              <TouchableOpacity>
                <Text>Already have an account? </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text className='text-purple-50 font-bold'>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidWrapper>
    </ScrollView>
  )
}

export default Register
