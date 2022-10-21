import { View, KeyboardAvoidingView, Platform, Dimensions } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store'

import { GiftedChat } from 'react-native-gifted-chat'
import { useWebSocket } from '../hook/useWebSocket'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'
import { useReducer } from 'react'
import { chatReducer, INITIAL_STATE } from '../chatReducer'

const Chat = ({ navigation, route }) => {
  const [userInfo, setUserInfo] = useState(null)

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE)

  useEffect(() => {
    SecureStore.getItemAsync('userInfo')
      .then((res) => setUserInfo(JSON.parse(res)))
      .catch((err) => console.log(err))
  }, [])

  const { message, send, receive } = useWebSocket({
    userId: '1',
    enabled: Boolean(state.messages),
    onConnected: () => {},
  })

  useEffect(() => {
    receive()

    if (!message) return

    dispatch({
      type: 'FETCH_CHATS',
      payload: {
        _id: uuidv4(),
        text: message?.text,
        createdAt: message?.createdAt,
        user: message?.user,
      },
    })
  }, [message])
  const onSend = useCallback((messages = []) => {
    send(messages[0])
  }, [])

  useEffect(() => {
    navigation.setOptions({
      headerTitle: route?.params?.name,
    })
  }, [])

  const height = Dimensions.get('screen').height
  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={state?.messages}
        showAvatarForEveryMessage={true}
        inverted={false}
        maxInputLength={height}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: userInfo?._id,
          name: userInfo?.name,
          avatar: userInfo?.avatar,
        }}
      />
      {Platform.OS === 'android' && <KeyboardAvoidingView behavior='padding' />}
    </View>
  )
}

export default Chat
