import { View, KeyboardAvoidingView, Platform, Dimensions } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store'

import { GiftedChat } from 'react-native-gifted-chat'
import { useWebSocket } from '../hook/useWebSocket'
import 'react-native-get-random-values'
import { useReducer } from 'react'
import { chatReducer, INITIAL_STATE } from '../chatReducer'
import apiHook from '../api'
import FlashMessage, { showMessage } from 'react-native-flash-message'
import Spinner from 'react-native-loading-spinner-overlay'

const Chat = ({ navigation, route }) => {
  const [userInfo, setUserInfo] = useState(null)

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE)

  useEffect(() => {
    SecureStore.getItemAsync('userInfo')
      .then((res) => setUserInfo(JSON.parse(res)))
      .catch((err) => console.log(err))
  }, [])

  useEffect(() => {
    navigation.setOptions({
      headerTitle: route?.params?.name,
    })
  }, [])

  const chat = apiHook({
    key: 'get-chat',
    method: 'GET',
    url: `chats/${route.params?._id}`,
  })?.get

  const newChat = apiHook({
    key: 'new-chat',
    method: 'POST',
    url: `chats`,
  })?.post

  useEffect(() => {
    if (chat?.isError || newChat?.isError) {
      showMessage({
        message: chat?.error,
        type: 'danger',
      })
    }
  }, [chat?.error, newChat?.error])

  const { message, send, receive } = useWebSocket({
    userId: '1',
    enabled: Boolean(state.messages),
    onConnected: () => {},
  })

  useEffect(() => {
    receive()

    if (!message) return

    chat?.refetch()
  }, [message])
  const onSend = useCallback((messages = []) => {
    newChat
      .mutateAsync({ ...messages[0], secondUser: route.params?._id })
      .then((res) => {
        send(messages[0])
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  const height = Dimensions.get('screen').height
  return (
    <>
      <FlashMessage
        position='top'
        style={{
          alignItems: 'center',
        }}
      />
      <Spinner visible={chat?.isLoading || newChat?.isLoading} />
      {!chat?.isLoading && !chat?.isError && (
        <View style={{ flex: 1 }}>
          <GiftedChat
            messages={chat.data}
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
          {Platform.OS === 'android' && (
            <KeyboardAvoidingView behavior='padding' />
          )}
        </View>
      )}
    </>
  )
}

export default Chat
