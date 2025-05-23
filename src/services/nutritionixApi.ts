import axios from 'axios';
// Nutritionix API credentials
const API_ID = 'your_api_id'; // Replace with your actual Nutritionix API ID
const API_KEY = 'your_api_key'; // Replace with your actual Nutritionix API Key
// Base URL for Nutritionix API
const BASE_URL = 'https://trackapi.nutritionix.com/v2';
// Interface for food search results
export interface NutritionixFoodItem {
  food_name: string;
  serving_qty: number;
  serving_unit: string;
  serving_weight_grams: number;
  nf_calories: number;
  photo: {
    thumb: string;
  };
}
// Interface for detailed nutrition information
export interface NutritionixNutrients {
  calories: number;
  total_fat: number;
  saturated_fat: number;
  cholesterol: number;
  sodium: number;
  total_carbohydrate: number;
  dietary_fiber: number;
  sugars: number;
  protein: number;
  potassium: number;
}
// Search for food items
export const searchFoodItems = async (query: string): Promise<NutritionixFoodItem[]> => {
  try {
    // For demo purposes, we'll use mock data instead of making actual API calls
    // In a real app, you would uncomment the axios call below
    // Mock data for demonstration
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    // Generate mock results based on the query
    return getMockFoodResults(query);
  } catch (error) {
    console.error('Error searching for food items:', error);
    throw error;
  }
};
// Get detailed nutrition information for a food item
export const getNutritionInfo = async (query: string): Promise<NutritionixFoodItem> => {
  try {
    // For demo purposes, we'll use mock data instead of making actual API calls
    // In a real app, you would uncomment the axios call below
    // Mock data for demonstration
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    // Get the first mock result
    const mockResults = getMockFoodResults(query);
    return mockResults[0] || null;
  } catch (error) {
    console.error('Error getting nutrition info:', error);
    throw error;
  }
};
// Helper function to generate mock food results
const getMockFoodResults = (query: string): NutritionixFoodItem[] => {
  console.log('Searching for food with query:', query);
  // Comprehensive food database with calorie information
  const foodDatabase = [
    // Fruits
    { name: 'apple', calories: 95, serving_qty: 1, serving_unit: 'medium', weight: 182 },
    { name: 'apple, green', calories: 80, serving_qty: 1, serving_unit: 'medium', weight: 180 },
    { name: 'apple, red delicious', calories: 90, serving_qty: 1, serving_unit: 'medium', weight: 182 },
    { name: 'apple, gala', calories: 80, serving_qty: 1, serving_unit: 'medium', weight: 180 },
    { name: 'apple, fuji', calories: 100, serving_qty: 1, serving_unit: 'medium', weight: 190 },
    { name: 'applesauce', calories: 100, serving_qty: 1, serving_unit: 'cup', weight: 244 },
    { name: 'banana', calories: 105, serving_qty: 1, serving_unit: 'medium', weight: 118 },
    { name: 'blackberries', calories: 62, serving_qty: 1, serving_unit: 'cup', weight: 144 },
    { name: 'blueberries', calories: 85, serving_qty: 1, serving_unit: 'cup', weight: 148 },
    { name: 'cantaloupe', calories: 50, serving_qty: 1, serving_unit: 'cup', weight: 160 },
    { name: 'cherries', calories: 90, serving_qty: 1, serving_unit: 'cup', weight: 154 },
    { name: 'grapefruit', calories: 82, serving_qty: 1, serving_unit: 'medium', weight: 230 },
    { name: 'grapes', calories: 104, serving_qty: 1, serving_unit: 'cup', weight: 151 },
    { name: 'kiwi', calories: 42, serving_qty: 1, serving_unit: 'medium', weight: 69 },
    { name: 'lemon', calories: 17, serving_qty: 1, serving_unit: 'medium', weight: 58 },
    { name: 'lime', calories: 20, serving_qty: 1, serving_unit: 'medium', weight: 67 },
    { name: 'mango', calories: 202, serving_qty: 1, serving_unit: 'whole', weight: 336 },
    { name: 'orange', calories: 62, serving_qty: 1, serving_unit: 'medium', weight: 131 },
    { name: 'peach', calories: 58, serving_qty: 1, serving_unit: 'medium', weight: 150 },
    { name: 'pear', calories: 101, serving_qty: 1, serving_unit: 'medium', weight: 178 },
    { name: 'pineapple', calories: 82, serving_qty: 1, serving_unit: 'cup', weight: 165 },
    { name: 'plum', calories: 30, serving_qty: 1, serving_unit: 'medium', weight: 66 },
    { name: 'raspberries', calories: 64, serving_qty: 1, serving_unit: 'cup', weight: 123 },
    { name: 'strawberries', calories: 49, serving_qty: 1, serving_unit: 'cup', weight: 152 },
    { name: 'watermelon', calories: 46, serving_qty: 1, serving_unit: 'cup', weight: 152 },
    // Vegetables
    { name: 'asparagus', calories: 27, serving_qty: 1, serving_unit: 'cup', weight: 134 },
    { name: 'avocado', calories: 234, serving_qty: 1, serving_unit: 'whole', weight: 150 },
    { name: 'bell pepper, green', calories: 30, serving_qty: 1, serving_unit: 'medium', weight: 119 },
    { name: 'bell pepper, red', calories: 37, serving_qty: 1, serving_unit: 'medium', weight: 119 },
    { name: 'broccoli', calories: 31, serving_qty: 1, serving_unit: 'cup', weight: 91 },
    { name: 'brussels sprouts', calories: 38, serving_qty: 1, serving_unit: 'cup', weight: 88 },
    { name: 'cabbage', calories: 22, serving_qty: 1, serving_unit: 'cup', weight: 89 },
    { name: 'carrot', calories: 50, serving_qty: 1, serving_unit: 'medium', weight: 61 },
    { name: 'cauliflower', calories: 25, serving_qty: 1, serving_unit: 'cup', weight: 100 },
    { name: 'celery', calories: 16, serving_qty: 1, serving_unit: 'cup', weight: 120 },
    { name: 'corn', calories: 132, serving_qty: 1, serving_unit: 'cup', weight: 154 },
    { name: 'cucumber', calories: 16, serving_qty: 1, serving_unit: 'cup', weight: 104 },
    { name: 'eggplant', calories: 20, serving_qty: 1, serving_unit: 'cup', weight: 82 },
    { name: 'garlic', calories: 4, serving_qty: 1, serving_unit: 'clove', weight: 3 },
    { name: 'green beans', calories: 34, serving_qty: 1, serving_unit: 'cup', weight: 110 },
    { name: 'kale', calories: 33, serving_qty: 1, serving_unit: 'cup', weight: 67 },
    { name: 'lettuce', calories: 5, serving_qty: 1, serving_unit: 'cup', weight: 36 },
    { name: 'mushrooms', calories: 15, serving_qty: 1, serving_unit: 'cup', weight: 70 },
    { name: 'onion', calories: 44, serving_qty: 1, serving_unit: 'medium', weight: 110 },
    { name: 'potato', calories: 163, serving_qty: 1, serving_unit: 'medium', weight: 173 },
    { name: 'spinach', calories: 7, serving_qty: 1, serving_unit: 'cup', weight: 30 },
    { name: 'sweet potato', calories: 112, serving_qty: 1, serving_unit: 'medium', weight: 130 },
    { name: 'tomato', calories: 22, serving_qty: 1, serving_unit: 'medium', weight: 123 },
    { name: 'zucchini', calories: 29, serving_qty: 1, serving_unit: 'cup', weight: 124 },
    // Proteins
    { name: 'beef, ground, 80/20', calories: 290, serving_qty: 4, serving_unit: 'oz', weight: 113 },
    { name: 'beef, ground, 90/10', calories: 199, serving_qty: 4, serving_unit: 'oz', weight: 113 },
    { name: 'beef, steak', calories: 271, serving_qty: 4, serving_unit: 'oz', weight: 113 },
    { name: 'chicken breast', calories: 165, serving_qty: 3, serving_unit: 'oz', weight: 85 },
    { name: 'chicken thigh', calories: 209, serving_qty: 3, serving_unit: 'oz', weight: 85 },
    { name: 'chicken wing', calories: 99, serving_qty: 1, serving_unit: 'wing', weight: 32 },
    { name: 'egg', calories: 72, serving_qty: 1, serving_unit: 'large', weight: 50 },
    { name: 'egg white', calories: 17, serving_qty: 1, serving_unit: 'large', weight: 33 },
    { name: 'fish, cod', calories: 93, serving_qty: 3, serving_unit: 'oz', weight: 85 },
    { name: 'fish, salmon', calories: 206, serving_qty: 3, serving_unit: 'oz', weight: 85 },
    { name: 'fish, tilapia', calories: 109, serving_qty: 3, serving_unit: 'oz', weight: 85 },
    { name: 'fish, tuna', calories: 111, serving_qty: 3, serving_unit: 'oz', weight: 85 },
    { name: 'lamb chop', calories: 235, serving_qty: 3, serving_unit: 'oz', weight: 85 },
    { name: 'pork chop', calories: 231, serving_qty: 3, serving_unit: 'oz', weight: 85 },
    { name: 'pork, ground', calories: 297, serving_qty: 4, serving_unit: 'oz', weight: 113 },
    { name: 'shrimp', calories: 84, serving_qty: 3, serving_unit: 'oz', weight: 85 },
    { name: 'tofu', calories: 94, serving_qty: 1, serving_unit: 'cup', weight: 126 },
    { name: 'turkey breast', calories: 135, serving_qty: 3, serving_unit: 'oz', weight: 85 },
    { name: 'turkey, ground', calories: 193, serving_qty: 4, serving_unit: 'oz', weight: 113 },
    // Dairy & Alternatives
    { name: 'almond milk', calories: 39, serving_qty: 1, serving_unit: 'cup', weight: 240 },
    { name: 'butter', calories: 102, serving_qty: 1, serving_unit: 'tbsp', weight: 14 },
    { name: 'cheese, american', calories: 106, serving_qty: 1, serving_unit: 'slice', weight: 28 },
    { name: 'cheese, cheddar', calories: 113, serving_qty: 1, serving_unit: 'slice', weight: 28 },
    { name: 'cheese, cottage', calories: 206, serving_qty: 1, serving_unit: 'cup', weight: 226 },
    { name: 'cheese, cream', calories: 99, serving_qty: 1, serving_unit: 'oz', weight: 28 },
    { name: 'cheese, feta', calories: 75, serving_qty: 1, serving_unit: 'oz', weight: 28 },
    { name: 'cheese, mozzarella', calories: 85, serving_qty: 1, serving_unit: 'oz', weight: 28 },
    { name: 'cheese, parmesan', calories: 111, serving_qty: 1, serving_unit: 'oz', weight: 28 },
    { name: 'cheese, swiss', calories: 108, serving_qty: 1, serving_unit: 'slice', weight: 28 },
    { name: 'coconut milk', calories: 445, serving_qty: 1, serving_unit: 'cup', weight: 240 },
    { name: 'milk, 1%', calories: 102, serving_qty: 1, serving_unit: 'cup', weight: 244 },
    { name: 'milk, 2%', calories: 122, serving_qty: 1, serving_unit: 'cup', weight: 244 },
    { name: 'milk, skim', calories: 83, serving_qty: 1, serving_unit: 'cup', weight: 245 },
    { name: 'milk, whole', calories: 149, serving_qty: 1, serving_unit: 'cup', weight: 244 },
    { name: 'soy milk', calories: 131, serving_qty: 1, serving_unit: 'cup', weight: 243 },
    { name: 'yogurt, greek', calories: 100, serving_qty: 6, serving_unit: 'oz', weight: 170 },
    { name: 'yogurt, plain', calories: 154, serving_qty: 1, serving_unit: 'cup', weight: 245 },
    // Grains & Bread
    { name: 'bagel', calories: 245, serving_qty: 1, serving_unit: 'bagel', weight: 105 },
    { name: 'bread, white', calories: 79, serving_qty: 1, serving_unit: 'slice', weight: 30 },
    { name: 'bread, whole wheat', calories: 81, serving_qty: 1, serving_unit: 'slice', weight: 32 },
    { name: 'cereal, cheerios', calories: 100, serving_qty: 1, serving_unit: 'cup', weight: 28 },
    { name: 'cereal, corn flakes', calories: 100, serving_qty: 1, serving_unit: 'cup', weight: 28 },
    { name: 'cereal, granola', calories: 597, serving_qty: 1, serving_unit: 'cup', weight: 122 },
    { name: 'cereal, raisin bran', calories: 190, serving_qty: 1, serving_unit: 'cup', weight: 59 },
    { name: 'couscous', calories: 176, serving_qty: 1, serving_unit: 'cup', weight: 157 },
    { name: 'english muffin', calories: 134, serving_qty: 1, serving_unit: 'muffin', weight: 57 },
    { name: 'oatmeal', calories: 150, serving_qty: 1, serving_unit: 'cup', weight: 234 },
    { name: 'pasta', calories: 221, serving_qty: 1, serving_unit: 'cup', weight: 140 },
    { name: 'pasta, whole wheat', calories: 174, serving_qty: 1, serving_unit: 'cup', weight: 140 },
    { name: 'quinoa', calories: 222, serving_qty: 1, serving_unit: 'cup', weight: 185 },
    { name: 'rice, brown', calories: 216, serving_qty: 1, serving_unit: 'cup', weight: 195 },
    { name: 'rice, white', calories: 206, serving_qty: 1, serving_unit: 'cup', weight: 158 },
    { name: 'rice, wild', calories: 166, serving_qty: 1, serving_unit: 'cup', weight: 164 },
    { name: 'tortilla, corn', calories: 58, serving_qty: 1, serving_unit: 'tortilla', weight: 24 },
    { name: 'tortilla, flour', calories: 144, serving_qty: 1, serving_unit: 'tortilla', weight: 49 },
    // Snacks & Sweets
    { name: 'candy, chocolate bar', calories: 235, serving_qty: 1, serving_unit: 'bar', weight: 44 },
    { name: 'candy, gummy bears', calories: 140, serving_qty: 1, serving_unit: 'oz', weight: 28 },
    { name: 'candy, m&ms', calories: 240, serving_qty: 1, serving_unit: 'package', weight: 47 },
    { name: 'chips, potato', calories: 152, serving_qty: 1, serving_unit: 'oz', weight: 28 },
    { name: 'chips, tortilla', calories: 142, serving_qty: 1, serving_unit: 'oz', weight: 28 },
    { name: 'chocolate, dark', calories: 155, serving_qty: 1, serving_unit: 'oz', weight: 28 },
    { name: 'chocolate, milk', calories: 155, serving_qty: 1, serving_unit: 'oz', weight: 28 },
    { name: 'cookie, chocolate chip', calories: 49, serving_qty: 1, serving_unit: 'cookie', weight: 10 },
    { name: 'cookie, oreo', calories: 53, serving_qty: 1, serving_unit: 'cookie', weight: 11 },
    { name: 'cookie, sugar', calories: 72, serving_qty: 1, serving_unit: 'cookie', weight: 16 },
    { name: 'crackers, graham', calories: 59, serving_qty: 2, serving_unit: 'sheets', weight: 14 },
    { name: 'crackers, saltine', calories: 13, serving_qty: 1, serving_unit: 'cracker', weight: 3 },
    { name: 'ice cream, chocolate', calories: 273, serving_qty: 1, serving_unit: 'cup', weight: 132 },
    { name: 'ice cream, vanilla', calories: 273, serving_qty: 1, serving_unit: 'cup', weight: 132 },
    { name: 'nuts, almonds', calories: 164, serving_qty: 1, serving_unit: 'oz', weight: 28 },
    { name: 'nuts, cashews', calories: 163, serving_qty: 1, serving_unit: 'oz', weight: 28 },
    { name: 'nuts, peanuts', calories: 166, serving_qty: 1, serving_unit: 'oz', weight: 28 },
    { name: 'nuts, walnuts', calories: 185, serving_qty: 1, serving_unit: 'oz', weight: 28 },
    { name: 'popcorn', calories: 31, serving_qty: 1, serving_unit: 'cup', weight: 8 },
    { name: 'pretzel', calories: 108, serving_qty: 1, serving_unit: 'oz', weight: 28 },
    // Beverages
    { name: 'beer', calories: 153, serving_qty: 12, serving_unit: 'oz', weight: 356 },
    { name: 'coffee', calories: 2, serving_qty: 1, serving_unit: 'cup', weight: 240 },
    { name: 'coffee, latte', calories: 120, serving_qty: 12, serving_unit: 'oz', weight: 360 },
    { name: 'juice, apple', calories: 114, serving_qty: 1, serving_unit: 'cup', weight: 248 },
    { name: 'juice, orange', calories: 111, serving_qty: 1, serving_unit: 'cup', weight: 248 },
    { name: 'soda, cola', calories: 152, serving_qty: 12, serving_unit: 'oz', weight: 368 },
    { name: 'soda, diet', calories: 0, serving_qty: 12, serving_unit: 'oz', weight: 368 },
    { name: 'tea', calories: 2, serving_qty: 1, serving_unit: 'cup', weight: 245 },
    { name: 'water', calories: 0, serving_qty: 1, serving_unit: 'cup', weight: 240 },
    { name: 'wine, red', calories: 125, serving_qty: 5, serving_unit: 'oz', weight: 148 },
    { name: 'wine, white', calories: 121, serving_qty: 5, serving_unit: 'oz', weight: 148 },
    // Fast Food
    { name: 'burger, big mac', calories: 550, serving_qty: 1, serving_unit: 'burger', weight: 219 },
    { name: 'burger, cheeseburger', calories: 300, serving_qty: 1, serving_unit: 'burger', weight: 114 },
    { name: 'burger, hamburger', calories: 250, serving_qty: 1, serving_unit: 'burger', weight: 100 },
    { name: 'burrito', calories: 450, serving_qty: 1, serving_unit: 'burrito', weight: 200 },
    { name: 'chicken nuggets', calories: 47, serving_qty: 1, serving_unit: 'nugget', weight: 16 },
    { name: 'french fries', calories: 365, serving_qty: 1, serving_unit: 'medium', weight: 111 },
    { name: 'pizza, cheese', calories: 285, serving_qty: 1, serving_unit: 'slice', weight: 107 },
    { name: 'pizza, pepperoni', calories: 298, serving_qty: 1, serving_unit: 'slice', weight: 111 },
    { name: 'sandwich, club', calories: 600, serving_qty: 1, serving_unit: 'sandwich', weight: 250 },
    { name: 'sandwich, grilled cheese', calories: 350, serving_qty: 1, serving_unit: 'sandwich', weight: 120 },
    { name: 'sandwich, peanut butter & jelly', calories: 350, serving_qty: 1, serving_unit: 'sandwich', weight: 100 },
    { name: 'taco', calories: 210, serving_qty: 1, serving_unit: 'taco', weight: 78 },
    // Prepared Meals & Dishes
    { name: 'chicken noodle soup', calories: 75, serving_qty: 1, serving_unit: 'cup', weight: 240 },
    { name: 'chili con carne', calories: 340, serving_qty: 1, serving_unit: 'cup', weight: 253 },
    { name: 'lasagna', calories: 330, serving_qty: 1, serving_unit: 'piece', weight: 227 },
    { name: 'mac and cheese', calories: 376, serving_qty: 1, serving_unit: 'cup', weight: 200 },
    { name: 'mashed potatoes', calories: 237, serving_qty: 1, serving_unit: 'cup', weight: 210 },
    { name: 'pad thai', calories: 375, serving_qty: 1, serving_unit: 'cup', weight: 250 },
    { name: 'pasta, spaghetti with meatballs', calories: 500, serving_qty: 1, serving_unit: 'cup', weight: 248 },
    { name: 'potato salad', calories: 358, serving_qty: 1, serving_unit: 'cup', weight: 250 },
    { name: 'rice, fried', calories: 333, serving_qty: 1, serving_unit: 'cup', weight: 198 },
    { name: 'salad, caesar', calories: 290, serving_qty: 1, serving_unit: 'bowl', weight: 160 },
    { name: 'salad, garden', calories: 20, serving_qty: 1, serving_unit: 'cup', weight: 55 },
    { name: 'stir fry, chicken', calories: 315, serving_qty: 1, serving_unit: 'cup', weight: 217 },
    // Fitness Foods
    { name: 'protein bar', calories: 220, serving_qty: 1, serving_unit: 'bar', weight: 60 },
    { name: 'protein powder, whey', calories: 120, serving_qty: 1, serving_unit: 'scoop', weight: 30 },
    { name: 'protein shake', calories: 170, serving_qty: 1, serving_unit: 'bottle', weight: 330 },
    { name: 'sports drink', calories: 80, serving_qty: 12, serving_unit: 'oz', weight: 360 },
    { name: 'energy drink', calories: 160, serving_qty: 16, serving_unit: 'oz', weight: 480 },
    { name: 'energy gel', calories: 100, serving_qty: 1, serving_unit: 'packet', weight: 32 },
    { name: 'pre-workout supplement', calories: 5, serving_qty: 1, serving_unit: 'scoop', weight: 10 },
    { name: 'bcaa supplement', calories: 5, serving_qty: 1, serving_unit: 'scoop', weight: 7 }
  ];
  // Filter foods that match the query
  const lowercaseQuery = query.toLowerCase();
  console.log('Lowercase query:', lowercaseQuery);
  const matchingFoods = foodDatabase.filter(food => 
    food.name.toLowerCase().includes(lowercaseQuery)
  );
  console.log('Found matching foods:', matchingFoods.length);
  // Convert to Nutritionix format
  const results = matchingFoods.map(food => {
    // Generate a realistic photo URL based on the food name
    const foodNameForUrl = food.name.split(',')[0].replace(/\s+/g, '-').toLowerCase();
    const photoUrl = `https://spoonacular.com/cdn/ingredients_100x100/${foodNameForUrl}.jpg`;
    return {
      food_name: food.name,
      serving_qty: food.serving_qty,
      serving_unit: food.serving_unit,
      serving_weight_grams: food.weight,
      nf_calories: food.calories,
      photo: {
        thumb: photoUrl
      }
    };
  });
  console.log('Returning results:', results);
  return results;
};

