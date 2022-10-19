import { View, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import ChatItem from '../components/ChatItem'

const ChatList = ({ navigation }) => {
  const chatHistories = [
    {
      _id: '1',
      name: 'John Smith',
      lastMessage: 'Hi there!',
      createdAt: new Date(),
      image: 'https://github.com/ok.png',
    },
    {
      _id: '2',
      name: 'John Doe',
      lastMessage: "Let's go!",
      createdAt: new Date(),
      image: 'https://github.com/mostafa.png',
    },
    {
      _id: '3',
      name: 'Ahmed Ibrahim',
      lastMessage: 'It has 28 days left before it expires.',
      createdAt: new Date(),
      image: 'https://github.com/ahmaat19.png',
    },
  ]
  return (
    <View className='py-3'>
      <FlatList
        data={chatHistories}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Chat', { _id: item._id, name: item?.name })
            }
            className='bg-white mb-0.5 px-5'
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
