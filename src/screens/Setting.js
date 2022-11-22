import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useContext, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { AuthContext } from '../AuthContext'
import ListItem from '../components/ListItem'
import * as SecureStore from 'expo-secure-store'

const Setting = ({ navigation }) => {
  const { signOut } = useContext(AuthContext)
  const [userInfo, setUserInfo] = useState(null)

  useFocusEffect(
    useCallback(() => {
      SecureStore.getItemAsync('userInfo')
        .then((res) => setUserInfo(JSON.parse(res)))
        .catch((err) => console.log(err))
    }, [])
  )

  let items = [
    {
      label: 'Account Settings',
      info: [
        {
          icon: 'user-circle',
          label: 'Profile',
          screen: 'Profile',
        },
        // {
        //   icon: 'file-alt',
        //   label: 'Account Information',
        //   screen: 'AccountInformation',
        // },
      ],
    },
    userInfo?.role === 'RIDER' && {
      label: 'Payments',
      info: [
        {
          icon: 'receipt',
          label: 'Transaction',
          screen: 'Transaction',
        },
      ],
    },
    {
      label: 'Contact Us',
      info: [
        {
          icon: 'phone-alt',
          label: '+252 (0) 61 093 7744',
          type: 'phone',
        },
        {
          icon: 'envelope',
          label: 'wadaagapp@gmail.com',
          type: 'email',
        },
        {
          icon: 'whatsapp',
          label: 'WhatsApp',
          type: 'whatsapp',
        },
      ],
    },
    {
      label: 'Logout',
      info: [
        {
          icon: 'power-off',
          label: 'Logout',
        },
      ],
    },
  ]
  const onPressHandler = (item) => {
    if (item?.screen) {
      return navigation.navigate(item?.screen)
    }

    if (item?.type) {
      let url
      if (item.type == 'phone') {
        return (url = 'tel//:0610937744')
      }
      if (item.type == 'email') {
        return (url = 'mailto//:wadaagapp@gmail.com')
      }
      if (item.type == 'whatsapp') {
        return (url = `whatsapp://send?text=Mobile:${userInfo?.mobile};Name:${userInfo?.name};role:${userInfo?.role};Plate:${userInfo?.plate}&phone=+252610937744`)
      }
      return Linking.openURL(url)
        .then((r) => console.log(r))
        .catch((e) => console.log(e))
    }

    signOut()
  }
  return (
    <ScrollView className='py-3'>
      {items?.map((item, index) => (
        <View key={index} className='mb-3'>
          <Text className='mb-1 px-5'>{item?.label}</Text>
          {item?.info?.map((i, idx) => (
            <TouchableOpacity
              onPress={() => onPressHandler(i)}
              key={idx}
              className='bg-white-50 mb-0.5 px-5'
            >
              <ListItem item={i} />
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </ScrollView>
  )
}

export default Setting
