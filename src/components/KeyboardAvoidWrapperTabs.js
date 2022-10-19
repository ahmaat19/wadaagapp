import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import React from 'react'

const windowHeight = Dimensions.get('window').height

export default function KeyboardAvoidWrapperTabs({ children }) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          className=''
          style={{
            flex: 1,
            justifyContent: 'center',
            height: windowHeight - 150,
          }}
        >
          {children}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}
