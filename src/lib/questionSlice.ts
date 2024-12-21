import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getAllQuestion = createAsyncThunk(
  "questions/getAllQuestion",
  async (_, { rejectWithValue }) => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch("https://exam.elevateegy.com/api/v1/questions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token || "",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch questions");

      const data = await res.json();
      return data.questions;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
const initialState = {
  questions: [],
  isLoading: false,
  isError: false,
  error: null,
};

const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllQuestion.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(getAllQuestion.fulfilled, (state, action) => {
        state.questions = action.payload;
        state.isLoading = false;
      })
      .addCase(getAllQuestion.rejected, (state: any, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      });
  },
});
export const questionsReducer = questionSlice.reducer;
