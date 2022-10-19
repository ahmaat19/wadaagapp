import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import KeyboardAvoidWrapper from '../components/KeyboardAvoidWrapper'
import CustomInput from '../components/CustomInput'
import { useForm } from 'react-hook-form'
import { ScrollView } from 'react-native-gesture-handler'

const ForgetPassword = () => {
  const navigation = useNavigation()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const submitHandler = (data) => {
    console.log(data)

    navigation.navigate('ResetPassword')
  }

  return (
    <ScrollView>
      <KeyboardAvoidWrapper>
        <View className='mx-5'>
          <Text className='text-center font-bold text-2xl mb-2'>
            Forget Password
          </Text>

          <View className='my-2'>
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
              autoFocus={true}
              className='bg-white p-2.5'
              name='email'
              placeholder='Email address'
              keyboardType='email-address'
              textContentType='emailAddress'
            />
          </View>

          <View className='my-2'>
            <TouchableOpacity
              onPress={handleSubmit(submitHandler)}
              className='p-2.5 bg-purple-800'
            >
              <Text className='text-white uppercase text-center'>Forget</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidWrapper>
    </ScrollView>
  )
}

export default ForgetPassword
