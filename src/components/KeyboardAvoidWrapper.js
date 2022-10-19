import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import React from 'react'

export default function KeyboardAvoidWrapper({ children }) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className='flex-1 justify-center h-screen'>{children}</View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}
