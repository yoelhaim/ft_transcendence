import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type data = {
  id: number;
  firstName: string;
  lastName: string;
  lastLogin: string;
  Avatar: string;
  updatedAt: string;
};
type message = {
  id: number;
  message: string;
};
interface UserInformation {
  // bio: string,
  data: data;
  message: message;
}

export interface ConversationState {
  id: string;
  avatar: string;
  fullName: string;
  bio: string;
  chatId: number;
  listFreind: UserInformation[];
}

const initialState: ConversationState = {
  id: '',
  avatar: 'https://i.ibb.co/9v43Tw5/c6e65a891e8c.png',
  fullName: '',
  bio: '',
  chatId: 0,
  listFreind: [] as UserInformation[],
};

export const conversation = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.id = action.payload.id;
      state.avatar = action.payload.avatar;
      state.fullName = action.payload.fullName;
      state.bio = action.payload.bio;
    },
    setChanellId: (state, action: PayloadAction<number>) => {
      state.chatId = action.payload;
    },
    setListFriend: (state, action: PayloadAction<UserInformation[]>) => {
      state.listFreind = action.payload;
    },
    changeLastMessage: (state, action: PayloadAction<any>) => {
      
      for (let i = 0; i < state.listFreind.length; i++) {
        if (state.listFreind[i].data.id === action.payload.id) {
          state.listFreind[i].message.message = action.payload.message;
          state.listFreind[i].message.id = action.payload.msgId;
          break;
        }
      }
      state.listFreind.sort((a, b) => {
        return Number(b.message.id) - a.message?.id;
      });
    },
    resetAllCover: ()=> initialState
  },
});

export const { setUser, setChanellId, setListFriend, changeLastMessage, resetAllCover } =
  conversation.actions;

export default conversation.reducer;
