'use client'

import { configureStore } from '@reduxjs/toolkit'

import sendMessageReducer from './sendMessage/sendMessageSlice'

import gameSlice from './game/gameSlice'
import searchSlice from './search/searchSlice'

import authReducer from './auth'
import roomsReducer from './rooms/roomsRedux'
import messagesReducer from './rooms/messageRedux'
import conversationSliceReducer from "./conversation/conversationSlice"

import navbarReducer from "./navbar/navbarSlice"

export const store = configureStore({
  reducer: {
    sendMessage: sendMessageReducer,
    game: gameSlice,
    search: searchSlice,
    
    auth: authReducer,
    rooms: roomsReducer,
    messages: messagesReducer,
    conversation: conversationSliceReducer,
    navbar: navbarReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch