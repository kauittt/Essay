import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    feedbacks: null,
};

const feedbackSlice = createSlice({
    name: "feedback",
    initialState,
    reducers: {},
});

export const { getFeedbacksSuccess } = feedbackSlice.actions;

export const selectFeedbacks = (state) => state.feedback.feedbacks;
export default feedbackSlice.reducer;
