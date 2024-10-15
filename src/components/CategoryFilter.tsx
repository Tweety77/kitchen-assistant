import React, { useEffect, useState } from 'react';

const CategoryFilter: React.FC<{ onCategoryChange: (category: string) => void }> = ({ onCategoryChange }) => {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
      const data = await response.json();
      setCategories(data.categories.map((cat: any) => cat.strCategory));
    };

    fetchCategories();
  }, []);

  return (
    <select onChange={(e) => onCategoryChange(e.target.value)} className="border rounded p-2">
      <option value="">All Categories</option>
      {categories.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  );
};

export default CategoryFilter;