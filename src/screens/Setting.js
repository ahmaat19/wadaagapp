import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Linking, Text, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { AuthContext } from '../AuthContext'
import ListItem from '../components/ListItem'
import * as SecureStore from 'expo-secure-store'
import apiHook from '../api'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import Spinner from 'react-native-loading-spinner-overlay'

const Setting = ({ navigation }) => {
  const { signOut } = useContext(AuthContext)
  const [userInfo, setUserInfo] = useState(null)

  const accountDeletion = apiHook({
    key: 'request-deletion',
    method: 'POST',
    url: 'accounts/request-deletion',
  })?.post
  const cancelDeletion = apiHook({
    key: 'cancel-deletion',
    method: 'POST',
    url: 'accounts/cancel-request-deletion',
  })?.post

  useEffect(() => {
    if (accountDeletion?.isError) {
      Toast.show({
        type: 'error',
        text1: accountDeletion?.error,
      })
    }
  }, [accountDeletion?.error])

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
          label: '+252 (0) 61 947 6191',
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
    userInfo?.status !== 'deleted' && {
      label: 'Dangerous Zone',
      info: [
        {
          icon: 'trash',
          label: 'Delete Account',
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
        return (url = 'telprompt: 0619476191')
      }
      if (item.type == 'email') {
        return (url = 'mailto//:wadaagapp@gmail.com')
      }
      if (item.type == 'whatsapp') {
        return (url = `whatsapp://send?text=Mobile:${userInfo?.mobile};Name:${userInfo?.name};role:${userInfo?.role};Plate:${userInfo?.plate}&phone=+252619476191`)
      }
      return Linking.openURL(url)
        .then((r) => console.log(r))
        .catch((e) => console.log(e))
    }

    if (item?.label === 'Logout') {
      signOut()
    }
    if (item?.label === 'Delete Account') {
      accountDeletion
        .mutateAsync(userInfo)
        .then((res) => {
          // console.log(res)

          const newValue = { ...userInfo, status: res.status }

          SecureStore.setItemAsync('userInfo', JSON.stringify(newValue))
            .then((v) => setUserInfo(newValue))
            .catch((err) => err)
        })

        .catch((err) => {
          console.log(err)
        })
    }
  }

  const cancelRequestDeletion = () => {
    cancelDeletion
      .mutateAsync(userInfo)
      .then((res) => {
        const newValue = { ...userInfo, status: res.status }

        SecureStore.setItemAsync('userInfo', JSON.stringify(newValue))
          .then((v) => setUserInfo(newValue))
          .catch((err) => err)
      })

      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <>
      <View className='z-10'>
        <Toast />
      </View>
      <Spinner
        visible={accountDeletion?.isLoading || cancelDeletion?.isLoading}
      />
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
        <View className='p-5'>
          {userInfo?.status === 'deleted' && (
            <>
              <Text className='text-red-500'>
                Your account will be deleted within 24 hours.
              </Text>
              <TouchableOpacity onPress={cancelRequestDeletion}>
                <Text className='text-blue-500'>Cancel request.</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </>
  )
}

export default Setting
