import { View, Dimensions, Button, TouchableOpacity, Text } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store'

import { GiftedChat } from 'react-native-gifted-chat'
import { useWebSocket } from '../hook/useWebSocket'
import 'react-native-get-random-values'
import { useReducer } from 'react'
import { chatReducer, INITIAL_STATE } from '../chatReducer'
import apiHook from '../api'
import Toast from 'react-native-toast-message'
import Spinner from 'react-native-loading-spinner-overlay'
import moment from 'moment/moment'

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
      Toast.show({
        type: 'error',
        text1: chat?.error || newChat?.error,
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
        chat?.refetch()
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  const height = Dimensions.get('screen').height

  const rider2 = chat?.data?.[0]

  const sendRequest = () => {
    onSend([
      {
        _id: '18fd061e-baab-4695-8edf-d2f1df485f0e',
        createdAt: moment().format(),
        text: 'Asckm',
        user: {
          _id: userInfo?._id,
          name: userInfo?.name,
          avatar: userInfo?.avatar,
        },
      },
    ])
  }

  const acceptRequest = () => {
    onSend([
      {
        _id: '18fd061e-baab-4695-8edf-d2f1df485f2e',
        createdAt: moment().format(),
        text: 'Wcslm',
        user: {
          _id: userInfo?._id,
          name: userInfo?.name,
          avatar: userInfo?.avatar,
        },
      },
    ])
  }

  return (
    <>
      <Toast />
      <Spinner visible={chat?.isLoading || newChat?.isLoading} />

      {rider2?.text !== 'Asckm' && (
        <View className='flex-row justify-center items-center flex-1 m-5'>
          <TouchableOpacity
            onPress={() => sendRequest()}
            className='bg-purple-50 p-3 w-full'
          >
            <Text className='text-white-50 font-bold text-center uppercase'>
              Send Request
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {chat?.data?.length < 2 &&
        rider2?.text === 'Asckm' &&
        rider2?.user?._id === userInfo?._id && (
          <View className='flex-row justify-center items-center flex-1 m-5'>
            <TouchableOpacity className='bg-purple-50 p-3 w-full'>
              <Text className='text-white-50 font-bold text-center uppercase'>
                Request has been sent
              </Text>
            </TouchableOpacity>
          </View>
        )}

      {chat?.data?.length < 2 &&
        rider2?.text === 'Asckm' &&
        rider2?.user?._id !== userInfo?._id && (
          <View className='flex-row justify-center items-center flex-1 m-5'>
            <TouchableOpacity
              onPress={() => acceptRequest()}
              className='bg-purple-50 p-3 w-full'
            >
              <Text className='text-white-50 font-bold text-center uppercase'>
                Accept Request
              </Text>
            </TouchableOpacity>
          </View>
        )}

      {!chat?.isLoading && !chat?.isError && (
        <View style={{ flex: 1 }}>
          <GiftedChat
            disableComposer={
              chat?.data?.length < 2 && rider2?.text === 'Asckm' ? true : false
            }
            messages={
              chat?.data?.length < 2 && rider2?.text === 'Asckm'
                ? []
                : chat.data
            }
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
        </View>
      )}
    </>
  )
}

export default Chat
