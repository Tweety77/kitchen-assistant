import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const SelectedRecipes: React.FC = () => {
  const navigate = useNavigate();
  
  const selectedRecipeIds = useSelector((state: RootState) => state.recipes.selectedRecipes);

  const [selectedRecipes, setSelectedRecipes] = useState<any[]>([]);
  const [ingredients, setIngredients] = useState<any[]>([]);

  useEffect(() => {
    if (selectedRecipeIds.length === 0) return;

    const fetchSelectedRecipes = async () => {
      const recipesPromises = selectedRecipeIds.map((id: string) => getRecipeDetails(id));
      const recipesData = await Promise.all(recipesPromises);
      setSelectedRecipes(recipesData);

      const allIngredients: Record<string, string> = {};
      recipesData.forEach((recipe) => {
        for (let i = 1; i <= 20; i++) {
          const ingredient = recipe[`strIngredient${i}`];
          const measure = recipe[`strMeasure${i}`];
          if (ingredient) {
            allIngredients[ingredient] = measure;
          }
        }
      });
      setIngredients(Object.entries(allIngredients));
    };

    fetchSelectedRecipes();
  }, [selectedRecipeIds]);

  const getRecipeDetails = async (id: string): Promise<any> => {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await response.json();
    return data.meals[0];
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Selected Recipes</h1>
        <div>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
          >
            Back To All Recipes
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {selectedRecipes.map((recipe) => (
              <div key={recipe.idMeal} className="border rounded-lg overflow-hidden shadow-lg">
                <img
                  src={recipe.strMealThumb}
                  alt={recipe.strMeal}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{recipe.strMeal}</h2>
                  <p className="text-gray-700 text-sm mb-4">{recipe.strInstructions}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:w-1/4">
          <h2 className="text-xl font-bold mb-4">Ingredients</h2>
          <ul className="list-disc list-inside bg-gray-100 p-4 rounded-lg shadow-md">
            {ingredients.map(([ingredient, measure]) => (
              <li key={ingredient} className="text-gray-800">
                {measure} {ingredient}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SelectedRecipes;