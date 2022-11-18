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
        {
          icon: 'file-alt',
          label: 'Account Information',
          screen: 'AccountInformation',
        },
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
      label: 'Contact Details',
      info: [
        {
          icon: 'phone-alt',
          label: 'Call',
          screen: 'Contact',
        },
        {
          icon: 'envelope',
          label: 'Email Address',
          screen: 'Contact',
        },
        {
          icon: 'facebook-messenger',
          label: 'Live Chat',
          screen: 'Contact',
        },
      ],
    },
    // {
    //   label: 'Complaints',
    //   info: [
    //     {
    //       icon: 'pen',
    //       label: 'Complaints',
    //     },
    //   ],
    // },
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


  return (
    <ScrollView className='py-3'>
      {items?.map((item, index) => (
        <View key={index} className='mb-3'>
          <Text className='mb-1 px-5'>{item?.label}</Text>
          {item?.info?.map((i, idx) => (
            <TouchableOpacity
              onPress={() =>
                i?.screen ? navigation.navigate(i?.screen) : signOut()
              }
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
