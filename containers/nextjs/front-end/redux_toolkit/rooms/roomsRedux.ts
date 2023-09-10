import { RoomsDto } from '@/data/roomDto';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface roomInfo {
  room: RoomsDto[];
  userRoom: userRoomDto[];
  userBlockedRoom: userRoomDto[];
  loading: number;
  roomId: number;
  nameRoom: string;
  avatar: string;
  
}

const initialState: roomInfo = {
  room: [] as RoomsDto[],
  userRoom: [] as userRoomDto[],
  userBlockedRoom: [] as userRoomDto[],
  loading: 0,
  roomId: 0,
  nameRoom: '',
  avatar: 'https://i.ibb.co/9v43Tw5/c6e65a891e8c.png'
};

export const roomSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    createNewRoomSlice: (state, action: PayloadAction<RoomsDto>) => {
        // if (!action.payload.locked) return;
      state.room.unshift(action.payload);
    },
    fetchRoom: (state, action: PayloadAction<RoomsDto[]>) => {
      state.room = action.payload;
    },
    initailRoomId: (state, action: PayloadAction<number>) => {
      state.roomId = action.payload;
    },

    removeRoom: (state, action: PayloadAction<number>) => {
       
      state.room.forEach((element, index) => {
        if (action.payload === element.id) state.room.splice(index, 1);
      });
    },
    isLoadingInvite: (state, action: PayloadAction<number>) => {
      state.loading = action.payload;
    },
    setTitleRoom: (state, action: PayloadAction<string>)=>{
        state.nameRoom = action.payload 
    },
    setAvatarRoom: (state, action: PayloadAction<string>)=>{
        state.avatar = action.payload 
    },

    // users room
    fetchUserRoom: (state, action: PayloadAction<userRoomDto[]>) => {
      state.userRoom = action.payload.sort(
        (e, j) => {
            let isSortj = j.userroom.isOnline === 'offline' ? false: true;
            let isSorte = e.userroom.isOnline === 'offline' ? false: true;

            return Number(isSortj) - Number(isSorte)
        }
      );
    },
    removeUserRoom: (state, action: PayloadAction<any>) => {
      if (action.payload.roomId !== state.roomId) return;
      state.userRoom.forEach((element, index) => {
        if (action.payload.id === element.userroom.id)
          state.userRoom.splice(index, 1);
      });
    },
    updateStutusUserRoom: (state, action: PayloadAction<number>) => {
      state.userRoom.forEach((element, index) => {
        if (action.payload === element.userroom.id)
          state.userRoom[index].isadmin = !state.userRoom[index].isadmin;
      });
    },

    addNewUser: (state, action: PayloadAction<any>) => {
      if (action.payload.roomId !== state.roomId) return;
      state.userRoom.push(action.payload);
      state.userRoom.sort(
        (e, j) =>{
            let isSortj = j.userroom.isOnline === 'offline' ? false: true;
            let isSorte = e.userroom.isOnline === 'offline' ? false: true;

            return Number(isSortj) - Number(isSorte)
        }
      );
    },
    fetchBlockedUserRoom: (state, action: PayloadAction<userRoomDto[]>) => {
      state.userBlockedRoom = action.payload;
    },

    removeBlockedUserRoom: (state, action: PayloadAction<number>) => {
      state.userBlockedRoom.forEach((element, index) => {
        if (action.payload === element.userroom.id)
          state.userBlockedRoom.splice(index, 1);
      });
    },

    addNewBloxkedUser: (state, action: PayloadAction<userRoomDto>) => {
      state.userBlockedRoom.unshift(action.payload);
      removeUserRoom(action.payload.userId);
    },
    muteUser: (state, action: PayloadAction<any>) => {
      for (let i = 0; i < state.userRoom.length; i++) {
        if (state.userRoom[i].userId == action.payload.userId) {
          state.userRoom[i].timermute = action.payload.timermute;
          break;
        }
      }
      // state.userRoom.forEach((element, index) => {
      //     if (action.payload.userId === element.userroom.id)
      //       state.userRoom[index].timermute = action.payload.timermute;
      //   });
    },
    resetAllRoom: ()=> initialState
  },
});

export const {
  createNewRoomSlice,
  fetchRoom,
  fetchUserRoom,
  removeUserRoom,
  addNewUser,
  removeRoom,
  fetchBlockedUserRoom,
  addNewBloxkedUser,
  removeBlockedUserRoom,
  isLoadingInvite,
  updateStutusUserRoom,
  initailRoomId,
  muteUser,
  setTitleRoom,
  setAvatarRoom,
  resetAllRoom
} = roomSlice.actions;

export default roomSlice.reducer;
