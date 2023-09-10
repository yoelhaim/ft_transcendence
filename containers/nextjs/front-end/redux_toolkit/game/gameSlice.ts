
'use client '

import { createSlice } from '@reduxjs/toolkit'


export interface GameState {
    blueResult: number,
    redResult: number,
    isGameFinshed: boolean,
    blueAvatar: string,
    redAvatar: string,
}

const initialState: GameState = {
    blueResult: 0,
    redResult: 0,
    isGameFinshed: false,
    blueAvatar: '/images/random/1.jpg',
    redAvatar: '/images/random/2.jpg',
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    blue: (state) => {
      state.blueResult += 1
    },
    red: (state) => {
      state.redResult += 1
    },
    gameFinshed: (state) => {
      state.isGameFinshed = true
    }
  },
})

export const { blue, red, gameFinshed } = gameSlice.actions

export default gameSlice.reducer