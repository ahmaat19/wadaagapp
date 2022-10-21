import { useEffect } from 'react'
import { useRef, useState } from 'react'
import { Platform } from 'react-native'
import { io } from 'socket.io-client'

export const useWebSocket = ({ userId, enabled, onConnected }) => {
  const ref = useRef()
  const [message, setMessage] = useState(null)

  const send = (msg) => {
    ref.current.emit('message', msg)
  }

  const receive = () => {
    ref.current.on('message', (msg) => {
      setMessage(msg)
    })
  }

  useEffect(() => {
    if (!enabled) return

    const baseUrl =
      Platform.OS === 'android'
        ? 'http://10.0.2.2:3000'
        : 'http://localhost:3000'

    const socket = io(baseUrl)

    socket.emit('joinRoom', userId)

    socket.emit('message', (msg) => {
      setMessage(msg)
    })

    socket.on('disconnect', () => {
      console.log('disconnected')
    })

    socket.on('connect', () => {
      if (onConnected) {
        onConnected()
      }
    })

    socket.on('reconnect', () => {
      socket.emit('joinRoom', userId)
    })

    ref.current = socket

    return () => socket.disconnect()
  }, [enabled, userId])

  return {
    send,
    receive,
    message,
  }
}
