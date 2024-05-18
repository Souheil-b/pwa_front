import { useEffect, useState } from 'react';
import TopBar from '@/composents/TopBar';
import { useRouter } from 'next/router';
import useMealApi from '@/hooks/useMealApi';
import useRequestAPI from '@/hooks/useRequestApi';
import axios from 'axios';

export default function RecipePage() {
    const router = useRouter();
    const { recipeId } = router.query;
    const { searchMealById } = useMealApi();
    const [recipeData, setRecipe] = useState([]);
    const instructionsArray = recipeData?.strInstructions?.split('\r\n').filter(instruction => instruction.trim() !== '');
    const [favorites, setFavorites] = useState([]);
    const [isAdded, setIsAdded] = useState(false);
    const { requestAddFavourite, requestDelFavourite } = useRequestAPI();
    const [cookieToken, setCookieToken] = useState("");
    const [error, setError] = useState('');
    const [newFavorite, setNewFavorite] = useState('');


    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedFavorites = localStorage.getItem('favorites');
            const connectCookie = localStorage.getItem('connectionCookie');
            storedFavorites && storedFavorites !== null && setFavorites(storedFavorites ? JSON.parse(storedFavorites) : []);
            connectCookie && connectCookie !== null && setCookieToken(connectCookie);
        }
    }, []);

    const addFavorite = async (meal) => {
        console.log("meaal que je teste", meal)
        if (!favorites.some(favorite => favorite.idMeal === meal.idMeal)) {
            const newFavorite = [...favorites, meal];
            console.log("new favorite before", newFavorite, favorites)
            try {
                const res = await axios.post('https://nodejs-serverless-function-express-sigma-two-85.vercel.app/profile/add-favorite',
                    { recipeId: meal.idMeal },
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                );
                console.log("res add", res)
                console.log("new favorite", newFavorite)
                setFavorites(newFavorite);
                console.log("favorites list add", favorites)
                setNewFavorite('');
                localStorage.setItem('favorites', JSON.stringify(newFavorite));
                setIsAdded(true);
            } catch (err) {
                setError(err.response?.data?.message || 'An error occurred');
                console.log(err);
            }
        }
        else
            console.log("KO")
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
            setIsAdded(false);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    useEffect(() => {
        const getMealById = async () => {
            const responseRecipe = await searchMealById(recipeId);
            setRecipe(responseRecipe);
        };
        const fillRecipeInstruction = () => {
            favorites.some(favorite => favorite.idMeal === recipeId) ? setIsAdded(true) : null;
            if (navigator.onLine) {
                recipeData.length === 0 ? getMealById() : null;
            } else {
                favorites.forEach((meal, index) => {
                    meal.idMeal === recipeId ? setRecipe(meal) : null;
                });
                console.log("Network is offline");
            }
        }
        recipeId && recipeId !== null && favorites && favorites !== null && fillRecipeInstruction()
    }, [recipeId, favorites]);

    const addToFavorites = async (meal) => {
        if (!favorites.some(favorite => favorite.idMeal === meal.idMeal)) {
            const newFavorites = [...favorites, meal];
            try {
                if (cookieToken?.length > 0) {
                    const added = await requestAddFavourite(recipeData?.idMeal, cookieToken)
                    console.log("fav add:", added);
                }
            } catch (error) {
                console.log("error", error);
            }
            setFavorites(newFavorites);
            localStorage.setItem('favorites', JSON.stringify(newFavorites));
            setIsAdded(true);
        }
    };

    const removeFromFavorites = async (mealId) => {
        const updatedFavorites = favorites.filter(favorite => favorite.idMeal !== mealId);
        try {
            if (cookieToken?.length > 0) {
                const added = await requestDelFavourite(recipeData?.idMeal, cookieToken)
                console.log("fav remove:", added);
            }
        } catch (error) {
            console.log("error", error);
        }
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        setIsAdded(false);
    };

    return (
        <>
            <TopBar />
            <div className="container mx-auto mt-8">
                <div className="max-w-3xl mx-auto bg-white rounded shadow p-6">
                    <h1 className="text-3xl font-semibold mb-4 text-black">{recipeData.strMeal}</h1>
                    <img src={recipeData.strMealThumb} alt={recipeData.strMeal} className="w-full h-auto mb-4 rounded" />
                    <p className="text-gray-600 text-sm mb-4">{recipeData.strCategory} - {recipeData.strArea}</p>
                    {
                        isAdded ?
                            <button onClick={() => removeFavorite(recipeData?.idMeal)} className='text-black  border border-red-500 px-4 py-2 rounded-md bg-transparent'>Remove from Favorites</button> :
                            <button onClick={() => addFavorite(recipeData)} className='text-black  border border-green-500 px-4 py-2 rounded-md bg-transparent'>Add to Favorites</button>
                    }

                    <div className="mb-4">
                        <h2 className="text-lg font-semibold mb-2 text-black">Instructions:</h2>
                        <ul className="list-disc pl-6">
                            {instructionsArray?.map((instruction, index) => (
                                <li key={index} className="text-sm text-black">{instruction}</li>
                            ))}
                        </ul>
                    </div>
                    <h2 className="text-lg font-semibold mb-2 text-black">List of ingredient:</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(recipeData)
                            .filter(([key, value]) => key.startsWith('strIngredient') && value)
                            .map(([key, value], index) => (
                                <div key={key} className="bg-gray-100 p-2 rounded">
                                    <p className="text-sm font-semibold text-black">{value}</p>
                                    <p className="text-xs text-gray-600">{recipeData[`strMeasure${key.slice(-1)}`]}</p>
                                </div>
                            ))}
                    </div>
                    {recipeData.strYoutube && (
                        <a href={recipeData.strYoutube} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline block mt-4">Watch Recipe Video</a>
                    )}
                </div>
            </div>
        </>
    );
}