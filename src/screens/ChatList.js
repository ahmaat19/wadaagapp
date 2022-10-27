import { View, FlatList, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import ChatItem from '../components/ChatItem'
import apiHook from '../api'
import Spinner from 'react-native-loading-spinner-overlay'
import { useFocusEffect } from '@react-navigation/native'
import Toast from 'react-native-toast-message'

const ChatList = ({ navigation }) => {
  const chatHistory = apiHook({
    key: 'chat',
    method: 'GET',
    url: `chats/histories`,
  })?.get

  useFocusEffect(
    useCallback(() => {
      chatHistory.refetch()
    }, [])
  )

  useEffect(() => {
    if (chatHistory?.isError) {
      Toast.show({
        type: 'error',
        text1: chatHistory?.error,
      })
    }
  }, [chatHistory?.error])

  return (
    <View className='py-3'>
      <Toast />
      <Spinner visible={chatHistory?.isLoading} />

      <FlatList
        data={chatHistory?.data?.data}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Chat', { _id: item._id, name: item?.name })
            }
            className='bg-white-50 mb-0.5 px-5'
          >
            <ChatItem item={item} />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item?._id}
      />
    </View>
  )
}

export default ChatList
