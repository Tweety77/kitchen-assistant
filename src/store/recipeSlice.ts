import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RecipeState {
  selectedRecipes: string[];
}

const initialState: RecipeState = {
  selectedRecipes: [],
};

const recipeSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    selectRecipe: (state, action: PayloadAction<string>) => {
      if (!state.selectedRecipes.includes(action.payload)) {
        state.selectedRecipes.push(action.payload);
      }
    },
    unselectRecipe: (state, action: PayloadAction<string>) => {
      state.selectedRecipes = state.selectedRecipes.filter(
        (id) => id !== action.payload
      );
    },
    clearSelectedRecipes: (state) => {
      state.selectedRecipes = [];
    },
  },
});

export const { selectRecipe, unselectRecipe, clearSelectedRecipes } = recipeSlice.actions;
export default recipeSlice.reducer;