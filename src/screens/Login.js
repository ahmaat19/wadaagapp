import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import KeyboardAvoidWrapper from '../components/KeyboardAvoidWrapper'
import { useForm } from 'react-hook-form'
import CustomInput from '../components/CustomInput'
import apiHook from '../api'
import Spinner from 'react-native-loading-spinner-overlay'
import { ScrollView } from 'react-native-gesture-handler'
import Toast from 'react-native-toast-message'
import { GOOGLE_MAPS_API_KEY } from '../utils/key'

const Login = () => {
  const navigation = useNavigation()

  const login = apiHook({
    key: 'login',
    method: 'POST',
    url: 'auth/login',
  })?.post

  useEffect(() => {
    if (login?.isError) {
      Toast.show({
        type: 'error',
        text1: login?.error,
      })
    }
  }, [login?.error])

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      // mobile: '615301507',
    },
  })

  const submitHandler = (data) => {
    login
      .mutateAsync({ ...data, platform: 'mobile' })
      .then((res) => {
        navigation.navigate('OTP', {
          mobile: res.mobile,
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
          <View className='mt-2 mb-4 items-center'>
            <Spinner visible={login?.isLoading} />
            <View className='bg-white-50 p-0 rounded-full w-auto'>
              <Image
                source={require('../../assets/logo.png')}
                className='w-20 h-20 rounded-full'
              />
            </View>
            <Text className='text-center font-bold text-2xl mb-2'>
              Welcome back
            </Text>
            <Text className='text-center'>Just one minute away from</Text>
            <Text className='text-center'>experiencing this app</Text>
          </View>

          <View className='my-2'>
            <CustomInput
              control={control}
              rules={{
                required: 'Mobile number is required',
              }}
              errors={errors}
              className='bg-white-50 p-2.5'
              name='mobile'
              autoFocus={true}
              placeholder={GOOGLE_MAPS_API_KEY}
              keyboardType='number-pad'
              textContentType='number-pad'
            />
          </View>

          {/* <View className='my-2 items-end'>
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgetPassword')}
            >
              <Text className='text-gray-500 '>Recovery password</Text>
            </TouchableOpacity>
          </View> */}

          <View className='my-2'>
            <TouchableOpacity
              onPress={handleSubmit(submitHandler)}
              className='p-2.5 bg-purple-50'
            >
              {login?.isLoading ? (
                <ActivityIndicator size='small' color='#fff' />
              ) : (
                <Text className='text-white-50 uppercase text-center'>
                  Login
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* social media links */}
          <View>
            {/* <Text className='text-gray-400 text-center mt-12'>
              Or continue with
            </Text> */}

            {/* <View className='p-5 my-3 flex-row justify-around'>
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

            <View className='flex-row justify-center mt-5'>
              <TouchableOpacity>
                <Text>Don't have an account? </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text className='text-purple-50 font-bold'>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidWrapper>
    </ScrollView>
  )
}

export default Login
