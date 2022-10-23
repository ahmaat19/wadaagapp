import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import KeyboardAvoidWrapper from '../components/KeyboardAvoidWrapper'
import { ScrollView } from 'react-native-gesture-handler'
import apiHook from '../api'
import Spinner from 'react-native-loading-spinner-overlay/lib'
import { AuthContext } from '../AuthContext'
import FlashMessage, { showMessage } from 'react-native-flash-message'

const OTP = ({ route }) => {
  const { signIn } = useContext(AuthContext)

  const verifyOtp = apiHook({
    key: 'verifyOtp',
    method: 'POST',
    url: 'auth/login/otp',
  })?.post

  useEffect(() => {
    if (verifyOtp?.isError) {
      showMessage({
        message: verifyOtp?.error,
        type: 'danger',
      })
    }
  }, [verifyOtp?.error])

  const pin1Ref = useRef(null)
  const pin2Ref = useRef(null)
  const pin3Ref = useRef(null)
  const pin4Ref = useRef(null)

  const [pin1, setPin1] = useState('')
  const [pin2, setPin2] = useState('')
  const [pin3, setPin3] = useState('')
  const [pin4, setPin4] = useState('')

  const submitHandler = () => {
    const otpNumber = `${pin1}${pin2}${pin3}${pin4}`

    verifyOtp
      .mutateAsync({ otp: otpNumber, _id: route.params?._id })
      .then((res) => {
        signIn(res)
      })
      .catch((err) => {
        console.log(err)
      })

    // navigation.navigate('ResetPassword')
  }

  return (
    <ScrollView>
      <KeyboardAvoidWrapper>
        <Spinner visible={verifyOtp?.isLoading} />
        <FlashMessage
          position='top'
          style={{
            alignItems: 'center',
          }}
        />
        <View className='mx-5'>
          <Text className='text-center'>
            Use this code,
            <Text className='font-bold'> {route?.params?.otp}</Text>, to log in
            temporarily.
          </Text>
          <Text className='text-center font-bold text-2xl mb-2'>
            OTP Verification
          </Text>
          <Text className='text-center my-2'>
            {`We've send an SMS with an OTP code to your phone`}{' '}
            <Text className='font-bold'>{route.params?.mobileNumber}</Text>
          </Text>

          <View className='my-2 flex-row'>
            <TextInput
              ref={pin1Ref}
              onChangeText={(pin) => {
                setPin1(pin)
                if (pin1 !== null) {
                  pin2Ref.current.focus()
                }
              }}
              value={pin1}
              autoFocus={true}
              name='one'
              keyboardType='number-pad'
              className='bg-white py-4 border border-purple-800 w-14 mx-auto text-center'
            />
            <TextInput
              ref={pin2Ref}
              onChangeText={(pin) => {
                setPin2(pin)
                if (pin2 !== null) {
                  pin3Ref.current.focus()
                }
              }}
              value={pin2}
              autoFocus={false}
              name='one'
              keyboardType='number-pad'
              className='bg-white py-4 border border-purple-800 w-14 mx-auto text-center'
            />
            <TextInput
              ref={pin3Ref}
              onChangeText={(pin) => {
                setPin3(pin)
                if (pin3 !== null) {
                  pin4Ref.current.focus()
                }
              }}
              value={pin3}
              autoFocus={false}
              name='one'
              keyboardType='number-pad'
              className='bg-white py-4 border border-purple-800 w-14 mx-auto text-center'
            />
            <TextInput
              ref={pin4Ref}
              onChangeText={(pin) => setPin4(pin)}
              value={pin4}
              autoFocus={false}
              name='one'
              keyboardType='number-pad'
              className='bg-white py-4 border border-purple-800 w-14 mx-auto text-center'
            />
          </View>

          <View className='my-2'>
            <TouchableOpacity
              disabled={pin1 && pin2 && pin3 && pin4 ? false : true}
              onPress={() => submitHandler()}
              className='p-2.5 bg-purple-800'
            >
              {verifyOtp?.isLoading ? (
                <ActivityIndicator size='small' color='#fff' />
              ) : (
                <Text className='text-white uppercase text-center'>
                  Confirm OTP
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidWrapper>
    </ScrollView>
  )
}

export default OTP
