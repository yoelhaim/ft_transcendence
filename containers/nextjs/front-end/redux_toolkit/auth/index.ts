import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface userInfo {
  UserName: string;
  id: number;
  token: string;
  avatar: string;
  bio?: string;
  firstTime: boolean;
  isAuth: boolean;
  nameSender: string;
  cover: string;
  score? : number
  twoFa?: boolean;
  twofactor:boolean;
}

const initialState: userInfo = {
  UserName: '',
  id: 0,
  token: '',
  avatar: '/images/profile.svg',
  cover: '/images/coverProfile.png',
  bio: '',
  firstTime: true,
  isAuth: false,
  nameSender: '',
  score: 0,
//   twoFa: true,
  twofactor: false,
};
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authLogin: (state, action: PayloadAction<any>) => {
      state.UserName = action.payload.UserName;
      state.id = action.payload.id;
      state.avatar = action.payload.avatar;
      state.bio = action.payload.bio;
      state.isAuth = true;
      state.twoFa = action.payload.twofactor
      state.twofactor = action.payload.twofactor
      state.score = action.payload.score
      if (action.payload.cover !== null)
        state.cover = action.payload.cover
    },
    removeAuth: (state) => {
      state.isAuth = false;
    },
    setNameSender: (state, action: PayloadAction<string>) => {
      state.nameSender = action.payload;
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.UserName = action.payload;
    },
    setAvatar: (state, action: PayloadAction<string>) => {
      state.avatar = action.payload;
    },
    setCover: (state, action: PayloadAction<string>) => {
      state.cover = action.payload;
    },
    setBioUpdate: (state, action: PayloadAction<string>) => {
      state.bio = action.payload;
    },
    setEnable2fa: (state, action: PayloadAction<boolean>) => {
      state.twoFa = action.payload;
    },
    resetAllAuth: ()=> initialState
  },
});

export const { authLogin, setNameSender, setAvatar, setCover, setBioUpdate , setUserName, setEnable2fa, resetAllAuth} = authSlice.actions;

export default authSlice.reducer;
