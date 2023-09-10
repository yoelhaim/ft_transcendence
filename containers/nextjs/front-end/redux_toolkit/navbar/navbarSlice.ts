
'use client'

import { createSlice } from '@reduxjs/toolkit'


export interface navbarState {
    showHide: boolean,
}

const initialState: navbarState = {
    showHide: true,
}

export const navbarSlice = createSlice({
  name: 'navbar',
  initialState,
  reducers: {
    setShowHide: (state) => {
        state.showHide = !state.showHide
    }
  },
})

export const { setShowHide } = navbarSlice.actions

export default navbarSlice.reducer