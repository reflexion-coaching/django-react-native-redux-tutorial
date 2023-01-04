import { createSlice } from '@reduxjs/toolkit'

const initialState = { isSignIn: false }

const authentificationSlice = createSlice({
  name: 'authentification',
  initialState,
  reducers: {
    signedIn: (state, action) => {
        console.log(action.payload)
        state.isSignIn = action.payload
    }
  }
})

export const { signedIn } = authentificationSlice.actions

// selecteurs
export const selectIsSignIn = (state) => state.authentification.isSignIn;

export default authentificationSlice.reducer