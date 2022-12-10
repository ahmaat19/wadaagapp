import { View, Text } from 'react-native'
import React from 'react'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'

const Contact = () => {
  const user = {
    name: 'Ahmed Ibrahim',
    email: 'info@ahmedibra.com',
    mobile: '615301507',
    role: 'DRIVER',
    image: 'https://github.com/ahmaat19.png',
  }

  return (
    <ScrollView>
      <View className='py-3 px-5'>
        <Text className='mb-2'>Hi, {user?.name}</Text>
        <Text className=' mb-4'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit libero
          non corrupti! Cupiditate sit, ut iusto nihil, beatae quibusdam ea id
          nostrum quidem, ratione sapiente in! A fugit neque atque.
        </Text>

        <Text className='mb-3'>
          If you need any support please contact us through:
        </Text>

        <View className='flex justify-between mt-5'>
          <TouchableOpacity className='mb-2 flex-row items-center  bg-white-50 px-2 py-3'>
            <FontAwesome5 name='phone-alt' size={24} color='#7e287e' />
            <Text className='ml-2'>+252 (0) 61 530 1507</Text>
          </TouchableOpacity>
          <TouchableOpacity className='mb-2 flex-row items-center  bg-white-50 px-2 py-3'>
            <FontAwesome5 name='facebook-messenger' size={24} color='#7e287e' />
            <Text className='ml-2'>@wadaagapp</Text>
          </TouchableOpacity>
          <TouchableOpacity className='mb-2 flex-row items-center  bg-white-50 px-2 py-3'>
            <FontAwesome5 name='envelope' size={24} color='#7e287e' />
            <Text className='ml-2'>info@wadaag.app</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

export default Contact
