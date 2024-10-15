import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CategoryFilter from './CategoryFilter';
import useDebounce from './useDebounce';
import { Recipe } from '../types/Interfaces';
import Pagination from './Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { selectRecipe, unselectRecipe } from '../store/recipeSlice';

const AllRecipes: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [recipesPerPage] = useState(12);
  const debouncedSearchTerm = useDebounce(searchTerm, 700);

  const dispatch = useDispatch();
  const selectedRecipeIds = useSelector((state: RootState) => state.recipes.selectedRecipes);

  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
      .then((response) => response.json())
      .then((data) => {
        setRecipes(data.meals);
        setLoading(false);
      })
      .catch((error) => console.error('Error fetching recipes:', error));
  }, []);

  useEffect(() => {
    let updatedRecipes = recipes;

    if (selectedCategory) {
      updatedRecipes = updatedRecipes.filter((recipe) => recipe.strCategory === selectedCategory);
    }

    if (debouncedSearchTerm) {
      updatedRecipes = updatedRecipes.filter((recipe) =>
        recipe.strMeal.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    setFilteredRecipes(updatedRecipes);
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedCategory, recipes]);

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRecipeSelect = (id: string) => {
    if (selectedRecipeIds.includes(id)) {
      dispatch(unselectRecipe(id));
    } else {
      dispatch(selectRecipe(id));
    }
  };

  const handleViewSelectedRecipes = () => {
    navigate('/selected-recipes', { state: { selectedRecipes: selectedRecipeIds } });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">All Recipes</h1>
        <button
          onClick={handleViewSelectedRecipes}
          className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
        >
          View Selected Recipes
        </button>
      </div>

      <CategoryFilter onCategoryChange={setSelectedCategory} />

      <div className="my-4 w-56">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-lg p-2 w-full bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition duration-200"
        />
      </div>

      {loading ? (
        <div className="text-center">
          <p>Loading...</p>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentRecipes.map((recipe) => (
              <div key={recipe.idMeal} className="border rounded-lg overflow-hidden shadow-lg">
                <img
                  src={recipe.strMealThumb}
                  alt={recipe.strMeal}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold">{recipe.strMeal}</h2>
                  <p className="text-gray-600">{recipe.strCategory}</p>
                  <div className="flex justify-between items-center mt-4">
                    <Link
                      to={`/recipes/${recipe.idMeal}`}
                      className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600 transition duration-200"
                    >
                      View Recipe
                    </Link>
                    <button
                      onClick={() => handleRecipeSelect(recipe.idMeal)}
                      className={`text-white rounded px-4 py-2 ${selectedRecipeIds.includes(recipe.idMeal) ? 'bg-red-500' : 'bg-blue-500 hover:bg-blue-600'}`}
                    >
                      {selectedRecipeIds.includes(recipe.idMeal) ? 'Selected' : 'Select'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default AllRecipes;