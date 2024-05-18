import TopBar from '@/composents/TopBar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useMealApi from '@/hooks/useMealApi';
import NotificationButton from '@/components/NotificationButton';
import axios from 'axios';

export default function HomePage({ }) {
    const router = useRouter();
    const [selectedCountry, setSelectedCountry] = useState("");
    const [mealsByCountry, setMealsByCountry] = useState([]);
    const { searchMealsByCountry } = useMealApi();
    const { searchMealById } = useMealApi();

    const countryList = [
        "Italian",
        "French",
        "Japanese",
        "Chinese",
        "Indian",
        "Spanish",
        "Thai",
        "Turkish",
        "Greek",
        "Vietnamese",
        "Moroccan",
        "British",
        "American",
        "Russian",
        "Portuguese",
        "Mexican",
        "Canadian",
        "Irish",
        "Filipino"
    ];

    useEffect(() => {
        fetchFavorites();

        const getMealsByCountry = async () => {
            const response = await searchMealsByCountry(selectedCountry);
            console.log(response)
            setMealsByCountry(response);
        };
        selectedCountry && selectedCountry !== null && selectedCountry?.length > 0 && getMealsByCountry();
    }, [selectedCountry]);

    const handleClickOnRecipe = (recipeId) => {
        router.push({
            pathname: '/recipe',
            query: {
                recipeId: recipeId
            },
        });
    }

    const fetchFavorites = async () => {
        try {
          const res = await axios.get('https://nodejs-serverless-function-express-sigma-two-85.vercel.app/profile/favorites', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
    
          let recipeIds = res.data; // Les IDs des recettes
          console.log("recipe id", recipeIds);
    
          // Filtrer les IDs null
          recipeIds = recipeIds.filter(id => id !== null);
    
          const favoriteRecipes = [];
    
          // Utiliser Promise.all pour attendre toutes les requêtes de recherche des recettes
          await Promise.all(
            recipeIds.map(async (id) => {
              try {
                const recipe = await searchMealById(id);
                favoriteRecipes.push(recipe);
              } catch (err) {
                console.error(`Failed to fetch recipe with id: ${id}`, err);
              }
            })
          );
    
          console.log("favorites recipes", favoriteRecipes);
          localStorage.setItem('favorites', JSON.stringify(favoriteRecipes));
          console.log("favorites favorites", favorites);
        } catch (err) {
          setError(err.response?.data?.message || 'An error occurred');
        }
      };

    return (
        <>
            <main className="flex flex-col justify-between items-center h-screen h-full min-h-1000">
                <TopBar />
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-semibold mb-4 text-center">Welcome to World Dishes Recipes</h1>
                    <p className="text-lg text-gray-700 mb-6 text-center">Explore a variety of delicious dishes from around the world!</p>
                    <div className="container mx-auto mt-8">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {countryList?.map((country, index) => (
                                <a key={index} className={`p-4 rounded-md text-center ${selectedCountry === country ? 'bg-blue-500 text-white' : 'bg-blue-200 text-blue-900'}`} onClick={() => {
                                    setSelectedCountry(country);
                                }}>
                                    <p>{country}</p>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 container" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                        {mealsByCountry?.map((meal, index) => (
                            <a key={meal.idMeal} className="bg-white rounded-lg shadow-md overflow-hidden" onClick={() => { handleClickOnRecipe(meal?.idMeal) }}>
                                <img src={meal.strMealThumb} alt={meal.strMeal} className="w-full h-48 object-cover" />
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold mb-2 text-black">{meal.strMeal}</h3>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </main >
        </>
    );
}
