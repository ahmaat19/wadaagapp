import React from 'react'
import { Controller } from 'react-hook-form'
import { Text, TextInput, View } from 'react-native'

const CustomInput = ({
  textContentType,
  keyboardType = 'default',
  placeholder,
  name,
  control,
  className = 'bg-white p-2.5',
  autoFocus = false,
  secureTextEntry = false,
  rules = {},
  editable = true,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error },
      }) => (
        <>
          <TextInput
            value={value}
            autoFocus={autoFocus}
            onChangeText={onChange}
            onBlur={onBlur}
            className={`${className} ${
              error ? 'border border-purple-700' : 'border border-white'
            } `}
            placeholder={placeholder}
            keyboardType={keyboardType}
            textContentType={textContentType}
            secureTextEntry={secureTextEntry}
            editable={editable}
          />
          {error && (
            <Text className='text-red-500 text-xs'>
              {error?.message || 'Error'}
            </Text>
          )}
        </>
      )}
    />
  )
}

export default CustomInput
