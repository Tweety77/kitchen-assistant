import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Recipe } from '../types/Interfaces';

const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
      const data = await response.json();
      setRecipe(data.meals[0]);
    };

    fetchRecipe();
  }, [id]);

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">{recipe.strMeal}</h1>
        <Link to="/" className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600">
          Back To All Recepies
        </Link>
      </div>
      <img src={recipe.strMealThumb} alt={recipe.strMeal} className="w-full h-64 object-cover rounded-lg mb-4" />
      <h2 className="text-xl font-semibold">Category: {recipe.strCategory}</h2>
      <h2 className="text-xl font-semibold">Area: {recipe.strArea}</h2>
      <h3 className="text-xl font-semibold mt-4">Instructions:</h3>
      <p className="text-gray-700">{recipe.strInstructions}</p>
      <h3 className="text-xl font-semibold mt-4">Ingredients:</h3>
      <ul className="list-disc list-inside">
        {Object.keys(recipe).map((key) => {
          if (key.startsWith('strIngredient') && recipe[key]) {
            return <li key={key}>{recipe[key]}</li>;
          }
          return null;
        })}
      </ul>
    </div>
  );
};

export default RecipeDetail;