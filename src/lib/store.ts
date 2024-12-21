
import { configureStore } from "@reduxjs/toolkit";
import { subjectsReducer } from "./subjectsSlice";
import { questionsReducer } from "./questionSlice";

export let store = configureStore({
  reducer:{
    subjects : subjectsReducer ,
    questions: questionsReducer
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;