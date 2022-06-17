import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  photos: {
    photos: null,
    isSuccess: false,
    isError: false,
    isLoading: false,
    message: "",
  },
};
const url = "http://localhost:8080";
export const getPhotos = createAsyncThunk(
  "photos/getPhotos",
  async (user, thunkAPI) => {
    try {
      if (user) {
        const { data } = await axios.get(`/api/photos/?user=${user}`);
        // console.log(data);
        return await data;
      }
      const { data } = await axios.get(`/api/photos`);
      // console.log(arrayChunker(data, 3)[0]);
      // console.log(arrayChunker(data, 3)[1]);
      // console.log(arrayChunker(data, 3)[2]);

      return await data;
    } catch (e) {
      const message =
        (e.response && e.response.data && e.response.data.message) ||
        e.message ||
        e.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);
// add photo
export const addPhoto = createAsyncThunk(
  "photos/addPhoto",
  async (formData, thunkAPI) => {
    try {
      // console.log(formData);
      const { data } = await axios.post(`/photos`, formData);
      // console.log(data);
      return await data;
    } catch (e) {
      const message =
        (e.response && e.response.data && e.response.data.message) ||
        e.message ||
        e.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);
//delete photo
export const deletePhoto = createAsyncThunk(
  "photos/deletePhoto",
  async (deleteId, thunkAPI) => {
    try {
      // console.log(formData);
      const { data } = await axios.delete(`/photos/${deleteId}`);
      console.log(data);
      return await data;
    } catch (e) {
      const message =
        (e.response && e.response.data && e.response.data.message) ||
        e.message ||
        e.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const photosSlice = createSlice({
  name: "photos",
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPhotos.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = "";
      })
      .addCase(getPhotos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.photos = action.payload;
      })
      .addCase(getPhotos.rejected, (state, action) => {
        state.isLoading = false;
        state.isSucces = false;
        state.isError = true;
        state.photos = action.payload;
      }) //getting photos end
      .addCase(addPhoto.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addPhoto.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.photos.push(action.payload);
        state.message = "Photo added";
      })
      .addCase(addPhoto.rejected, (state, action) => {
        state.isLoading = false;
        state.isSucces = false;
        state.isError = true;
        state.photos = action.payload;
        state.message = action.payload;
      }) //adding photos end
      .addCase(deletePhoto.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePhoto.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "Photo Deleted";
        console.log(action.payload);
        state.photos = state.photos.filter(
          (photo) => photo._id != action.payload._id
        );
      })
      .addCase(deletePhoto.rejected, (state, action) => {
        state.isLoading = false;
        state.isSucces = false;
        state.isError = true;
        // state.null = action.payload;
        //   state.message = "Please enter all the values";
      });
  },
});

export const { reset } = photosSlice.actions;
export default photosSlice.reducer;
