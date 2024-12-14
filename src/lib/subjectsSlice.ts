import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getAllSubjects = createAsyncThunk(
  "subjects/getAllSubjects",
  async (token: string, { rejectWithValue }) => {
    try {
      const res = await fetch("https://exam.elevateegy.com/api/v1/subjects", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to fetch subjects");
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  subjects: [],
  isLoading: false,
  isError: false,
  error: null,
};

const subjectsSlice = createSlice({
  name: "subjects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllSubjects.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(getAllSubjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subjects = action.payload.subjects;
      })
      .addCase(getAllSubjects.rejected, (state: any, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      });
  },
});

export const subjectsReducer = subjectsSlice.reducer;
