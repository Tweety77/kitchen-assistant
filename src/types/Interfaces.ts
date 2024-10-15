export interface Recipe {
    idMeal: string;
    strMeal: string;
    strCategory: string;
    strArea: string;
    strMealThumb: string;
    [key: string]: string | undefined;
  }