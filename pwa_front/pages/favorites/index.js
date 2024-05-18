import TopBar from '@/composents/TopBar';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function FavouritePage({ }) {
    const router = useRouter();
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedFavorites = localStorage.getItem('favorites');
            setFavorites(storedFavorites ? JSON.parse(storedFavorites) : []);
        }
    }, []);

    const fetchFavorites = async () => {
        try {
            const res = await axios.get('https://nodejs-serverless-function-express-sigma-two-85.vercel.app/profile/favorites', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            const recipeIds = res.data; // Les IDs des recettes
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

            setFavorites(favoriteRecipes);
            console.log("favorites favorites", favorites)
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        }
    };


    const handleClickOnRecipe = (recipeId) => {
        router.push({
            pathname: '/recipe',
            query: {
                recipeId: recipeId
            },
        });
    }

    const removeFromFavorites = (mealId) => {
        const updatedFavorites = favorites.filter(favorite => favorite.idMeal !== mealId);
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };
    const removeFavorite = async (mealId) => {
        console.log("meeeaal", mealId)
        const updatedFavorites = favorites.filter(favorite => favorite.idMeal !== mealId);

        try {
            const res = await axios.delete('https://nodejs-serverless-function-express-sigma-two-85.vercel.app/profile/remove-favorite',
                { data: { recipeId }, headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            console.log("res remove", res)
            setFavorites(updatedFavorites);
            console.log("favorite remove", favorites)
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <>
            <TopBar />
            <main className="flex flex-col items-center h-screen h-full min-h-1000">
                <div className="container mx-auto px-4 py-8 h-full">
                    <h1 className="text-3xl font-bold mb-4">List of your favourite meals</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 container h-full" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                        {favorites?.map((meal, index) => (
                            <a key={meal.idMeal} className="bg-white rounded-lg shadow-md overflow-hidden" onClick={() => { handleClickOnRecipe(meal?.idMeal) }}>
                                <img src={meal.strMealThumb} alt={meal.strMeal} className="w-full h-48 object-cover" />
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold mb-2 text-black">{meal.strMeal}</h3>
                                    <button onClick={() => removeFavorite(meal.idMeal)} className='text-black'>Remove to Favorites</button>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </main >
        </>
    );
}
