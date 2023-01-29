import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/authSlice";
import photosSlice from "../features/photosSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    photos: photosSlice,
  },
});
