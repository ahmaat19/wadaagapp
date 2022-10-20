import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native'
import React, { useEffect } from 'react'
import { FontAwesome5 } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import KeyboardAvoidWrapper from '../components/KeyboardAvoidWrapper'
import { useForm } from 'react-hook-form'
import CustomInput from '../components/CustomInput'
import apiHook from '../api'
import Spinner from 'react-native-loading-spinner-overlay'
import { ScrollView } from 'react-native-gesture-handler'
import FlashMessage, { showMessage } from 'react-native-flash-message'

const Login = () => {
  const navigation = useNavigation()

  const login = apiHook({
    key: 'login',
    method: 'POST',
    url: 'auth/login',
  })?.post

  useEffect(() => {
    if (login?.isError) {
      showMessage({
        message: login?.error,
        type: 'danger',
      })
    }
  }, [login?.error])

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      mobileNumber: '615301507',
    },
  })

  const submitHandler = (data) => {
    login
      .mutateAsync(data)
      .then((res) => {
        console.log(res.otp)
        navigation.navigate('OTP', {
          mobileNumber: res.mobileNumber,
          name: res.name,
          _id: res._id,
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }
  return (
    <>
      <FlashMessage
        position='top'
        style={{
          alignItems: 'center',
        }}
      />
      <ScrollView>
        <KeyboardAvoidWrapper>
          <View className='mx-5'>
            <View className='mt-2 mb-4 items-center'>
              <Spinner visible={login?.isLoading} />
              <View className='bg-white p-0 rounded-full w-auto'>
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
                className='bg-white p-2.5'
                name='mobileNumber'
                autoFocus={true}
                placeholder='Mobile number'
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
                className='p-2.5 bg-purple-800'
              >
                {login?.isLoading ? (
                  <ActivityIndicator size='small' color='#fff' />
                ) : (
                  <Text className='text-white uppercase text-center'>
                    Login
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* social media links */}
            <View>
              <Text className='text-gray-400 text-center mt-12'>
                Or continue with
              </Text>

              <View className='p-5 my-3 flex-row justify-around'>
                <View>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Home')}
                    className='w-auto border border-purple-800 py-1 px-2'
                  >
                    <Text className='text-purple-800'>
                      <FontAwesome5 name='facebook' size={34} />
                    </Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Home')}
                    className='w-auto border border-purple-800 py-1 px-2'
                  >
                    <Text className='text-purple-800'>
                      <FontAwesome5 name='github' size={34} />
                    </Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Home')}
                    className='w-auto border border-purple-800 py-1 px-2'
                  >
                    <Text className='text-purple-800'>
                      <FontAwesome5 name='apple' size={34} />
                    </Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Home')}
                    className='w-auto border border-purple-800 py-1 px-2'
                  >
                    <Text className='text-purple-800'>
                      <FontAwesome5 name='google' size={34} />
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View className='flex-row justify-center'>
                <TouchableOpacity>
                  <Text>Don't have an account? </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Register')}
                >
                  <Text className='text-purple-800 font-bold'>Register</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidWrapper>
      </ScrollView>
    </>
  )
}

export default Login
