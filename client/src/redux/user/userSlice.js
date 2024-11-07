import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
const initialState = {
  currentUser: null,
  error: null,
  loading: false, // Changed to false for a more sensible default
};
var toastId = "";

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null; // Optionally reset error on sign in start
      toastId = toast.loading('updating...');
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
      toast.dismiss(toastId);
      toast.success('Successfully Sign in!');

    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      toast.dismiss();
      toast.error('Error Signing in!');
    },
    updateUserStart: (state) => {
      state.loading = true
      toastId = toast.loading('updating...');
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload,
        state.loading = false,
        state.error = null
      toast.dismiss(toastId);
      toast.success('Successfully Updated!');
    },
    updateUserFailure: (state, action) => {
      state.loading = false,
        state.error = action.payload
      toast.dismiss(toastId);
      toast.error('Error updating profile!');
    },
    deleteUserStart: (state) => {
      state.loading = false;
      toastId = toast.loading('deleting...');
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null
      toast.dismiss(toastId);
      toast.success("User deleted Successfully")
    },
    deleteUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload
      toast.dismiss(toastId);
      toast.error("Error deleting User")
    },
    signOutStart: (state) => {
      state.loading = false;
      toastId = toast.loading('signing out...');
    },
    signOutSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null
      toast.dismiss(toastId);
      toast.success("Sign Out Successfully")
    },
    signOutFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload
      toast.dismiss(toastId);
      toast.error("Error sign out User")
    },
  },
});

// Correct export of action creators and reducer
export const userAction = userSlice.actions;
export const userSelector = (state) => state.user;
export default userSlice.reducer;
