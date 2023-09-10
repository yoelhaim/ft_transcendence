import MessagetTypeDto from '@/components/chat/dtoMessage';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface Message {
  messages: MessagetTypeDto[];
  isLoad: boolean;
  notFound: boolean;
  locked: boolean;
  onLoaddata: boolean;
  roomId: number;
  typing: string | null;
}
const initialState: Message = {
  messages: [] as MessagetTypeDto[],
  isLoad: true,
  locked: false,
  notFound: false,
  onLoaddata: true,
  roomId: 0,
  typing: null,
};

export const MessageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<MessagetTypeDto>) => {
      if (action.payload.roomId !== state.roomId) return;
      state.messages.unshift(action.payload);
      state.notFound = false;
    },
    fetchMessage: (state, action: PayloadAction<MessagetTypeDto[]>) => {
      state.messages = action.payload;
    },
    initailIdRoom: (state, action: PayloadAction<number>) => {
      state.roomId = action.payload;
    },
    lockedAction: (state, action: PayloadAction<boolean>) => {
      state.locked = action.payload;
      state.onLoaddata = false;
    },
    setFoundRoom: (state, action: PayloadAction<any>) => {
      if (state.roomId === parseInt(action.payload.roomId)) {
        state.onLoaddata = false;
        state.notFound = action.payload.type;
      }
    },
    settyping: (state, action: PayloadAction<string | null>) => {
      state.typing = action.payload;
    },
    clearMesages: (state) => {
      return (state = {
        ...state,
        messages: [],
      });
    },
    resetAllMesage: () => initialState,
  },
  //   extraReducers: (build)=> {
  //     build.addCase(MyfetchMessages.pending, (state)=>{
  //
  //     })
  //     build.addCase(MyfetchMessages.fulfilled, (state, action: AnyAction)=>{
  //
  //     })
  //     build.addCase(MyfetchMessages.rejected, (state)=>{
  //
  //     })

  //   },
});
export const {
  addMessage,
  fetchMessage,
  lockedAction,
  setFoundRoom,
  initailIdRoom,
  settyping,
  clearMesages,
  resetAllMesage,
} = MessageSlice.actions;
export default MessageSlice.reducer;
