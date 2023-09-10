
'use client '

import { createSlice } from '@reduxjs/toolkit'


export interface HistoryState {
    userLogin: string,
}

const initialState: HistoryState = {
    userLogin: '',
}

export const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    setUserName: (state, action) => {
        state.userLogin = action.payload;
    }
  },
})

export const { setUserName } = historySlice.actions

export default historySlice.reducer