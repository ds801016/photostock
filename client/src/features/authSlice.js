import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// const url = "http://localhost:8080";
const isLogged = () => {
  const u = JSON.parse(localStorage.getItem("user"));
  if (u == undefined) {
    localStorage.clear();
    return null;
  } else return u;
};
const initialState = {
  user: JSON.parse(localStorage.getItem("user")),
  isSuccess: false,
  isError: false,
  isLoading: false,
  message: "",
};

//register slice
export const register = createAsyncThunk(
  "auth/register",
  async (newUser, thunkAPI) => {
    try {
      const { data } = await axios.post(`/user/register`, newUser);
      localStorage.setItem("user", JSON.stringify(data.user));

      return await data;
    } catch (e) {
      const message =
        (e.response && e.response.data && e.response.data.message) ||
        e.message ||
        e.toString();
      console.log(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

//logout slice
export const logout = createAsyncThunk(`/auth/logout`, async (_, thunkAPI) => {
  try {
    const { data } = await axios.post("/user/logout");
    localStorage.clear();
    return await data;
  } catch (e) {
    const message =
      (e.response && e.response.data && e.response.data.message) ||
      e.message ||
      e.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

//login slice
export const login = createAsyncThunk(`/auth/login`, async (user, thunkAPI) => {
  try {
    const { data } = await axios.post("/user/login", user);
    localStorage.setItem("user", JSON.stringify(data.user));
    return await data;
  } catch (e) {
    const message =
      (e.response && e.response.data && e.response.data.message) ||
      e.message ||
      e.toString();
    console.log(e);
    return thunkAPI.rejectWithValue(message);
  }
});
//profile slice
export const profile = createAsyncThunk(
  "auth/getProfile",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(`/user/profile`);

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

//adding fav photo slice
export const addFavPhoto = createAsyncThunk(
  "auth/addFavPhoto",
  async ({ photoId, userId }, thunkAPI) => {
    try {
      const { data } = await axios.patch(`/user/${userId}`, { photoId });
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
export const authSlice = createSlice({
  name: "user",
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
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isSucces = false;
        state.isError = true;
        state.user = null;
        state.message = action.payload;
      }) //register ended here
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.user = null;
        state.message = action.payload;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.isSucces = false;
        state.isError = true;
        state.user = null;
        state.message = action.payload;
      }) //logout ended here
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.user = action.payload.user;
        state.message = "user Logged in";
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isSucces = false;
        state.isError = true;
        state.user = null;
        // console.log(action.payload);
        state.message = action.payload;
      }) //login ended here
      .addCase(profile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(profile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        // console.log(action.payload);
        state.user = action.payload.user;
        // state.message = "user Logged in";
      })
      .addCase(profile.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.user = null;
        state.message = action.payload;
      }) //profile ended here
      .addCase(addFavPhoto.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addFavPhoto.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        // console.log(action.payload);

        state.user = action.payload;
        // console.log(state.user);
        // state.user = updatedUsers;
        // state.message = "user Logged in";
      })
      .addCase(addFavPhoto.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.user = null;
        state.message = action.payload;
      }); //addFavPhoto ended here
  },
});
export const { reset } = authSlice.actions;
export default authSlice.reducer;
