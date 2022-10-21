export const INITIAL_STATE = {
  messages: [],
}

export const chatReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_CHATS':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      }

    default:
      return state
  }
}
