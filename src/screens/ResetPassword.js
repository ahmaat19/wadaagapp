import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import KeyboardAvoidWrapper from '../components/KeyboardAvoidWrapper'
import CustomInput from '../components/CustomInput'
import { useForm } from 'react-hook-form'
import { ScrollView } from 'react-native-gesture-handler'

const ResetPassword = () => {
  const navigation = useNavigation()

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const submitHandler = (data) => {
    console.log(data)

    navigation.navigate('Login')
  }

  return (
    <ScrollView>
      <KeyboardAvoidWrapper>
        <View className='mx-5'>
          <Text className='text-center font-bold text-2xl mb-2'>
            Reset Password
          </Text>

          <View className='my-2'>
            <CustomInput
              control={control}
              rules={{
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters long',
                },
              }}
              errors={errors}
              autoFocus={true}
              className='bg-white p-2.5'
              name='password'
              placeholder='Password'
              textContentType='password'
              secureTextEntry={true}
            />
          </View>

          <View className='my-2'>
            <CustomInput
              control={control}
              rules={{
                required: 'Confirm password is required',
                minLength: {
                  value: 6,
                  message:
                    'Confirm password must be at least 6 characters long',
                },
                validate: (value) =>
                  value === watch().password || 'The passwords do not match',
              }}
              errors={errors}
              className='bg-white p-2.5'
              name='confirmPassword'
              placeholder='Confirm password'
              textContentType='confirmPassword'
              secureTextEntry={true}
            />
          </View>

          <View className='my-2'>
            <TouchableOpacity
              onPress={handleSubmit(submitHandler)}
              className='p-2.5 bg-purple-800'
            >
              <Text className='text-white uppercase text-center'>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidWrapper>
    </ScrollView>
  )
}

export default ResetPassword
