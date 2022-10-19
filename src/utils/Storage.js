// import AsyncStorage from '@react-native-async-storage/async-storage'

// export const storeData = async (value) => {
//   try {
//     const jsonValue = JSON.stringify(value)
//     await AsyncStorage.setItem('@userInfo', jsonValue)
//   } catch (e) {
//     console.log(e)
//     throw e
//   }
// }

// export const getData = async () => {
//   try {
//     const jsonValue = await AsyncStorage.getItem('@userInfo')

//     return jsonValue != null ? JSON.parse(jsonValue) : null
//   } catch (e) {
//     console.log(e)
//     throw e
//   }
// }

// export const removeData = async () => {
//   try {
//     await AsyncStorage.removeItem('@userInfo')
//   } catch (e) {
//     console.log(e)
//     throw e
//   }
// }

import * as SecureStore from 'expo-secure-store'

export const bootstrapAsync = async () => {
  let userInfo

  try {
    userInfo = JSON.parse(await SecureStore.getItemAsync('userInfo'))
    return userInfo
  } catch (error) {
    console.log(error)
  }
  dispatch({ type: 'RESTORE_TOKEN', userInfo: userInfo })
}
