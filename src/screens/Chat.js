import {
  View,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { FontAwesome5 } from '@expo/vector-icons'

const Chat = ({ navigation, route }) => {
  const [text, setText] = useState('')
  useEffect(() => {
    navigation.setOptions({
      headerTitle: route?.params?.name,
    })
  }, [])

  const chats = [
    {
      _id: '1',
      message: 'Hello,',
    },
    {
      _id: '1',
      message: 'How are you?',
    },
    {
      _id: '2',
      message: "I'm good",
    },
    {
      _id: '1',
      message: 'Bye',
    },
  ]
  const currentUser = '1'

  const windowHeight = Dimensions.get('window').height

  const handleSend = () => {
    console.log('text', text)
    setText('')
  }

  return (
    <ScrollView>
      <View className=''>
        <View className='py-3' style={{ height: windowHeight - 180 }}>
          {chats?.map((chat, index) => (
            <View key={index}>
              <View
                className={` px-5  py-1 ${
                  currentUser === chat?._id ? 'items-end' : 'items-start '
                }`}
              >
                <View
                  className={`${
                    currentUser === chat?._id ? 'bg-white' : 'bg-purple-200 '
                  } py-3 px-3 rounded-lg max-w-80`}
                >
                  <Text className=''>{chat?.message}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View className='px-5 flex-row h-24  items- justify-center pt-5'>
            <TextInput
              onChangeText={(v) => setText(v)}
              value={text}
              style={{ flex: 1 }}
              className='bg-white px-3 py-3 rounded-lg mr-2 h-12'
              placeholder='Hello Ahmed,'
            />
            <TouchableOpacity
              onPress={() => handleSend()}
              className='justify-center items-center h-12'
            >
              <FontAwesome5 name='paper-plane' size={34} color='#6b21a8' />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </ScrollView>
  )
}

export default Chat
