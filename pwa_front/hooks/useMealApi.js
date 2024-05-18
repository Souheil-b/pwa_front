import axios from "axios";

const useMealApi = () => {
  const searchMealsByName = async (keyword) => {
    if (navigator.onLine) {
      try {
        const { data } = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${keyword}`);
        return data?.meals || [];
      } catch (error) {
        console.log("error from searchMealsByName cause of no internet connection:", error);
        throw error;
      }
    } else {
      console.log("Network is offline");
    }
  };

  const searchMealById = async (recipeId) => {
    if (navigator.onLine) {

      try {
        const { data } = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
        return data?.meals[0] || [];
      } catch (error) {
        console.log("error from searchMealById cause of no internet connection:", error);
        throw error;
      }
    } else {
      console.log("Network is offline");
    }
  };

  const searchMealsByCountry = async (country) => {
    if (navigator.onLine) {
      try {
        const { data } = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${country}`);
        return data?.meals || [];
      } catch (error) {
        console.log("error from searchMealsByCountry cause of no internet connection:", error);
        throw error;
      }
    } else {
      console.log("Network is offline");
    }

  };

  return {
    searchMealsByName,
    searchMealById,
    searchMealsByCountry
  }
};

export default useMealApi;