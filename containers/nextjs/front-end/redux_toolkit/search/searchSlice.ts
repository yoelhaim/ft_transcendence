
'use client '

import { createSlice } from '@reduxjs/toolkit'


export interface SearchState {
    isSearchOpen: boolean,
}

const initialState: SearchState = {
    isSearchOpen: false,
}

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    openSearch: (state) => {
      state.isSearchOpen = true
    },
    closeSearch: (state) => {
      state.isSearchOpen = false
    },
  },
})

export const { openSearch, closeSearch } = searchSlice.actions

export default searchSlice.reducer