import { useEffect, useState } from 'react';
import TopBar from '@/composents/TopBar';
import { useRouter } from 'next/router';
import useMealApi from '@/hooks/useMealApi';

export default function SearchPage() {
    const router = useRouter();
    const { searchTerm } = router.query;
    const { searchMealsByName } = useMealApi();
    const [responseMeals, setResponseMeals] = useState([]);

    useEffect(() => {
        const getMealByName = async () => {
            const meals = await searchMealsByName(searchTerm);
            setResponseMeals(meals);
        };
        searchTerm && searchTerm !== null && searchTerm?.length > 0 && getMealByName();
    }, [searchTerm]);

    const handleClickOnRecipe = (recipeId) => {
        router.push({
            pathname: '/recipe',
            query: {
                recipeId: recipeId
            },
        });
    }

    return (
        <>
            <TopBar />
            <div className="container mx-auto mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {responseMeals && Array.isArray(responseMeals) && responseMeals.map(meal => (
                        <a key={meal.idMeal} className="bg-white rounded shadow p-4 transition duration-300 hover:shadow-lg" onClick={() => {handleClickOnRecipe(meal?.idMeal)}}>
                            <img src={meal.strMealThumb} alt={meal.strMeal} className="w-full h-auto mb-4 rounded" />
                            <h3 className="text-lg font-semibold text-black mb-2">{meal.strMeal}</h3>
                            <p className="text-sm text-gray-600 text-black mb-2">{meal.strCategory} - {meal.strArea}</p>
                            <p className="text-sm mb-4 text-black">{meal.strInstructions.substring(0, 100)}...</p>
                            <a href={meal.strYoutube} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline block">Watch Recipe</a>
                        </a>
                    ))}
                </div>
            </div>
        </>
    );
}
