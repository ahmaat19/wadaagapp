import axios from 'axios'
import * as SecureStore from 'expo-secure-store'

// const baseUrl = 'http://167.71.227.199/api'
// const baseUrl = 'http://192.10.11.100:3000/api'
const baseUrl = 'http://localhost:3000/api'

const storage = async () => {
  try {
    const res = await SecureStore.getItemAsync('userInfo')
    const parsed = JSON.parse(res)
    return parsed.token
  } catch (error) {
    console.log(error)
  }
}

const axiosApi = async (method, url, obj = {}) => {
  try {
    const token = await storage()
    switch (method) {
      case 'GET':
        return await axios
          .get(`${baseUrl}/${url}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => res.data)

      case 'POST':
        return await axios
          .post(`${baseUrl}/${url}`, obj, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => res.data)

      case 'PUT':
        return await axios
          .put(`${baseUrl}/${url}`, obj, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => res.data)

      case 'DELETE':
        return await axios
          .delete(`${baseUrl}/${url}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => res.data)
    }
  } catch (error) {
    throw error?.response?.data?.error
  }
}

export default axiosApi
