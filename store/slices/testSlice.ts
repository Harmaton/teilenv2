import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

export type TestOption = {
  id: string;
  text: string;
};

export type TestQuestion = {
  id: string;
  question: string;
  options: TestOption[];
};

export interface TestEditorState {
  testId: string | null;
  title: string;
  description: string;
  isFree: boolean;
  questions: TestQuestion[];
  isPublished: boolean;
  isSaving: boolean;
  error: string | null;
  lastSavedAt: string | null;
}

const initialState: TestEditorState = {
  testId: null,
  title: "",
  description: "",
  isFree: true,
  questions: [],
  isPublished: false,
  isSaving: false,
  error: null,
  lastSavedAt: null,
};

const testSlice = createSlice({
  name: "testEditor",
  initialState,
  reducers: {
    // Initialize test
    initializeTest(
      state,
      action: PayloadAction<{
        testId: string;
        title: string;
        description: string;
        isFree: boolean;
        questions: TestQuestion[];
        isPublished: boolean;
      }>
    ) {
      state.testId = action.payload.testId;
      state.title = action.payload.title;
      state.description = action.payload.description;
      state.isFree = action.payload.isFree;
      state.questions = action.payload.questions;
      state.isPublished = action.payload.isPublished;
    },

    // Create new test
    createNewTest(
      state,
      action: PayloadAction<{
        testId: string;
        title: string;
        description: string;
        isFree: boolean;
      }>
    ) {
      state.testId = action.payload.testId;
      state.title = action.payload.title;
      state.description = action.payload.description;
      state.isFree = action.payload.isFree;
      state.questions = [];
      state.isPublished = false;
    },

    // Update test metadata
    updateTestMetadata(
      state,
      action: PayloadAction<{
        title?: string;
        description?: string;
        isFree?: boolean;
      }>
    ) {
      if (action.payload.title !== undefined) state.title = action.payload.title;
      if (action.payload.description !== undefined) state.description = action.payload.description;
      if (action.payload.isFree !== undefined) state.isFree = action.payload.isFree;
    },

    // Add question
    addQuestion(state) {
      if (state.questions.length >= 60) return;

      const newQuestion: TestQuestion = {
        id: uuidv4(),
        question: "",
        options: [
          { id: uuidv4(), text: "" },
          { id: uuidv4(), text: "" },
        ],
      };

      state.questions.push(newQuestion);
    },

    // Update question text
    updateQuestionText(
      state,
      action: PayloadAction<{
        questionId: string;
        text: string;
      }>
    ) {
      const question = state.questions.find((q) => q.id === action.payload.questionId);
      if (question) {
        question.question = action.payload.text;
      }
    },



    // Update option text
    updateOptionText(
      state,
      action: PayloadAction<{
        questionId: string;
        optionId: string;
        text: string;
      }>
    ) {
      const question = state.questions.find((q) => q.id === action.payload.questionId);
      if (question) {
        const option = question.options.find((o) => o.id === action.payload.optionId);
        if (option) {
          option.text = action.payload.text;
        }
      }
    },

    // Add option to question
    addOption(
      state,
      action: PayloadAction<{
        questionId: string;
      }>
    ) {
      const question = state.questions.find((q) => q.id === action.payload.questionId);
      if (question) {
        question.options.push({
          id: uuidv4(),
          text: "",
        });
      }
    },

    // Remove option from question
    removeOption(
      state,
      action: PayloadAction<{
        questionId: string;
        optionId: string;
      }>
    ) {
      const question = state.questions.find((q) => q.id === action.payload.questionId);
      if (question && question.options.length > 2) {
        question.options = question.options.filter((o) => o.id !== action.payload.optionId);
      }
    },

    // Remove question
    removeQuestion(
      state,
      action: PayloadAction<{
        questionId: string;
      }>
    ) {
      state.questions = state.questions.filter((q) => q.id !== action.payload.questionId);
    },

    // Set saving state
    setSaving(state, action: PayloadAction<boolean>) {
      state.isSaving = action.payload;
    },

    // Set error
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    // Set last saved time
    setLastSavedAt(state) {
      state.lastSavedAt = new Date().toISOString();
    },

    // Set published state
    setPublished(state, action: PayloadAction<boolean>) {
      state.isPublished = action.payload;
    },

    // Reset state
    resetTest(state) {
      state.testId = null;
      state.title = "";
      state.description = "";
      state.isFree = true;
      state.questions = [];
      state.isPublished = false;
      state.isSaving = false;
      state.error = null;
      state.lastSavedAt = null;
    },
    updateTitle: (state, action: PayloadAction<string>) => {
  state.title = action.payload;
},
  },
});


export const {
  initializeTest,
  createNewTest,
  updateTestMetadata,
  addQuestion,
  updateQuestionText,
  updateOptionText,
  addOption,
  removeOption,
  removeQuestion,
  setSaving,
  setError,
  setLastSavedAt,
  setPublished,
  resetTest,
  updateTitle
} = testSlice.actions;

export default testSlice.reducer;
