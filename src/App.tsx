import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AllRecipes from './components/AllRecipes';
import RecipeDetail from './components/RecipeDetail';
import SelectedRecipes from './components/SelectedRecipes';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AllRecipes />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        <Route path="/selected-recipes" element={<SelectedRecipes />} />
      </Routes>
    </Router>
  );
}

export default App;