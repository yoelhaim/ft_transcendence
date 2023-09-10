
'use client '

import { createSlice } from '@reduxjs/toolkit'


export interface MsgState {
    isOpen: boolean,
}

const initialState: MsgState = {
  isOpen: false,
}

export const sendMessageSlice = createSlice({
  name: 'sendMessage',
  initialState,
  reducers: {
    open: (state) => {
      state.isOpen = true
    },
    close: (state) => {
      state.isOpen = false
    }
  },
})

export const { open, close } = sendMessageSlice.actions

export default sendMessageSlice.reducer