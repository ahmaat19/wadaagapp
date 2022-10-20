import { NavigationContainer } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as SecureStore from 'expo-secure-store'
import React, { useEffect, useMemo, useReducer } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Home from './src/screens/Home'
import Login from './src/screens/Login'
import Register from './src/screens/Register'
import ForgetPassword from './src/screens/ForgetPassword'
import ResetPassword from './src/screens/ResetPassword'
import Setting from './src/screens/Setting'
import Splash from './src/screens/Splash'
import Profile from './src/screens/Profile'
import AccountInformation from './src/screens/AccountInformation'
import Transaction from './src/screens/Transaction'
import Contact from './src/screens/Contact'
import ChatList from './src/screens/ChatList'
import Chat from './src/screens/Chat'
import Subscription from './src/screens/Subscription'

import { AuthContext } from './src/AuthContext'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { FontAwesome5 } from '@expo/vector-icons'
import OTP from './src/screens/OTP'
import Driver from './src/screens/Driver'
import Admin from './src/screens/Admin'
import Map from './src/screens/Map'
import Riders from './src/screens/Riders'

const queryClient = new QueryClient()
const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

export const MyTabs = ({ navigation }) => {
  useEffect(() => {
    SecureStore.getItemAsync('userInfo')
      .then((data) => {
        const parsed = JSON.parse(data.toString())

        if (parsed.userType === 'admin') {
          navigation.navigate('Admin')
        }
        if (parsed.userType === 'driver') {
          navigation.navigate('Driver')
        }
      })
      .catch((err) => console.log(err))
  }, [])

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName

          if (route.name === 'Home') {
            iconName = 'home'
          } else if (route.name === 'Setting') {
            iconName = 'cog'
          }

          return <FontAwesome5 name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: '#6b21a8',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name='Home'
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen name='Setting' component={Setting} />

      {/* <Tab.Screen
        options={{ headerShown: true, headerTitle: 'Chatting History' }}
        name='ChatList'
        component={ChatList}
      /> */}
    </Tab.Navigator>
  )
}

export default function App() {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userInfo: action.payload,
            isLoading: false,
          }

        case 'SIGN_IN':
          return {
            ...prevState,
            isSignOut: false,
            userInfo: action.payload,
          }
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignOut: true,
            userInfo: null,
          }
      }
    },
    {
      isLoading: true,
      isSignOut: false,
      userInfo: null,
    }
  )

  useEffect(() => {
    SecureStore.getItemAsync('userInfo')
      .then((data) => {
        const parsed = JSON.parse(data)
        dispatch({ type: 'RESTORE_TOKEN', payload: parsed })
      })
      .catch((err) => console.log(err))
  }, [])

  const authContext = useMemo(
    () => ({
      signIn: async (data) => {
        try {
          await SecureStore.setItemAsync('userInfo', JSON.stringify(data))
        } catch (error) {
          console.log(error)
        }

        dispatch({ type: 'SIGN_IN', payload: data })
      },
      signOut: async () => {
        try {
          await SecureStore.deleteItemAsync('userInfo')
        } catch (error) {
          console.log(error)
        }
        dispatch({ type: 'SIGN_OUT' })
      },
      signUp: async (data) => {
        dispatch({ type: 'SIGN_IN', payload: data })
      },
    }),
    []
  )

  return (
    <SafeAreaProvider>
      <StatusBar style='auto' />
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          <QueryClientProvider client={queryClient}>
            <Stack.Navigator
            // initialRouteName='Riders'
            >
              {state.isLoading ? (
                <Stack.Screen
                  options={{ headerShown: false }}
                  name='Splash'
                  component={Splash}
                />
              ) : state.userInfo ? (
                <>
                  <Stack.Screen
                    options={{ headerShown: false, headerTitle: 'Back' }}
                    name='HomeTabs'
                    component={MyTabs}
                  />
                  <Stack.Screen
                    options={{ headerShown: true }}
                    name='Profile'
                    component={Profile}
                  />
                  <Stack.Screen
                    options={{
                      headerShown: true,
                      headerTitle: 'Account Information',
                    }}
                    name='AccountInformation'
                    component={AccountInformation}
                  />
                  <Stack.Screen
                    options={{ headerShown: true }}
                    name='Transaction'
                    component={Transaction}
                  />
                  <Stack.Screen
                    options={{ headerShown: true }}
                    name='Contact'
                    component={Contact}
                  />
                  <Stack.Screen
                    options={{ headerShown: true }}
                    name='ChatList'
                    component={ChatList}
                  />
                  <Stack.Screen
                    options={{
                      headerShown: true,
                      headerBackTitle: 'Back',
                    }}
                    name='Chat'
                    component={Chat}
                  />
                  <Stack.Screen
                    options={{
                      headerShown: true,
                      headerLeft: false,
                    }}
                    name='Driver'
                    component={Driver}
                  />
                  <Stack.Screen
                    options={{
                      headerShown: true,
                      headerLeft: false,
                      headerTitle: 'Admin',
                    }}
                    name='Admin'
                    component={Admin}
                  />
                  <Stack.Screen
                    options={{
                      headerShown: true,
                      headerLeft: false,
                      headerTitle: 'Subscription',
                    }}
                    name='Subscription'
                    component={Subscription}
                  />
                  <Stack.Screen
                    options={{
                      headerShown: false,
                      headerLeft: false,
                      headerTitle: 'Map',
                    }}
                    name='Map'
                    component={Map}
                  />
                  <Stack.Screen
                    options={{
                      headerShown: true,
                      headerLeft: false,
                      headerTitle: 'Riders',
                    }}
                    name='Riders'
                    component={Riders}
                  />
                </>
              ) : (
                <>
                  <Stack.Screen
                    options={{ headerShown: false }}
                    name='Login'
                    component={Login}
                  />
                  <Stack.Screen
                    options={{ headerShown: false }}
                    name='OTP'
                    component={OTP}
                  />
                  <Stack.Screen
                    options={{ headerShown: false }}
                    name='Register'
                    component={Register}
                  />
                  <Stack.Screen
                    options={{ headerShown: false }}
                    name='ForgetPassword'
                    component={ForgetPassword}
                  />
                  <Stack.Screen
                    options={{ headerShown: false }}
                    name='ResetPassword'
                    component={ResetPassword}
                  />
                </>
              )}
            </Stack.Navigator>
          </QueryClientProvider>
        </NavigationContainer>
      </AuthContext.Provider>
    </SafeAreaProvider>
  )
}
